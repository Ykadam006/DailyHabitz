import { test, expect } from "@playwright/test";

/** E2E: Signup → Login → Create habit → Mark done → streak + XP updates → Delete habit */
test.describe("Habit flow", () => {
  const ts = Date.now();
  const email = `e2e-${ts}@test.local`;
  const password = "password123";
  const name = "E2E User";

  test("full flow: signup, create habit, mark done, verify streak/xp, delete", async ({
    page,
  }) => {
    // Accept confirm dialog for delete
    page.on("dialog", (dialog) => dialog.accept());

    // 1. Signup
    await page.goto("/signup");
    await page.getByLabel("Name").fill(name);
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: /sign up/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: /Hi, E2E/i })).toBeVisible({
      timeout: 10000,
    });

    // 2. Create habit: open Add Habit sheet, use quick add "Drink Water"
    await page.getByRole("button", { name: /add habit/i }).click();
    await page.getByRole("button", { name: "Drink Water" }).click();

    // Wait for habit to appear in the list
    await expect(page.getByRole("heading", { name: "Drink Water", level: 3 })).toBeVisible({
      timeout: 8000,
    });

    // 3. Mark done
    await page.getByRole("button", { name: /mark done/i }).first().click();

    // 4. Verify streak + XP updates
    await expect(page.getByText("Streak: 1")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("XP: 10")).toBeVisible({ timeout: 5000 });

    // 5. Delete habit
    await page.getByRole("button", { name: /delete/i }).first().click();

    // 6. Verify habit is gone (or empty state)
    await expect(
      page.getByText(/add your first habit|no habits match|empty/i)
    ).toBeVisible({ timeout: 5000 });
  });
});
