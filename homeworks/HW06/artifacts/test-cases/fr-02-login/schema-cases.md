# FR-02 `POST /api/login` — Schema Cases

Cross-check performed: `specs/openapi.yaml` `200` response matches
`api_specification.md` 1.2 ("Trả về chuỗi JWT `token` và thông tin `user`"). No
disagreement found. The `400`/`401`/`423` entries in `specs/openapi.yaml` are explicitly
marked as undocumented placeholders — no exact status code, media type, or error-body
schema is documented anywhere in the two sources. Per `schema-validation.md`, the
contract's silence is treated as "unspecified," not as "must be absent" or as license to
invent a shape. Cases against these placeholders therefore assert only what is logically
entailed by FR-02's own text (e.g. "returns an appropriate error," "shape must be
internally consistent") rather than a specific status code or field name.

Only one response variant is documented: `200`. Total documented variants: 1/1 covered
(SC-01..SC-07). SC-08 onward are additional schema-shape checks derived from FR-02's own
prose requirement (consistent, non-leaking error shape) and from general JSON-contract
robustness, not from a second documented response variant — flagged accordingly.

| Row ID | Response variant | Schema facet | Atomic assertion | Expected | Trace / overlap |
| --- | --- | --- | --- | --- | --- |
| SC-01 | `200` | Status code | Exact status code on valid credentials | `200` | api_specification.md 1.2 |
| SC-02 | `200` | Media type | Response `Content-Type` | `application/json` (implied by "Body (JSON)" convention used throughout api_specification.md; not stated per-endpoint — flagged as inferred, not explicit) | api_specification.md 1.2 (inferred) |
| SC-03 | `200` | Body parseability | Response body parses as valid JSON | Valid JSON object | api_specification.md 1.2 |
| SC-04 | `200` | Required property `token` | Present, type `string`, non-empty | Present, `string`, length > 0 | api_specification.md 1.2 |
| SC-05 | `200` | Required property `user` | Present, type object, non-null | Present, JSON object | api_specification.md 1.2 |
| SC-06 | `200` | Forbidden/sensitive field | `user` object (and response as a whole) must not contain `password` / `passwordHash` | Absent | Composite: schema + security (overlaps SEC-C-01, srs.md SEC-01) |
| SC-07 | `200` | Additional properties | Contract does not forbid extra top-level or `user` sub-fields | No closed-schema assumption made; extra fields are not a failure by themselves | api_specification.md 1.2 (silent -> not asserted) |
| SC-08 | error (400/401/423 placeholders) | Error envelope internal consistency | The error body shape (top-level key set) is the same across: empty email (EC-05), empty password (EC-10), wrong password for a known email (EC-09), unknown email (EC-03), and locked account (TR-07) | Same key set across all five conditions | srs.md FR-02 line 42 ("hệ thống trả về thông báo lỗi phù hợp"); shape itself UNSPECIFIED |
| SC-09 | error (401 placeholder) | Enumeration resistance (message content) | Error body/message for "unknown email" (EC-03) vs. "wrong password, known email" (EC-09) must not allow the client to distinguish which cause occurred | Content indistinguishable between the two conditions | srs.md FR-02 line 42 ("không để lộ chi tiết nguyên nhân") — this is the mandatory-coverage item "lockout message must not leak whether the email exists" |
| SC-10 | error (423 placeholder) | Sensitive-field absence under lockout | Locked-account error response must not contain `password`/`passwordHash` either | Absent | Composite: schema + security (SEC-01) |
| SC-11 | error (400/401/423 placeholders) | Status-code family | All five conditions in SC-08 return a non-`2xx` status | Non-`2xx` (exact code UNSPECIFIED — not asserted) | srs.md FR-02 line 42 |
| SC-12 | error (400 placeholder) | Wrong JSON type — `email` | `email` sent as a JSON number (`12345`) instead of string | Structured JSON error response, not a `500` with a raw stack trace; exact status/shape UNSPECIFIED | api_specification.md 1.2 (type implied by example, not explicitly typed) |
| SC-13 | error (400 placeholder) | Wrong JSON type — `password` | `password` sent as a JSON array (`["a","b"]`) instead of string | Structured JSON error response, not a `500` with a raw stack trace; exact status/shape UNSPECIFIED | api_specification.md 1.2 (type implied by example, not explicitly typed) |
| SC-14 | error (400 placeholder) | Malformed request body | Request body is not valid JSON at all (broken syntax) | Structured error response, not a raw stack trace / HTML error page; exact status/shape UNSPECIFIED | General JSON-API contract robustness — not explicitly documented, flagged as an inferred minimum expectation rather than an invented status code |
| SC-15 | error (400 placeholder) | Missing `Content-Type` header | Request sent with body but no `Content-Type: application/json` header | UNSPECIFIED — neither source states server behavior for this case | api_specification.md 1.2 (silent) |
