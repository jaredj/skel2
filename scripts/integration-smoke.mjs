#!/usr/bin/env node

const url = process.env.CF_INTEGRATION_TEST_URL;
const expected = process.env.CF_INTEGRATION_TEST_EXPECTED_TEXT;

if (!url) {
    console.error(
        "CF_INTEGRATION_TEST_URL is not defined. Set it to the deployed Cloudflare URL to test.",
    );
    process.exit(1);
}

async function main() {
    console.log(`Running Cloudflare integration smoke test against ${url}`);

    const response = await fetch(url, {
        headers: {
            "user-agent": "cloudflare-integration-smoke-test",
        },
    });

    console.log(`Received status ${response.status}`);

    if (!response.ok) {
        console.error(`Request failed with status ${response.status}.`);
        process.exit(1);
    }

    if (expected && expected.length > 0) {
        const body = await response.text();

        if (!body.includes(expected)) {
            console.error(
                `Expected to find "${expected}" in response body, but it was missing.`,
            );
            process.exit(1);
        }

        console.log(
            `Verified that response contains the expected text: "${expected}".`,
        );
    }

    console.log("Cloudflare integration smoke test passed.");
}

main().catch((error) => {
    console.error(
        "Cloudflare integration smoke test failed with an unhandled error.",
    );
    console.error(error);
    process.exit(1);
});
