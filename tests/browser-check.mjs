import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const results = [];
try {
  await page.goto("http://127.0.0.1:5174", { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  const checkLayout = async (width) => {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `horizontal overflow at ${width}px`,
    );
    await page.screenshot({
      path: `artifacts/nova-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    results.push(`Layout and screenshot: ${width}px`);
  };
  for (const width of [1440, 768, 390]) await checkLayout(width);
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Close navigation" })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "The network" })
    .click();
  assert.equal(
    await page.getByRole("navigation", { name: "Mobile navigation" }).count(),
    0,
  );
  results.push("Mobile navigation opens and closes on selection");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Lagos ↔ Nairobi" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Lagos ↔ Nairobi" })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.getByRole("button", { name: "Try this route" }).click();
  const dialog = page.getByRole("dialog");
  assert.equal(
    await dialog.evaluate((el) => el.contains(document.activeElement)),
    true,
  );
  await page.locator("#transfer-amount").fill("0");
  await dialog.getByRole("button", { name: "Confirm demo payment" }).click();
  assert.ok(
    (await dialog.getByRole("alert").textContent()).includes("positive"),
  );
  await page.locator("#transfer-amount").fill("999999999");
  await dialog.getByRole("button", { name: "Confirm demo payment" }).click();
  assert.ok(
    (await dialog.getByRole("alert").textContent()).includes("exceeds"),
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(
    await page
      .getByRole("button", { name: "Try this route" })
      .evaluate((el) => document.activeElement === el),
    true,
  );
  results.push(
    "Transfer amount validation, Escape, contained focus, and focus restoration",
  );
  const before = Number(
    (await page.getByTestId("balance").textContent()).replace(/[^0-9.]/g, ""),
  );
  await page.getByRole("button", { name: "Try this route" }).click();
  await page.locator("#transfer-amount").fill("250000");
  await page.getByRole("button", { name: "Confirm demo payment" }).dblclick();
  await page
    .getByRole("heading", { name: "Demo payment delivered to Nairobi" })
    .waitFor();
  await page.getByRole("button", { name: "See updated activity" }).click();
  const after = Number(
    (await page.getByTestId("balance").textContent()).replace(/[^0-9.]/g, ""),
  );
  assert.equal(before - after, 250100);
  assert.equal(
    await page.getByText("Payment to Nairobi", { exact: true }).count(),
    1,
  );
  await page
    .getByRole("button", { name: "How is my cash flow?", exact: true })
    .click();
  await page.getByRole("dialog", { name: "NOVA AI", exact: true }).waitFor();
  const conversation = page.getByRole("log", {
    name: "Conversation with NOVA AI",
  });
  assert.ok(
    (await conversation.textContent()).includes(
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(after),
    ),
  );
  await page.keyboard.press("Escape");
  results.push(
    "Double-click sends once; balance decreases by amount + fee; ledger and AI update",
  );
  await page.getByLabel("Reporting period").selectOption("7");
  await page.getByLabel("Search transactions").fill("no such merchant");
  await page.getByText("No matching activity", { exact: true }).waitFor();
  await page.getByLabel("Search transactions").fill("");
  await page.getByRole("button", { name: "incoming", exact: true }).click();
  assert.equal(
    await page.getByText("Payment to Nairobi", { exact: true }).count(),
    0,
  );
  await page.getByRole("button", { name: "All activity", exact: true }).click();
  await page.getByLabel("Reporting period").selectOption("30");
  await page
    .getByRole("button", { name: "Show unusual payments", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "A payment deserves a second look" })
    .waitFor();
  await page.getByLabel("Ask NOVA AI").fill("Tell me tomorrow’s weather");
  await page.getByRole("button", { name: "Send question" }).click();
  await page
    .getByRole("heading", { name: "Let’s look at your financial activity" })
    .waitFor();
  await page.keyboard.press("Escape");
  results.push(
    "Period/filter/search controls, anomaly analysis, and unsupported AI questions",
  );
  await page.getByRole("button", { name: "Payment review" }).click();
  await page.getByText("Balance confirmed", { exact: false }).waitFor();
  await page.getByRole("button", { name: "Activity monitoring" }).click();
  await page.getByText("Outliers identified", { exact: false }).waitFor();
  results.push("Security controls change their diagram and description");
  await page.getByRole("button", { name: "Get early access" }).last().click();
  await page.getByLabel("Your work email").fill("invalid");
  await page.getByRole("button", { name: "Join the demo waitlist" }).click();
  await page.getByRole("alert").waitFor();
  await page.getByLabel("Your work email").fill("founder@example.com");
  await page.getByRole("button", { name: "Join the demo waitlist" }).click();
  await page
    .getByRole("heading", {
      name: "Demo registration complete—no email was submitted.",
    })
    .waitFor();
  await page.getByRole("button", { name: "Keep exploring" }).click();
  results.push(
    "Waitlist rejects invalid email and confirms demo without submission",
  );
  const animations = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector("path.animate-travel"))
        .animationName,
  );
  assert.equal(animations, "none");
  results.push("Reduced motion disables animated payment paths");
  assert.deepEqual(errors, []);
  results.push("No browser console or runtime errors");
  console.log(JSON.stringify({ status: "passed", results }, null, 2));
} catch (error) {
  console.error(
    JSON.stringify(
      {
        url: page.url(),
        errors,
        body: (await page.locator("body").innerText()).slice(0, 2500),
      },
      null,
      2,
    ),
  );
  await page.screenshot({
    path: "artifacts/browser-failure.png",
    fullPage: true,
  });
  throw error;
} finally {
  await browser.close();
}
