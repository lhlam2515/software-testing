# HAR recording checklist

`eshop-shopping.har` is intentionally not generated in advance. It must come
from the manual EShop session shown in the Stage S4 screencast.

1. Reset and start the performance database.
2. Open Chrome or Edge in Incognito mode.
3. Open Developer Tools > Network and enable **Preserve log**.
4. Record: login > products > search > product detail > cart > coupon > checkout.
5. Save all requests as `recordings/eshop-shopping.har` with content.
6. Redact cookies, authorization tokens, and sensitive values before sharing.
7. Keep only traffic to the local EShop hosts when converting the HAR.

Do not commit a HAR containing active tokens or personal data.
