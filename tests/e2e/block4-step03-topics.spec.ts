import { expect, test } from '@playwright/test'

test('step 03 teaches honest evaluation with scoped visuals on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/ml-foundations-train-test-baseline-metrics/ml-foundations-train-test-baseline-metrics-split')

  await expect(page.getByRole('heading', { name: 'Почему проверка на знакомых строках нечестна' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Роли train, validation и test: пример 60/20/20' })).toBeVisible()
  await expect(page.getByText(/Один train\/test split показывает механику первого фиксированного запуска/)).toBeVisible()
  await expect(page.getByText(/Детерминированный парсинг даты/)).toBeVisible()
  await expect(page.getByText(/Seed отвечает на вопрос/)).toBeVisible()
  const rolesFigure = page.getByRole('figure')
  await expect(rolesFigure).toHaveCount(1)
  await expect(rolesFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-foundations-train-test-baseline-metrics.png')
  await expect(rolesFigure.locator('img')).toHaveAttribute('alt', /Четыре вертикально объединённые панели/)
  await expect(rolesFigure.locator('figcaption')).toContainText('четыре обязательных visual concepts')
  await expect.poll(async () => rolesFigure.locator('img').evaluate((image) => (
    (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 1000
  ))).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-step03-split-desktop.png', fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(rolesFigure.locator('figcaption')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-step03-metrics-mobile.png', fullPage: true })

  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto('/topics/ml-foundations-train-test-baseline-metrics/ml-foundations-train-test-baseline-metrics-baseline')
  await expect(page.getByText('baseline MAE=4.00', { exact: false })).toBeVisible()
  await expect(page.getByText('model MAE=2.33', { exact: false })).toBeVisible()
  await expect(page.getByText('−1.67', { exact: true })).toBeVisible()

  await page.goto('/topics/ml-foundations-train-test-baseline-metrics/ml-foundations-train-test-baseline-metrics-regression')
  await expect(page.getByText('MAE=2.333; MSE=7.000; RMSE=2.646; R²=0.625', { exact: true })).toBeVisible()
  await expect(page.getByText(/постоянный прогноз \[20, 20, 20\].*−1\.93/)).toBeVisible()
  await expect(page.getByText(/force_finite=False/)).toBeVisible()

  await page.goto('/topics/ml-foundations-train-test-baseline-metrics/ml-foundations-train-test-baseline-metrics-classification')
  await expect(page.getByText(/строки — правильный ответ, столбцы — прогноз модели/)).toBeVisible()
  await expect(page.getByText(/F1=2TP\/\(2TP\+FP\+FN\)=16\/\(16\+18\+2\)=16\/36=4\/9≈0\.444/)).toBeVisible()
  await expect(page.getByText(/precision=0\.308; recall=0\.800; F1=0\.444/)).toBeVisible()
})

test('step 03 frames an operational project cycle and keeps monitoring visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/ml-foundations-project-cycle/ml-foundations-project-cycle-churn-case')

  for (const field of ['Объект', 'Cutoff', 'Horizon', 'Действие', 'Target', 'Primary metric', 'Baseline']) {
    await expect(page.getByText(field, { exact: true }).first()).toBeVisible()
  }
  await expect(page.getByText(/последние 90 дней до `?t`? включительно/)).toBeVisible()
  await expect(page.getByText(/30 дней после `?t`?/).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Проверяем label и действие именно для этого кейса' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Не смешиваем модель, решение и бизнес-результат' })).toBeVisible()
  const canvasFigure = page.getByRole('figure')
  await expect(canvasFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-foundations-project-cycle.png')
  await expect(canvasFigure.locator('img')).toHaveAttribute('alt', /Две вертикально объединённые панели/)
  await expect(canvasFigure.locator('figcaption')).toContainText('project cycle with monitoring')
  await page.screenshot({ path: '/tmp/ai-train-step03-churn-desktop.png', fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(canvasFigure.locator('figcaption')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-step03-cycle-mobile.png', fullPage: true })

  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto('/topics/ml-foundations-project-cycle/ml-foundations-project-cycle-pipeline')
  await expect(page.getByRole('heading', { name: 'Почему это цикл, а не общий «pipeline проекта»' })).toBeVisible()
  await expect(page.getByText(/Pipeline.*программной цепочки преобразований и модели/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gate до моделирования: label наблюдаем и действие возможно?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'После внедрения: короткий контур мониторинга' })).toBeVisible()
  await expect(page.getByText(/data drift/).first()).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-step03-cycle-desktop.png', fullPage: true })
})
