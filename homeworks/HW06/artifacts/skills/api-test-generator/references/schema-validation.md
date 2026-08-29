# Schema validation

Source: the endpoint contract in `docs/eshop-sut/api_specification.md` and the extracted
`specs/openapi.yaml` after cross-checking.

Schema validation is black-box, specification-based contract checking. It is not named as
a separate ISTQB test-design technique in `docs/istqb/ch4_design.md`.

First compare `specs/openapi.yaml` with the original endpoint documentation. Resolve any
disagreement in favor of the original source or mark it unspecified. Then enumerate every
documented response variant by status code and content type.

For each variant, derive atomic assertions for applicable facets:

- exact documented status code and media type;
- body presence or absence and parseability;
- required properties present and optional properties allowed to be absent;
- primitive types, nullability, formats, enums, and documented ranges;
- nested object and array item shapes;
- documented forbidden or sensitive fields absent;
- error envelope shape and error-code type for each documented error response.

Do not assert property order, incidental fields, exact message wording, or constraints not
stated by the contract. If additional properties are not forbidden, do not assume a closed
schema. Separate "the contract is silent" from "the field must be absent."

Assign `SC-*` ids and trace each assertion to a response variant and source. Mark overlaps
such as password-field absence as composite schema plus security coverage. Report
`covered response variants / total documented variants` and list any variant without a
schema case.
