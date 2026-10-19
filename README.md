# Sauce Demo Playwright Automation

This Playwright Test scenario logs in to Sauce Demo, adds three products to the cart, verifies their names and prices, removes one product, and completes checkout.

## Run in Docker

```bash
docker build -t saucedemo-playwright .
docker run --rm --ipc=host \
  -v "$PWD/test-results:/app/test-results" \
  saucedemo-playwright
```

The container includes the matching Playwright version and Chromium browser. Dependencies are installed during the image build, so no Node.js or browser installation is needed on the host. Test results are written to `test-results/`.

The test uses Sauce Demo's published `standard_user` / `secret_sauce` credentials and demonstrates CSS, XPath, and Playwright `getBy*` locators.
# playwright-work
