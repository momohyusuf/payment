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
  const launcher = page.getByRole("button", {
    name: "Open NOVA AI",
    exact: true,
  });
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "NOVA AI", exact: true });
  const log = page.getByRole("log", { name: "Conversation with NOVA AI" });
  const composer = page.getByRole("textbox", { name: "Ask NOVA AI" });
  await dialog.waitFor();
  assert.equal(
    await composer.evaluate((el) => document.activeElement === el),
    true,
  );
  assert.equal(
    await page.getByRole("button", { name: "Send question" }).isDisabled(),
    true,
  );
  await page
    .getByRole("button", { name: "Understand cash flow", exact: true })
    .first()
    .click();
  await log
    .getByRole("heading", { name: "Your cash flow is moving forward" })
    .waitFor();
  await page.getByRole("button", { name: "Explain that", exact: true }).click();
  await log
    .getByRole("heading", { name: "Here is how to read your cash flow" })
    .waitFor();
  assert.equal(
    await log.getByRole("article", { name: "NOVA AI response" }).count(),
    2,
  );
  results.push(
    "Guided topics, contextual follow-ups, and two-turn conversation history",
  );

  await page
    .getByRole("combobox", { name: "AI reporting period" })
    .selectOption("7");
  await composer.fill("How is my cash flow?");
  await composer.press("Enter");
  assert.equal(
    await log.getByRole("article", { name: "NOVA AI response" }).count(),
    3,
  );
  const latest = log.getByRole("article", { name: "NOVA AI response" }).last();
  assert.ok((await latest.textContent()).includes("7-day snapshot"));
  assert.ok(
    (
      await log
        .getByRole("article", { name: "NOVA AI response" })
        .first()
        .textContent()
    ).includes("30-day snapshot"),
  );
  await composer.fill("line one");
  await composer.press("Shift+Enter");
  await composer.press("l");
  assert.ok((await composer.inputValue()).includes("\n"));
  assert.equal(
    await log.getByRole("article", { name: "NOVA AI response" }).count(),
    3,
  );
  await composer.fill(" ");
  assert.equal(
    await page.getByRole("button", { name: "Send question" }).isDisabled(),
    true,
  );
  await composer.fill("a".repeat(600));
  assert.equal((await composer.inputValue()).length, 500);
  await composer.fill("");
  results.push(
    "Reporting-period snapshots, Enter/Shift+Enter, empty input, and length limit",
  );

  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(
    await launcher.evaluate((el) => document.activeElement === el),
    true,
  );
  assert.equal(
    await page
      .getByRole("combobox", { name: "Reporting period", exact: true })
      .inputValue(),
    "7",
  );
  await launcher.click();
  assert.equal(
    await log.getByRole("article", { name: "NOVA AI response" }).count(),
    3,
  );
  await page.getByRole("button", { name: "Start a new conversation" }).click();
  assert.equal(
    await log.getByRole("article", { name: "NOVA AI response" }).count(),
    0,
  );
  assert.equal(
    await composer.evaluate((el) => document.activeElement === el),
    true,
  );
  results.push(
    "Escape, focus restoration, shared dashboard period, reopen persistence, and reset",
  );

  await page
    .getByRole("combobox", { name: "AI reporting period" })
    .selectOption("30");
  await page
    .getByRole("button", { name: "Review unusual payments", exact: true })
    .first()
    .click();
  await log
    .getByRole("heading", { name: "A payment deserves a second look" })
    .waitFor();
  await page
    .getByRole("button", {
      name: "How should I review this payment?",
      exact: true,
    })
    .click();
  await log.getByRole("heading", { name: "A guided payment review" }).waitFor();
  await composer.fill("help");
  await composer.press("Enter");
  await log
    .getByRole("heading", {
      name: "A good conversation starts with a question",
    })
    .waitFor();
  results.push("Guided payment review and explicit usage instructions");

  const containedFocus = () =>
    dialog.evaluate((el) => el.contains(document.activeElement));
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    assert.equal(await containedFocus(), true);
  }
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Shift+Tab");
    assert.equal(await containedFocus(), true);
  }
  results.push("Keyboard focus remains inside the modal");

  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(
      await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
      `modal overflow at ${width}px`,
    );
    const bounds = await dialog.boundingBox();
    assert.ok(
      bounds.x >= 0 &&
        bounds.y >= 0 &&
        bounds.x + bounds.width <= width &&
        bounds.y + bounds.height <= 844,
    );
    assert.ok(
      await page.getByRole("button", { name: "Send question" }).isVisible(),
    );
    await page.screenshot({
      path: `artifacts/nova-chat-${width}.png`,
      animations: "disabled",
    });
  }
  await page.setViewportSize({ width: 390, height: 568 });
  const mobile = await dialog.boundingBox();
  assert.ok(mobile.y >= 0 && mobile.y + mobile.height <= 568);
  const composerBounds = await composer.boundingBox();
  assert.ok(
    composerBounds.y + composerBounds.height <= mobile.y + mobile.height,
  );
  results.push(
    "1440/768/390px modal layouts and a short mobile viewport keep the composer visible",
  );
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: "passed", results }, null, 2));
} catch (error) {
  console.error(
    JSON.stringify(
      { errors, body: (await page.locator("body").innerText()).slice(-3500) },
      null,
      2,
    ),
  );
  await page.screenshot({ path: "artifacts/chat-failure.png" });
  throw error;
} finally {
  await browser.close();
}
