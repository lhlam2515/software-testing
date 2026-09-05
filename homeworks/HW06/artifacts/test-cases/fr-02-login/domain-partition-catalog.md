# FR-02 `POST /api/login` — Domain Partition Catalog (EP)

BVA model: not applied to `email`/`password` themselves. Both are format-only / unordered
string inputs with no documented length or numeric boundary at the login endpoint
(registration's password-complexity rule in FR-01 governs account creation, not credential
comparison at login; the API spec does not document a max length for either field). Per
`equivalence-partitioning-and-bva.md`, numeric/length BVA must not be invented where no
boundary is documented, so this catalog is EP-only for the request-body parameters.
Wrong-JSON-type values for `email`/`password` (e.g. number, array) are covered as schema
facets in `schema-cases.md` rather than duplicated here.

A genuine, documented numeric boundary does exist elsewhere in FR-02: the 30-second lockout
TTL (srs.md FR-02 line 42). Per `equivalence-partitioning-and-bva.md` ("the smallest
observable time unit for TTL" is a valid BVA domain), a 3-value BVA model is applied to
that boundary and recorded in `state-model.md` (BVA-01..BVA-03, extending TR-09), not
here, since the TTL is a state-transition property, not a request parameter.

| Row ID | Variable | Location | Coverage ID | Class / boundary position | Concrete value or rule | Expected behavior | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P-01 | email | body | EC-01 | Valid format, registered account, exact case match | `test@eshop.com` (paired with correct password) | Documented: proceeds to credential comparison; combined with EC-08 this is the success precondition | api_specification.md 1.2; srs.md FR-02 |
| P-02 | email | body | EC-02 | Valid format, registered account, different case than stored (case-sensitivity probe) | `TEST@ESHOP.COM` (paired with correct password for `test@eshop.com`) | UNSPECIFIED — neither source states whether email lookup is case-sensitive; do not invent match/no-match outcome | srs.md FR-02 (silent); flagged in specs/requirements.md |
| P-03 | email | body | EC-03 | Valid format, unregistered/non-existent account | `nobody-xyz@eshop.com` | Documented only at the level of "an appropriate error, cause not leaked" (srs.md FR-02 line 42); exact status/message UNSPECIFIED | srs.md FR-02 |
| P-04 | email | body | EC-04 | Invalid format (malformed) | `not-an-email` (no `@`/domain) | srs.md FR-02 line 44 documents HTML5 `type="email"` validation as a client-side (UI) constraint only; server-side enforcement and resulting status/body are UNSPECIFIED | srs.md FR-02 line 44 |
| P-05 | email | body | EC-05 | Empty string | `""` | Required field per api_specification.md 1.2 body sample; violates requiredness — exact status/body UNSPECIFIED | api_specification.md 1.2 |
| P-06 | email | body | EC-06 | Field absent from JSON body | (key omitted) | Required field per api_specification.md 1.2; distinct wire condition from EC-05 (absent key vs. empty string) — exact status/body UNSPECIFIED | api_specification.md 1.2 |
| P-07 | email | body | EC-07 | Valid format, registered account, extraneous leading/trailing whitespace | `" test@eshop.com "` | UNSPECIFIED — neither source states whether the server trims email before lookup | srs.md FR-02 (silent) |
| P-08 | password | body | EC-08 | Valid, matches stored credential for the given email | `Test1234!` (account default per srs.md section 1) | Documented: `200 OK` with `token` and `user` (api_specification.md 1.2), when paired with EC-01 | api_specification.md 1.2; srs.md section 1 |
| P-09 | password | body | EC-09 | Valid string, does not match stored credential | `WrongPass1!` | Documented: increments failed-attempt counter by 1 (srs.md FR-02 line 41); returns an appropriate error, cause not leaked — exact status/body UNSPECIFIED | srs.md FR-02 line 41-42 |
| P-10 | password | body | EC-10 | Empty string | `""` | Required field per api_specification.md 1.2 body sample; violates requiredness — exact status/body UNSPECIFIED | api_specification.md 1.2 |
| P-11 | password | body | EC-11 | Field absent from JSON body | (key omitted) | Required field per api_specification.md 1.2; distinct wire condition from EC-10 — exact status/body UNSPECIFIED | api_specification.md 1.2 |
| P-12 | password | body | EC-12 | Valid string, correct value with extraneous leading/trailing whitespace | `" Test1234! "` (account default password with padding) | UNSPECIFIED — neither source states whether the server trims password before comparison | srs.md FR-02 (silent) |
