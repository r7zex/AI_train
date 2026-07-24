import { expect, test } from '@playwright/test'

test('revised introductory topics introduce notation only after the task taxonomy', async ({ page }) => {
  await page.goto('/topics/ml-problem-types/ml-problem-types-foundations')
  await expect(page.getByRole('heading', { name: 'Обучение с учителем: правильные ответы известны' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Обучение без учителя: готовых ответов нет' })).toBeVisible()
  await expect(page.getByText(/\bX\b/)).toHaveCount(0)
  await expect(page.getByText(/\by\b/)).toHaveCount(0)

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-table')
  await expect(page.getByRole('heading', { name: 'Матрица признаков X и ответы y' })).toBeVisible()
  await expect(page.locator('pre').filter({
    hasText: 'X = df.drop(columns=["ушёл_через_30_дней", "client_id"])',
  })).toBeVisible()
  await expect(page.locator('pre').filter({
    hasText: 'y = df["ушёл_через_30_дней"]',
  })).toBeVisible()

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-leakage')
  await expect(page.getByRole('heading', { name: 'Сначала зафиксировать момент решения' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Прямая утечка: ответ уже спрятан во входе' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Временная утечка: сведения появились позже' })).toBeVisible()

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model')
  await expect(page.locator('pre').filter({ hasText: 'model.fit(X_train, y_train)' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'model.predict(X_test)' })).toBeVisible()
  await expect(page.getByText('model.coef_', { exact: true })).toBeVisible()
  await expect(page.getByText('model.intercept_', { exact: true })).toBeVisible()
})
