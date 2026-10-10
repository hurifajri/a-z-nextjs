import { randomUUID } from "node:crypto";
import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from "@playwright/test";

const password = "Latihan-buku-2026-saja";

async function registerInBrowser(page: Page) {
  await page.goto("/login");
  await page
    .getByRole("button", { name: "Belum punya akun? Daftar", exact: true })
    .click();
  await page.getByLabel("Nama", { exact: true }).fill("Pembaca Test");
  await page
    .getByLabel("Email", { exact: true })
    .fill(`buku-${randomUUID()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Daftar", exact: true }).click();
  await expect(page).toHaveURL(/\/suggestions$/);
}

test("usulan tersimpan setelah reload dan dapat dihapus pemilik", async ({
  page,
}) => {
  await registerInBrowser(page);
  const title = `Belajar React ${randomUUID()}`;
  await page.getByLabel("Judul buku", { exact: true }).fill(title);
  await page
    .getByLabel("Alasan usulan", { exact: true })
    .fill("Untuk latihan.");
  await page
    .getByRole("button", { name: "Simpan usulan", exact: true })
    .click();

  const card = page.getByRole("listitem").filter({
    has: page.getByRole("heading", { name: title, exact: true }),
  });
  await expect(card).toBeVisible();
  await page.reload();
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: "Hapus", exact: true }).click();
  await expect(card).toHaveCount(0);
  await page.reload();
  await expect(card).toHaveCount(0);
});

async function registerViaApi(client: APIRequestContext, name: string) {
  const response = await client.post("/api/auth/sign-up/email", {
    data: { name, email: `${randomUUID()}@example.com`, password },
  });
  expect(response.status()).toBe(200);
  // Set-Cookie dari server disimpan pada cookie jar context ini.
}

test("akun lain tidak dapat membaca atau mengubah usulan pemilik", async ({
  playwright,
  request,
  baseURL,
}) => {
  if (!baseURL) throw new Error("Atur use.baseURL pada playwright.config.ts.");
  expect((await request.get("/api/suggestions")).status()).toBe(401);

  // Origin eksplisit diperlukan untuk request API di luar fetch browser.
  const options = {
    baseURL,
    extraHTTPHeaders: { Origin: new URL(baseURL).origin },
  };
  const aisyah = await playwright.request.newContext(options);
  const hasan = await playwright.request.newContext(options);
  try {
    await registerViaApi(aisyah, "Aisyah");
    await registerViaApi(hasan, "Hasan");
    const values = {
      title: "Belajar React",
      reason: "Untuk latihan komponen.",
    };
    const created = await aisyah.post("/api/suggestions", { data: values });
    expect(created.status()).toBe(201);
    const saved = await created.json();
    expect(saved).toEqual({ id: expect.any(Number), ...values });

    const listHasan = await hasan.get("/api/suggestions");
    expect(listHasan.status()).toBe(200);
    expect(await listHasan.json()).toEqual([]);

    const path = `/api/suggestions/${saved.id}`;
    const changed = await hasan.patch(path, {
      data: { title: "Judul diubah Hasan", reason: "Alasan perubahan valid." },
    });
    expect(changed.status()).toBe(404);
    expect((await hasan.delete(path)).status()).toBe(404);

    const listAisyah = await aisyah.get("/api/suggestions");
    expect(listAisyah.status()).toBe(200);
    expect(await listAisyah.json()).toEqual([saved]);

    expect((await aisyah.delete(path)).status()).toBe(204);
    const empty = await aisyah.get("/api/suggestions");
    expect(empty.status()).toBe(200);
    expect(await empty.json()).toEqual([]);
  } finally {
    await aisyah.dispose();
    await hasan.dispose();
  }
});
