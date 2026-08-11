# Test Data Design

## Data files

### `jmeter/data/users.csv`

- Columns: `email,password`
- Purpose: customer authentication data for login and checkout workflow
- Source: synthetic test accounts or verified demo accounts
- Auto-generatable: yes, if accounts are valid and unique
- Must come from real DB: not necessarily
- Manual verification: yes

### `jmeter/data/admin-users.csv`

- Columns: `email,password`
- Purpose: admin authentication for `GET /api/admin/orders`
- Source: verified admin credentials
- Auto-generatable: no
- Must come from real DB: yes, credentials must work in the live SUT
- Manual verification: yes

### `jmeter/data/products.csv`

- Columns: `product_id`
- Purpose: product selection for browsing/cart prep
- Source: live product catalog or confirmed fixture
- Auto-generatable: only after discovery from live API
- Must come from real DB: yes, product IDs must exist
- Manual verification: yes

### `jmeter/data/checkout-data.csv`

- Columns: `shipping_address`
- Purpose: checkout request body support
- Source: synthetic test addresses
- Auto-generatable: yes
- Must come from real DB: no
- Manual verification: yes

## Placeholder policy

If a request field is not confirmed by the available API documentation, keep it as a TODO in the JMX plan rather than inventing a value.

