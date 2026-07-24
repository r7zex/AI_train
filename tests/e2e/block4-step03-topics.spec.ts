import { expect, test } from '@playwright/test'

test('block 4 exposes exactly the revised 4.1–4.11 sequence and preserves deep checks', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 1024 })
  await page.goto('/topics')

  for (const title of [
    '4.1 Виды задач машинного обучения',
    '4.2 Объекты, признаки и целевая переменная',
    '4.3 Первая модель: линейная регрессия',
    '4.4 Baseline, метрики и цикл ML-проекта',
    '4.5 Стратегии разделения и кросс-валидация',
    '4.6 Подбор гиперпараметров',
    '4.7 Подготовка данных и безопасный Pipeline',
    '4.8 Математическая основа и оптимизация',
    '4.9 Вероятности, порог и надёжность прогноза',
    '4.10 Недообучение, переобучение и регуляризация',
    '4.11 Интерпретация и анализ ошибок',
  ]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible()
  }
  await expect(page.getByText(/^4\.12 /)).toHaveCount(0)
  await expect(page.getByText('560 интерактивных шагов')).toBeVisible()

  await page.goto('/topics/ml-validation-strategies/ml-validation-strategies-splits')
  await expect(page.getByRole('heading', { name: 'Train, validation и test' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Случайное и стратифицированное разделение' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Группы, источники и время' })).toBeVisible()
  const splitFigure = page.getByRole('figure')
  await expect(splitFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-4-5-split-strategies.svg')
  await expect(splitFigure.locator('figcaption')).toContainText('Что показано:')
  await expect(splitFigure.locator('figcaption')).toContainText('Как читать:')
  await expect(splitFigure.locator('figcaption')).toContainText('Главный вывод:')
  await page.screenshot({ path: '/tmp/ai-train-block4-revised-viewport.png' })
  await page.screenshot({ path: '/tmp/ai-train-block4-revised-desktop.png', fullPage: true })

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(splitFigure.locator('figcaption')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-block4-revised-mobile.png', fullPage: true })
})

test('revised theory covers every required block 4 concept with scoped visuals', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  const checks = [
    {
      route: '/topics/ml-problem-types/ml-problem-types-foundations',
      heading: 'Обучение с учителем: правильные ответы известны',
      visual: '/course-visuals/ml-4-1-task-map.svg',
    },
    {
      route: '/topics/ml-foundations-data-target/ml-foundations-data-target-table',
      heading: 'Матрица признаков X и ответы y',
      visual: '/course-visuals/ml-4-2-dataset-terms.svg',
    },
    {
      route: '/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model',
      heading: 'fit на train, predict на test',
      visual: '/course-visuals/ml-4-3-linear-prediction.svg',
    },
    {
      route: '/topics/ml-foundations-baseline-metrics-cycle/ml-foundations-baseline-metrics-cycle-classification',
      heading: 'Четыре клетки без перестановки FP и FN',
      visual: '/course-visuals/ml-4-4-confusion-imbalance.svg',
    },
    {
      route: '/topics/ml-validation-strategies/ml-validation-strategies-cv',
      heading: 'K-fold cross-validation',
      visual: '/course-visuals/ml-4-5-cross-validation.svg',
    },
    {
      route: '/topics/ml-hyperparameter-selection/ml-hyperparameter-selection-nested',
      heading: 'Два уровня с разными ролями',
      visual: '/course-visuals/ml-4-6-nested-search.svg',
    },
    {
      route: '/topics/ml-safe-preprocessing-pipeline/ml-safe-preprocessing-pipeline-code',
      heading: 'Один рабочий пример',
      visual: '/course-visuals/ml-4-7-pipeline.svg',
    },
    {
      route: '/topics/ml-math-optimization/ml-math-optimization-foundations',
      heading: 'Градиент и шаг параметров',
      visual: '/course-visuals/ml-4-8-learning-rates.svg',
    },
    {
      route: '/topics/ml-probability-reliability/ml-probability-reliability-calibration',
      heading: 'Bootstrap и практический 95%-интервал',
      visual: '/course-visuals/ml-4-9-bootstrap.svg',
    },
    {
      route: '/topics/ml-generalization-regularization/ml-generalization-regularization-complexity',
      heading: 'Недообучение, подходящая сложность и переобучение',
      visual: '/course-visuals/ml-4-10-complexity-curves.svg',
    },
    {
      route: '/topics/ml-interpretability-error-analysis/ml-interpretability-error-analysis-tools',
      heading: 'Связь не равна причинности',
      visual: '/course-visuals/ml-4-11-interpretability.svg',
    },
  ]

  for (const check of checks) {
    await page.goto(check.route)
    await expect(page.getByRole('heading', { name: check.heading })).toBeVisible()
    await expect(page.getByRole('figure').locator('img')).toHaveAttribute('src', check.visual)
  }

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-table')
  await expect(page.locator('pre').filter({
    hasText: 'X = df.drop(columns=["ушёл_через_30_дней", "client_id"])',
  })).toBeVisible()
  await expect(page.locator('pre').filter({
    hasText: 'y = df["ушёл_через_30_дней"]',
  })).toBeVisible()

  await page.goto('/topics/ml-problem-types/ml-problem-types-foundations')
  await expect(page.getByText(/\bX\b/)).toHaveCount(0)
  await expect(page.getByText(/\by\b/)).toHaveCount(0)
  expect(consoleErrors).toEqual([])
})
