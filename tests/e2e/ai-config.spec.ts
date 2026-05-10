import { expect, test } from "@playwright/test";

test("API exposes active AI provider configuration without secrets", async ({ request }) => {
  const response = await request.get("/api/config");
  await expect(response).toBeOK();
  const config = await response.json();
  expect(config.configured).toBe(true);
  expect(config.provider).toBe("yls");
  expect(config.baseUrl).toContain("ylsagi");
  expect(config.model).toBe("gpt-5.5");
  expect(JSON.stringify(config)).not.toContain("HUANWRITE_API_KEY");
  expect(JSON.stringify(config)).not.toContain("yls-");
});
