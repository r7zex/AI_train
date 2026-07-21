import { expect, test } from '@playwright/test'

test('step 02 keeps class order consistent and does not present inference as test evaluation', async ({ page }) => {
  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-leakage')
  await expect(page.getByText(/строки связанной группы H1 попали и в train, и в test/)).toBeVisible()
  await expect(page.getByText(/строки связанной группы H3 попали и в train, и в test/)).toHaveCount(0)

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model')
  await expect(page.getByText(/classes_ = \[да, нет\].*\[2\/5, 3\/5\]/)).toBeVisible()
  await expect(page.getByText(/classes_ = \[нет, да\]/)).toHaveCount(0)

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-fit')
  await expect(page.getByText(/classes_ = \[да, нет\].*class_prior_ = \[2\/5, 3\/5\]/)).toBeVisible()

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-predict')
  await expect(page.getByText(/не является test-оценкой качества модели/)).toBeVisible()
  await expect(page.getByText('Не путать с проверкой', { exact: true })).toBeVisible()
  await expect(page.getByText(/C105 и C106 относятся к одной группе H3/)).toBeVisible()
  await expect(page.getByText(/нельзя использовать как независимый test-объект/)).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: "['да' 'нет'] [0.4 0.6]" })).toBeVisible()
})
