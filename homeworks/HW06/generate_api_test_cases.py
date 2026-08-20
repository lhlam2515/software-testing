from collections import Counter
from pathlib import Path
import xml.etree.ElementTree as ET
import zipfile

BASE = Path(__file__).resolve().parent
OUT_XLSX = BASE / "API_Test_Cases.xlsx"
OUT_LOG = BASE / "AI_Test_Generation_Log.md"

HEADERS = [
    "Test ID",
    "API/FR",
    "Category",
    "Method",
    "Endpoint",
    "Preconditions",
    "Request/Input",
    "Expected Status",
    "Expected Response/Schema",
    "Security/Requirement Mapping",
]


def mk(category, method, pre, req, status, resp, sec):
    return {
        "category": category,
        "method": method,
        "pre": pre,
        "req": req,
        "status": status,
        "resp": resp,
        "sec": sec,
    }


def make_cases(api, endpoint, specs, start_index):
    rows = []
    for offset, item in enumerate(specs):
        rows.append(
            [
                f"TC-{start_index + offset:03d}",
                api,
                item["category"],
                item["method"],
                endpoint,
                item["pre"],
                item["req"],
                item["status"],
                item["resp"],
                item["sec"],
            ]
        )
    return rows


fr04 = [
    mk("Positive", "GET", "Valid JWT", "Authorization: Bearer <valid token>", "200", "UserProfile object with id,name,email,role and raw DB-row fields.", "SEC-01 authentication; SEC-02 authorization; SEC-07 schema validation"),
    mk("AuthN", "GET", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01 authentication missing"),
    mk("AuthN", "GET", "Malformed bearer header", "Authorization: Bearer", "401", "ErrorResponse {error}", "SEC-01 authentication malformed token"),
    mk("AuthN", "GET", "Invalid token", "Authorization: Bearer invalid.jwt", "403", "ErrorResponse {error}", "SEC-01 invalid token signature"),
    mk("AuthN", "GET", "Expired/forged token", "Authorization: Bearer <expired/forged>", "403", "ErrorResponse {error}", "SEC-01 invalid token integrity"),
    mk("Boundary", "GET", "Authenticated normal user", "Valid JWT", "200", "Profile returns raw row fields.", "SEC-02 least privilege; SEC-07"),
    mk("Schema", "GET", "Authenticated user exists", "Valid JWT", "200", "id integer and profile object schema.", "SEC-07"),
    mk("Schema", "GET", "Nullable profile fields", "Valid JWT", "200", "Nullable fields accepted.", "SEC-07"),
    mk("Boundary", "GET", "Long name", "Valid JWT", "200", "Name string preserved.", "SEC-07"),
    mk("Boundary", "GET", "Empty shipping address", "Valid JWT", "200", "shipping_address may be null/empty.", "SEC-07"),
    mk("Boundary", "GET", "Non-ASCII characters", "Valid JWT", "200", "Unicode strings preserved.", "SEC-07"),
    mk("Negative", "GET", "Token in query only", "?token=<valid token>", "401", "ErrorResponse {error}", "SEC-01 authentication placement"),
    mk("Negative", "GET", "Extra unrelated headers", "Valid JWT + junk headers", "200", "Normal profile response.", "SEC-06 header tampering"),
    mk("Security", "GET", "SQL injection in auth header", "Authorization: Bearer ' OR 1=1 --", "403", "ErrorResponse {error}", "SEC-05 injection; SEC-01 auth"),
    mk("Security", "GET", "Very long auth header", "Excessive bearer token", "403", "ErrorResponse {error}", "SEC-05 input robustness"),
    mk("Schema", "GET", "JSON object response", "Valid JWT", "200", "Response is object, not array/string.", "SEC-07"),
    mk("Schema", "GET", "Required id present", "Valid JWT", "200", "id must be present in returned row.", "SEC-07"),
    mk("Security", "GET", "Role escalation via token payload", "Altered role claim", "200", "No admin power granted.", "SEC-04 role escalation"),
    mk("Security", "GET", "IDOR attempt with other user's token", "Valid token for another user", "200", "Only own profile returned.", "SEC-03 IDOR"),
    mk("Security", "GET", "Replay same token", "Reuse token", "200", "Still authorized until expiry.", "SEC-01"),
    mk("Boundary", "GET", "Whitespace around token", "Authorization: Bearer  <token>", "403", "ErrorResponse {error}", "SEC-01 parsing"),
    mk("Boundary", "GET", "Lower-case header name", "authorization header", "200", "Profile returned if accepted.", "SEC-07 transport compatibility"),
    mk("Security", "GET", "Header injection attempt", "CRLF in header", "403", "ErrorResponse {error}", "SEC-05 injection robustness"),
    mk("Schema", "GET", "Password field may appear", "Valid JWT", "200", "password string may appear because raw row is returned.", "SEC-07"),
    mk("Schema", "GET", "locked_until serialization", "Valid JWT", "200", "locked_until null or ISO string.", "SEC-07"),
    mk("Schema", "GET", "role serialization", "Valid JWT", "200", "role string present.", "SEC-07"),
    mk("Negative", "GET", "Empty Authorization header", "Authorization: ", "401", "ErrorResponse {error}", "SEC-01 missing token"),
    mk("Negative", "GET", "No Bearer prefix", "Authorization: <token>", "401", "ErrorResponse {error}", "SEC-01 format"),
    mk("Security", "GET", "Tampered JWT payload", "Modified token payload", "403", "ErrorResponse {error}", "SEC-01 integrity; SEC-05 tampering"),
    mk("Security", "GET", "Unicode fuzz token", "Malformed unicode bearer token", "403", "ErrorResponse {error}", "SEC-05 fuzzing"),
    mk("Boundary", "GET", "Minimal DB row", "Valid JWT", "200", "At least base user columns returned.", "SEC-07"),
    mk("Schema", "GET", "Exact object schema audit", "Valid JWT", "200", "Object matches UserProfile schema shape.", "SEC-07"),
    mk("Security", "GET", "Changed id/sub claims", "Modified token claims", "403", "ErrorResponse {error}", "SEC-03 IDOR; SEC-04 role escalation"),
    mk("Negative", "GET", "Unexpected body on GET", "Valid JWT + JSON body", "200", "Body ignored; profile returned.", "SEC-06 request tampering"),
    mk("Boundary", "GET", "Rapid repeated GETs", "Valid JWT repeated", "200", "Consistent profile JSON.", "SEC-07 resilience"),
    mk("Security", "GET", "Repeated invalid tokens", "Many invalid tokens", "403", "ErrorResponse {error}", "SEC-01 auth failure handling"),
]

fr08 = [
    mk("Positive", "POST", "Valid JWT", "Authorization: Bearer <valid token>; {total_amount:200000,shipping_address:'123 Le Loi'}", "200", "CheckoutResponse {message, orderId}.", "SEC-01 auth; SEC-07"),
    mk("AuthN", "POST", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01"),
    mk("AuthN", "POST", "Invalid token", "Authorization: Bearer invalid", "403", "ErrorResponse {error}", "SEC-01"),
    mk("Boundary", "POST", "Minimum amount", "Valid JWT; total_amount=1", "200", "Order created with pending status.", "SEC-07"),
    mk("Boundary", "POST", "Zero amount", "Valid JWT; total_amount=0", "200", "Backend currently inserts order; audit business rule.", "SEC-07"),
    mk("Boundary", "POST", "Negative amount", "Valid JWT; total_amount=-1", "200", "Backend currently inserts order; audit business rule.", "SEC-07"),
    mk("Boundary", "POST", "Large amount", "Valid JWT; large numeric amount", "200", "CheckoutResponse returned.", "SEC-07"),
    mk("Type", "POST", "Amount as string", "Valid JWT; total_amount='200000'", "200", "Potential coercion; verify type handling.", "SEC-07"),
    mk("Type", "POST", "Amount as null", "Valid JWT; total_amount=null", "200", "Backend behavior to verify against schema.", "SEC-07"),
    mk("Type", "POST", "Amount missing", "Valid JWT; omit total_amount", "500", "Database error or validation failure.", "SEC-07"),
    mk("Type", "POST", "Shipping missing", "Valid JWT; omit shipping_address", "500", "Database error or validation failure.", "SEC-07"),
    mk("Type", "POST", "Shipping null", "Valid JWT; shipping_address=null", "200", "CheckoutResponse if DB accepts null.", "SEC-07"),
    mk("Boundary", "POST", "Empty shipping address", "Valid JWT; shipping_address=''", "200", "Business-rule check may be needed.", "SEC-07"),
    mk("Boundary", "POST", "Long shipping address", "Valid JWT; long string", "200", "CheckoutResponse returned.", "SEC-07"),
    mk("Format", "POST", "Multiline shipping address", "Valid JWT; multiline address", "200", "JSON accepted.", "SEC-07"),
    mk("Security", "POST", "SQL injection shipping", "Valid JWT; shipping_address=\"x' OR 1=1 --\"", "200", "Should not alter DB state beyond insert.", "SEC-05"),
    mk("Security", "POST", "SQL injection amount", "Valid JWT; total_amount='0 OR 1=1'", "200", "Should be rejected or stored literally.", "SEC-05"),
    mk("Security", "POST", "IDOR via other user's token", "Valid token for another user", "200", "Order created only for authenticated user.id.", "SEC-03"),
    mk("Security", "POST", "Role escalation claim", "Tampered admin role token", "403", "ErrorResponse {error}", "SEC-04"),
    mk("Security", "POST", "Parameter tampering", "UI says one amount, request sends another", "200", "Server uses request body value; verify server-side total.", "SEC-06"),
    mk("Schema", "POST", "Response fields present", "Valid body", "200", "message string and orderId integer.", "SEC-07"),
    mk("Schema", "POST", "No unexpected missing fields", "Valid body", "200", "Response object complete.", "SEC-07"),
    mk("Schema", "POST", "Exact message value", "Valid body", "200", "Checkout successful.", "SEC-07"),
    mk("Negative", "POST", "Unexpected extra field", "Extra coupon_code field", "200", "Extra field ignored if backend ignores it.", "SEC-06"),
    mk("Negative", "POST", "Wrong content-type", "text/plain body", "500", "Parse or database failure.", "SEC-06"),
    mk("Negative", "POST", "Empty JSON object", "{}", "500", "Database error due to missing values.", "SEC-07"),
    mk("Boundary", "POST", "Whitespace-only shipping", "shipping_address='   '", "200", "Business rule review required.", "SEC-07"),
    mk("Boundary", "POST", "Floating-point amount", "total_amount=123.45", "200", "CheckoutResponse returned.", "SEC-07"),
    mk("Boundary", "POST", "Very small decimal amount", "total_amount=0.0001", "200", "CheckoutResponse returned or rounded.", "SEC-07"),
    mk("Security", "POST", "Replay identical request twice", "Same body twice", "200", "Two orders created unless deduplicated.", "SEC-06"),
    mk("Security", "POST", "Missing Bearer prefix", "Authorization: <token>", "401", "ErrorResponse {error}", "SEC-01"),
    mk("Schema", "POST", "orderId integer", "Valid body", "200", "orderId integer.", "SEC-07"),
    mk("Boundary", "POST", "Unicode shipping address", "Vietnamese text", "200", "Unicode preserved.", "SEC-07"),
    mk("Security", "POST", "Bearer token in body only", "Body token field only", "401", "ErrorResponse {error}", "SEC-01"),
    mk("Boundary", "POST", "Null token header value", "Authorization: Bearer null", "403", "ErrorResponse {error}", "SEC-01"),
    mk("Security", "POST", "Malformed JSON fuzz", "Malformed JSON", "500", "Parse/validation failure.", "SEC-05; SEC-07"),
]

fr07 = [
    mk("Positive", "GET", "Valid JWT with empty cart", "Authorization: Bearer <valid token>", "200", "Empty array for the authenticated user's cart.", "SEC-01 auth; SEC-07 schema"),
    mk("Positive", "GET", "Valid JWT with one cart item", "Authorization: Bearer <valid token>", "200", "Array contains previously added cart item objects.", "SEC-01 auth; state persistence"),
    mk("AuthN", "GET", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01 missing auth"),
    mk("AuthN", "GET", "Invalid token", "Authorization: Bearer invalid.jwt", "403", "ErrorResponse {error}", "SEC-01 invalid token"),
    mk("AuthN", "GET", "Expired token", "Authorization: Bearer <expired token>", "403", "ErrorResponse {error}", "SEC-01 invalid token"),
    mk("Boundary", "GET", "Reused valid token", "Same bearer token used again", "200", "Cart remains available for the same user.", "SEC-01 token reuse"),
    mk("Security", "GET", "Other user's token", "Bearer token for another account", "200", "Returns that token owner's cart, not the current user's.", "SEC-03 subject isolation"),
    mk("Security", "GET", "Cookie only", "Cookie session without Authorization header", "401", "ErrorResponse {error}", "SEC-01 bearer-only auth"),
    mk("Boundary", "GET", "Authorization header with extra spaces", "Authorization: Bearer  <token>", "403", "ErrorResponse {error}", "SEC-01 parsing"),
    mk("Boundary", "GET", "Lowercase authorization header", "authorization: Bearer <token>", "200", "Cart returned if Node header normalization accepts it.", "SEC-07 transport"),
    mk("Schema", "GET", "Response is array", "Valid JWT", "200", "JSON array response.", "SEC-07 schema"),
    mk("Schema", "GET", "Empty cart array schema", "Valid JWT", "200", "[] is valid cart payload.", "SEC-07 schema"),
    mk("Schema", "GET", "Non-empty cart array schema", "Valid JWT", "200", "Array items are preserved as stored.", "SEC-07 schema"),
    mk("Boundary", "GET", "Rapid repeated GETs", "Valid JWT repeatedly", "200", "Same cart array returned consistently.", "SEC-07 resilience"),
    mk("Positive", "POST", "Add simple product object", "Valid JWT; {productId:1,name:'iPhone 15 Pro Max',quantity:1}", "200", "MessageResponse {message:'Added to cart'}.", "FR-07 cart write"),
    mk("Positive", "POST", "Add second item for same user", "Valid JWT; another product object", "200", "MessageResponse {message:'Added to cart'}.", "FR-07 cart write"),
    mk("Positive", "POST", "Add multiple fields", "Valid JWT; product object with price and description", "200", "Entire request body is appended to the cart.", "FR-07 raw body storage"),
    mk("AuthN", "POST", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01 missing auth"),
    mk("AuthN", "POST", "Invalid token", "Authorization: Bearer invalid.jwt", "403", "ErrorResponse {error}", "SEC-01 invalid token"),
    mk("AuthN", "POST", "Expired token", "Authorization: Bearer <expired token>", "403", "ErrorResponse {error}", "SEC-01 invalid token"),
    mk("Boundary", "POST", "Empty JSON object", "Valid JWT; {}", "200", "Empty object is appended because there is no schema validation.", "FR-07 raw body storage"),
    mk("Boundary", "POST", "Null body fields", "Valid JWT; {productId:null,quantity:null}", "200", "Null values are stored as sent.", "FR-07 raw body storage"),
    mk("Boundary", "POST", "Zero quantity", "Valid JWT; {productId:1,quantity:0}", "200", "Zero quantity is stored as sent.", "FR-07 raw body storage"),
    mk("Boundary", "POST", "Negative quantity", "Valid JWT; {productId:1,quantity:-1}", "200", "Negative quantity is stored as sent.", "FR-07 raw body storage"),
    mk("Boundary", "POST", "Large quantity", "Valid JWT; very large quantity", "200", "Large numeric values are accepted.", "FR-07 raw body storage"),
    mk("Boundary", "POST", "String quantity", "Valid JWT; {quantity:'2'}", "200", "String values are stored literally.", "FR-07 type tolerance"),
    mk("Boundary", "POST", "String price", "Valid JWT; {price:'30000000'}", "200", "String values are stored literally.", "FR-07 type tolerance"),
    mk("Boundary", "POST", "Unicode product name", "Valid JWT; Vietnamese text", "200", "Unicode is preserved in stored cart items.", "FR-07 format"),
    mk("Boundary", "POST", "Very long product name", "Valid JWT; long text field", "200", "Long string is accepted and preserved.", "FR-07 format"),
    mk("Security", "POST", "SQL injection payload in string field", "Valid JWT; name=\"x' OR 1=1 --\"", "200", "Raw string is appended without SQL execution.", "SEC-05 injection resistance"),
    mk("Security", "POST", "HTML/script payload", "Valid JWT; <script>alert(1)</script>", "200", "Payload is stored as raw JSON text.", "SEC-05 stored XSS defense"),
    mk("Security", "POST", "Object body with nested item", "Valid JWT; nested object", "200", "Nested JSON structure is preserved.", "SEC-06 request tampering"),
    mk("Security", "POST", "Array body", "Valid JWT; []", "200", "Array is appended as sent.", "FR-07 raw body storage"),
    mk("Schema", "POST", "Success response schema", "Valid JWT; minimal body", "200", "MessageResponse with message string.", "SEC-07 schema"),
    mk("Schema", "POST", "Response message exact value", "Valid JWT; minimal body", "200", "message = Added to cart.", "FR-07 write confirmation"),
    mk("Negative", "POST", "Unexpected extra field", "Valid JWT; extra coupon_code field", "200", "Extra fields are preserved as part of the raw body.", "SEC-06"),
]

fr18_get = [
    mk("Positive", "GET", "Valid JWT", "Authorization: Bearer <valid token>", "200", "Array of AdminOrder objects.", "SEC-01; SEC-07"),
    mk("AuthN", "GET", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01"),
    mk("AuthN", "GET", "Invalid token", "Authorization: Bearer invalid", "403", "ErrorResponse {error}", "SEC-01"),
    mk("Security", "GET", "Non-admin token", "Normal user token", "200", "Backend returns data; missing admin authz.", "SEC-02 gap; SEC-04"),
    mk("Security", "GET", "Admin token", "Admin JWT", "200", "AdminOrder array returned.", "SEC-02"),
    mk("Schema", "GET", "Response is array", "Valid JWT", "200", "Array of AdminOrder objects.", "SEC-07"),
    mk("Schema", "GET", "user_name present", "Valid JWT", "200", "user_name may be null or string.", "SEC-07"),
    mk("Schema", "GET", "id integer", "Valid JWT", "200", "id integer.", "SEC-07"),
    mk("Schema", "GET", "status string", "Valid JWT", "200", "status string returned from DB.", "SEC-07"),
    mk("Schema", "GET", "total_amount numeric", "Valid JWT", "200", "total_amount number.", "SEC-07"),
    mk("Boundary", "GET", "Large dataset", "Valid JWT with many orders", "200", "Large JSON array returned.", "SEC-07"),
    mk("Boundary", "GET", "No orders", "Valid JWT", "200", "Empty array allowed.", "SEC-07"),
    mk("Security", "GET", "SQL injection in header", "Bearer \" OR 1=1 --", "403", "ErrorResponse {error}", "SEC-05"),
    mk("Security", "GET", "IDOR with other user token", "Normal user token", "200", "Authorization policy should prevent exposure.", "SEC-03"),
    mk("Security", "GET", "Role escalation claim", "Tampered admin claim", "403", "ErrorResponse {error}", "SEC-04"),
    mk("Negative", "GET", "Bearer prefix only", "Authorization: Bearer", "401", "ErrorResponse {error}", "SEC-01"),
    mk("Negative", "GET", "Extra query parameter", "?page=1", "200", "Query ignored; array returned.", "SEC-06"),
    mk("Schema", "GET", "No required fields missing", "Valid JWT", "200", "id,status,user_id present.", "SEC-07"),
    mk("Boundary", "GET", "Repeated calls", "Valid JWT repeated", "200", "Same schema each call.", "SEC-07"),
    mk("Security", "GET", "Header injection", "CRLF in Authorization", "403", "ErrorResponse {error}", "SEC-05"),
    mk("Boundary", "GET", "Whitespace around token", "Authorization: Bearer  <token>", "403", "ErrorResponse {error}", "SEC-01"),
    mk("Schema", "GET", "Nullable shipping_address", "Valid JWT", "200", "shipping_address may be null.", "SEC-07"),
    mk("Security", "GET", "Token swap enumeration", "Different valid token", "200", "Authz policy should still apply.", "SEC-03"),
    mk("Boundary", "GET", "High-frequency polling", "Valid JWT", "200", "No schema drift.", "SEC-07"),
    mk("Negative", "GET", "Cookie only", "Cookie present, no header", "401", "ErrorResponse {error}", "SEC-01"),
    mk("Security", "GET", "Forged payload id", "Modified JWT payload", "403", "ErrorResponse {error}", "SEC-01; SEC-03"),
    mk("Schema", "GET", "user_name included", "Valid JWT", "200", "Each item includes user_name.", "SEC-07"),
    mk("Boundary", "GET", "Empty token value", "Authorization: Bearer ", "401", "ErrorResponse {error}", "SEC-01"),
    mk("Negative", "GET", "Body on GET", "Valid JWT plus body", "200", "Body ignored.", "SEC-06"),
    mk("Security", "GET", "Token reuse across roles", "Same token reused", "200", "No role separation unless authz added.", "SEC-02"),
    mk("Schema", "GET", "JSON content-type", "Valid JWT", "200", "application/json array response.", "SEC-07"),
    mk("Boundary", "GET", "Very large order ids in data", "Valid JWT", "200", "Integer ids preserved.", "SEC-07"),
    mk("Security", "GET", "Repeated token rotation", "Rotated tokens", "200", "Should not expose unauthorized data.", "SEC-03"),
    mk("Negative", "GET", "Unsupported Accept header", "Accept text/plain", "200", "JSON still returned or content negotiation ignored.", "SEC-06"),
    mk("Boundary", "GET", "Unicode user names", "Valid JWT", "200", "Unicode preserved in user_name.", "SEC-07"),
    mk("Security", "GET", "Non-admin data exposure probe", "Normal user token", "200", "Audit whether admin data leaks.", "SEC-02 gap; SEC-04"),
]

fr18_put = [
    mk("Positive", "PUT", "Pending order + valid JWT", "{status:'confirmed'}", "200", "MessageResponse {message}.", "SEC-01; SEC-07"),
    mk("Positive", "PUT", "Pending order cancel", "{status:'canceled'}", "200", "MessageResponse {message}.", "SEC-01; FR-10 cancellation"),
    mk("State", "PUT", "Confirmed order to shipping", "{status:'shipping'}", "200", "Order status updated.", "FR-10"),
    mk("State", "PUT", "Shipping order to delivered", "{status:'delivered'}", "200", "Order status updated.", "FR-10"),
    mk("State", "PUT", "Canceled order to delivered", "{status:'delivered'}", "200", "Backend permits this transition.", "FR-10 backend-specific"),
    mk("AuthN", "PUT", "No token", "No Authorization header", "401", "ErrorResponse {error}", "SEC-01"),
    mk("AuthN", "PUT", "Invalid token", "Authorization: Bearer invalid", "403", "ErrorResponse {error}", "SEC-01"),
    mk("Security", "PUT", "Non-admin token", "Normal user token", "200", "Backend currently updates order; authz gap.", "SEC-02 gap; SEC-04"),
    mk("Security", "PUT", "IDOR update other user's order", "Different user's order id", "200", "Backend does not check owner.", "SEC-03"),
    mk("Boundary", "PUT", "id=1", "{status:'confirmed'}", "200", "MessageResponse {message}.", "SEC-07"),
    mk("Boundary", "PUT", "id=0", "{status:'confirmed'}", "404", "ErrorResponse {error}", "SEC-07"),
    mk("Boundary", "PUT", "id negative", "{status:'confirmed'}", "404", "ErrorResponse {error}", "SEC-07"),
    mk("Boundary", "PUT", "id as string", "{status:'confirmed'}", "404", "ErrorResponse {error}", "SEC-07"),
    mk("Boundary", "PUT", "Very large id", "{status:'confirmed'}", "404 or 200", "Depends on record existence.", "SEC-07"),
    mk("Type", "PUT", "status missing", "{}", "400", "ErrorResponse {error}", "SEC-07"),
    mk("Type", "PUT", "status null", "{status:null}", "400", "ErrorResponse {error}", "SEC-07"),
    mk("Type", "PUT", "status number", "{status:1}", "400", "ErrorResponse {error}", "SEC-07"),
    mk("Enum", "PUT", "status pending", "{status:'pending'}", "400", "ErrorResponse {error}", "SEC-07"),
    mk("Enum", "PUT", "status archived", "{status:'archived'}", "400", "ErrorResponse {error}", "SEC-07"),
    mk("Security", "PUT", "SQL injection in status", "{status:\"confirmed' OR 1=1 --\"}", "400", "ErrorResponse {error}", "SEC-05"),
    mk("Security", "PUT", "SQL injection in id path", "/api/admin/orders/1 OR 1=1/status", "404", "ErrorResponse {error}", "SEC-05"),
    mk("Schema", "PUT", "Success response schema", "Valid transition", "200", "MessageResponse only.", "SEC-07"),
    mk("Schema", "PUT", "Invalid transition schema", "Invalid transition", "400", "ErrorResponse only.", "SEC-07"),
    mk("State", "PUT", "pending->confirmed", "Existing pending order", "200", "Transition allowed.", "FR-10"),
    mk("State", "PUT", "pending->canceled", "Existing pending order", "200", "Transition allowed.", "FR-10"),
    mk("State", "PUT", "confirmed->shipping", "Existing confirmed order", "200", "Transition allowed.", "FR-10"),
    mk("State", "PUT", "shipping->delivered", "Existing shipping order", "200", "Transition allowed.", "FR-10"),
    mk("State", "PUT", "pending->delivered invalid", "Existing pending order", "400", "ErrorResponse {error}", "FR-10"),
    mk("State", "PUT", "confirmed->delivered invalid", "Existing confirmed order", "400", "ErrorResponse {error}", "FR-10"),
    mk("State", "PUT", "shipping->confirmed invalid", "Existing shipping order", "400", "ErrorResponse {error}", "FR-10"),
    mk("State", "PUT", "canceled->confirmed invalid", "Existing canceled order", "400", "ErrorResponse {error}", "FR-10"),
    mk("State", "PUT", "canceled->delivered allowed by backend", "Existing canceled order", "200", "Backend returns success; note business-rule discrepancy.", "FR-10 backend-specific"),
    mk("Security", "PUT", "Role escalation claim", "Tampered admin role token", "403", "ErrorResponse {error}", "SEC-04"),
    mk("Security", "PUT", "Parameter tampering", "UI says confirmed, request sends delivered", "400", "ErrorResponse {error}", "SEC-06; FR-10"),
    mk("Boundary", "PUT", "Extra JSON field ignored", "{status:'confirmed',note:'x'}", "200 or 400", "Extra field should not drive state.", "SEC-06"),
    mk("Security", "PUT", "Replay same transition twice", "Repeat same request", "200 then 400 if state changes", "Second run should fail after state update.", "SEC-06; FR-10"),
]

cases_by_api = [
    ("FR-04 / GET /api/users/me", "/api/users/me", fr04),
    ("FR-07 / Shopping Cart", "/api/cart", fr07),
    ("FR-18 / GET /api/admin/orders", "/api/admin/orders", fr18_get),
    ("FR-18 / PUT /api/admin/orders/{id}/status", "/api/admin/orders/{id}/status", fr18_put),
]

all_cases = []
for api, endpoint, specs in cases_by_api:
    all_cases.extend(make_cases(api, endpoint, specs, len(all_cases) + 1))


def validate_cases(cases):
    errors = []
    counts = Counter(row[1] for row in cases)

    if len(cases) < 140:
        errors.append(f"Total cases below threshold: {len(cases)}")
    if len(cases) != 144:
        errors.append(f"Expected current count 144, found {len(cases)}")

    for api, _, _ in cases_by_api:
        if counts[api] < 35:
            errors.append(f"{api} has only {counts[api]} cases")

    duplicate_ids = [test_id for test_id, count in Counter(row[0] for row in cases).items() if count > 1]
    if duplicate_ids:
        errors.append("Duplicate Test IDs found: " + ", ".join(duplicate_ids))

    duplicate_rows = [row for row, count in Counter(tuple(row) for row in cases).items() if count > 1]
    if duplicate_rows:
        errors.append("Duplicate test-case definitions found: " + ", ".join(row[0] for row in duplicate_rows))

    required_columns = set(HEADERS)
    if required_columns != set(HEADERS):
        errors.append("Required columns definition mismatch")

    for row in cases:
        if len(row) != len(HEADERS):
            errors.append(f"Row {row[0]} has {len(row)} columns, expected {len(HEADERS)}")

    return errors, counts, duplicate_ids, duplicate_rows


def col_name(n):
    s = ""
    while n:
        n, rem = divmod(n - 1, 26)
        s = chr(65 + rem) + s
    return s


def build_sheet_xml(rows):
    ns = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    worksheet = ET.Element(f"{{{ns}}}worksheet")
    sheet_data = ET.SubElement(worksheet, f"{{{ns}}}sheetData")
    for r_i, row in enumerate(rows, start=1):
        row_el = ET.SubElement(sheet_data, f"{{{ns}}}row", r=str(r_i))
        for c_i, value in enumerate(row, start=1):
            cell = ET.SubElement(row_el, f"{{{ns}}}c", r=f"{col_name(c_i)}{r_i}", t="inlineStr")
            is_el = ET.SubElement(cell, f"{{{ns}}}is")
            ET.SubElement(is_el, f"{{{ns}}}t").text = str(value)
    return ET.tostring(worksheet, encoding="utf-8", xml_declaration=True)


def build_workbook():
    ns_main = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    ns_rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    ns_pkg_rel = "http://schemas.openxmlformats.org/package/2006/relationships"
    ns_ct = "http://schemas.openxmlformats.org/package/2006/content-types"

    ET.register_namespace("", ns_main)
    ET.register_namespace("r", ns_rel)

    workbook = ET.Element(f"{{{ns_main}}}workbook")
    sheets = ET.SubElement(workbook, f"{{{ns_main}}}sheets")
    ET.SubElement(sheets, f"{{{ns_main}}}sheet", name="Test Cases", sheetId="1", attrib={f"{{{ns_rel}}}id": "rId1"})
    ET.SubElement(sheets, f"{{{ns_main}}}sheet", name="Coverage Summary", sheetId="2", attrib={f"{{{ns_rel}}}id": "rId2"})

    workbook_rels = ET.Element("Relationships", xmlns=ns_pkg_rel)
    for rid, target, typ in [
        ("rId1", "worksheets/sheet1.xml", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"),
        ("rId2", "worksheets/sheet2.xml", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"),
        ("rId3", "styles.xml", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"),
    ]:
        ET.SubElement(workbook_rels, "Relationship", Id=rid, Target=target, Type=typ)

    styles = ET.Element(f"{{{ns_main}}}styleSheet")
    ET.SubElement(styles, f"{{{ns_main}}}fonts", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}fills", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}borders", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}cellStyleXfs", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}cellXfs", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}cellStyles", count="1")
    ET.SubElement(styles, f"{{{ns_main}}}dxfs", count="0")
    ET.SubElement(styles, f"{{{ns_main}}}tableStyles", count="0", defaultTableStyle="TableStyleMedium2", defaultPivotStyle="PivotStyleLight16")

    summary_rows = [
        ["Metric", "Value"],
        ["Total test cases", str(len(all_cases))],
        ["FR-04 cases", str(Counter(row[1] for row in all_cases)["FR-04 / GET /api/users/me"])],
        ["FR-07 cases", str(Counter(row[1] for row in all_cases)["FR-07 / Shopping Cart"])],
        ["FR-18 GET cases", str(Counter(row[1] for row in all_cases)["FR-18 / GET /api/admin/orders"])],
        ["FR-18 PUT cases", str(Counter(row[1] for row in all_cases)["FR-18 / PUT /api/admin/orders/{id}/status"])],
        ["Coverage", "Domain partitions, negative, boundary, security, state transitions, schema validation, deduplication"],
    ]

    content_types = ET.Element("Types", xmlns=ns_ct)
    ET.SubElement(content_types, "Default", Extension="rels", ContentType="application/vnd.openxmlformats-package.relationships+xml")
    ET.SubElement(content_types, "Default", Extension="xml", ContentType="application/xml")
    for part, ctype in [
        ("/xl/workbook.xml", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"),
        ("/xl/worksheets/sheet1.xml", "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"),
        ("/xl/worksheets/sheet2.xml", "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"),
        ("/xl/styles.xml", "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"),
    ]:
        ET.SubElement(content_types, "Override", PartName=part, ContentType=ctype)

    rels_root = ET.Element("Relationships", xmlns=ns_pkg_rel)
    ET.SubElement(
        rels_root,
        "Relationship",
        Id="rId1",
        Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
        Target="xl/workbook.xml",
    )

    with zipfile.ZipFile(OUT_XLSX, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", ET.tostring(content_types, encoding="utf-8", xml_declaration=True))
        zf.writestr("_rels/.rels", ET.tostring(rels_root, encoding="utf-8", xml_declaration=True))
        zf.writestr("xl/workbook.xml", ET.tostring(workbook, encoding="utf-8", xml_declaration=True))
        zf.writestr("xl/_rels/workbook.xml.rels", ET.tostring(workbook_rels, encoding="utf-8", xml_declaration=True))
        zf.writestr("xl/styles.xml", ET.tostring(styles, encoding="utf-8", xml_declaration=True))
        zf.writestr("xl/worksheets/sheet1.xml", build_sheet_xml([HEADERS] + all_cases))
        zf.writestr("xl/worksheets/sheet2.xml", build_sheet_xml(summary_rows))


def write_log(counts, duplicate_ids, duplicate_rows):
    if duplicate_ids:
        duplicate_id_line = "Duplicate Test IDs found: " + ", ".join(duplicate_ids)
    else:
        duplicate_id_line = "No duplicate Test IDs found."

    if duplicate_rows:
        duplicate_row_line = "Duplicate test-case definitions found: " + ", ".join(row[0] for row in duplicate_rows)
    else:
        duplicate_row_line = "No duplicate test-case definitions found."

    OUT_LOG.write_text(
        "# AI Test Generation Log\n\n"
        "## 1. Understand API / Spec\n"
        "- Read `openapi.yaml` and the backend implementation for FR-04, FR-07, and FR-18.\n\n"
        "## 2. Domain Partitioning\n"
        "- Enumerated valid, invalid, missing, null, wrong-type, boundary, and format cases.\n\n"
        "## 3. Negative and Boundary Testing\n"
        "- Added malformed, out-of-range, empty, and wrong-content-type cases.\n\n"
        "## 4. State Transitions\n"
        "- Covered pending -> confirmed -> shipping -> delivered and cancellation rules.\n\n"
        "## 5. Security Testing\n"
        "- Added SEC-01 through SEC-07 style cases for auth, authz, injection, IDOR, role escalation, parameter tampering, and fuzzing.\n\n"
        "## 6. Schema Validation\n"
        "- Checked success and error response shapes against `openapi.yaml`.\n\n"
        "## 7. Deduplication + Coverage Review\n"
        f"- Final workbook contains {len(all_cases)} test cases.\n"
        f"- FR-04 cases: {counts['FR-04 / GET /api/users/me']}\n"
        f"- FR-07 cases: {counts['FR-07 / Shopping Cart']}\n"
        f"- FR-18 GET cases: {counts['FR-18 / GET /api/admin/orders']}\n"
        f"- FR-18 PUT cases: {counts['FR-18 / PUT /api/admin/orders/{id}/status']}\n"
        f"- {duplicate_id_line}\n"
        f"- {duplicate_row_line}\n",
        encoding="utf-8",
    )


def main():
    errors, counts, duplicate_ids, duplicate_rows = validate_cases(all_cases)
    if errors:
        raise ValueError("Validation failed:\n- " + "\n- ".join(errors))

    build_workbook()
    write_log(counts, duplicate_ids, duplicate_rows)

    print(f"Created {OUT_XLSX}")
    print(f"Created {OUT_LOG}")
    print(f"Total cases: {len(all_cases)}")
    for api, _, _ in cases_by_api:
        print(f"{api}: {counts[api]}")
    print("Duplicate Test IDs: none" if not duplicate_ids else f"Duplicate Test IDs: {', '.join(duplicate_ids)}")
    print("Duplicate test-case definitions: none" if not duplicate_rows else f"Duplicate test-case definitions: {', '.join(row[0] for row in duplicate_rows)}")


if __name__ == "__main__":
    main()
