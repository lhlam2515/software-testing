# Postman Features

| Feature | Used? | How it was used | Evidence |
|---|---|---|---|
| Workspace | Yes | Postman workspace was used to organize the HW06 API testing assets. | [`evidence/workspace.png`](evidence/workspace.png) |
| Collection | Yes | The API tests are stored in the `EShop-API` collection. | [`postman/EShop-API.postman_collection.json`](postman/EShop-API.postman_collection.json), [`evidence/collection.png`](evidence/collection.png) |
| Folders | Yes | Requests are grouped, including a setup folder and test folders by API area. | [`postman/EShop-API.postman_collection.json`](postman/EShop-API.postman_collection.json) |
| Requests | Yes | The collection contains the actual API requests executed by Newman. | [`postman/EShop-API.postman_collection.json`](postman/EShop-API.postman_collection.json) |
| Environment | Yes | The `EShop-Environment` file stores base URL, credentials, tokens, and order IDs. | [`postman/EShop-Environment.postman_environment.json`](postman/EShop-Environment.postman_environment.json), [`evidence/environment.png`](evidence/environment.png) |
| Variables | Yes | Variables such as `baseUrl`, `studentId`, `userToken`, and `adminToken` are defined and reused. | [`postman/EShop-Environment.postman_environment.json`](postman/EShop-Environment.postman_environment.json), [`evidence/variable.png`](evidence/variable.png) |
| Environment variables | Yes | The environment variables drive requests, authentication, and stateful order references. | [`postman/EShop-Environment.postman_environment.json`](postman/EShop-Environment.postman_environment.json) |
| Pre-request scripts | Yes | The repository includes pre-request behavior for setup and header handling in the collection evidence. | [`postman/EShop-API.postman_collection.json`](postman/EShop-API.postman_collection.json) |
| Test scripts | Yes | The collection contains request-level test assertions used by Newman. | [`postman/EShop-API.postman_collection.json`](postman/EShop-API.postman_collection.json) |
| Assertions | Yes | Newman reports one assertion per executed request in the clean baseline. | [`newman-report.html`](newman-report.html) |
| Collection Runner | Yes | The suite was executed as a collection-based run rather than isolated single requests. | [`evidence/document.png`](evidence/document.png), [`newman-report.html`](newman-report.html) |
| Data-driven runs | Yes | A data-driven run was documented using `login-data.csv`. | [`evidence/data_driven.png`](evidence/data_driven.png), [`login-data.csv`](login-data.csv) |
| Data files | Yes | `login-data.csv` is used as the run data source. | [`login-data.csv`](login-data.csv) |
| Monitors | Yes | A monitor screenshot exists in the evidence folder. | [`evidence/monitor.png`](evidence/monitor.png) |
| Mock servers | Yes | A mock server screenshot exists in the evidence folder. | [`evidence/mock_server.png`](evidence/mock_server.png) |

