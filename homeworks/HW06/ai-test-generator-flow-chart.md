# AI Test Generator

## Test Generation Flow

```mermaid
flowchart TD
    A[API specification / OpenAPI] --> B[Parse selected FRs and endpoints]
    B --> C[Create structured test-case rows]
    C --> D[Domain partitions]
    C --> E[Boundary values]
    C --> F[State-transition ideas]
    C --> G[Security cases]
    C --> H[Schema / type checks]
    D --> I[Validate duplicates and completeness]
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J[Generate Excel test-case dataset]
    J --> K[Audit and correct cases]
    K --> L[Postman collection]
    L --> M[Newman execution]
    M --> N[Test report]