import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
  await page.goto('/topics', { waitUntil: 'domcontentloaded' })
})

test('syllabus exposes the complete ML and bioinformatics path', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Содержание курса' })).toBeVisible()
  await expect(page.getByText('Python-минимум перед анализом данных', { exact: true })).toBeVisible()
  await expect(page.getByText('Matplotlib и разведочный анализ данных', { exact: true })).toBeVisible()
  await expect(page.getByText('Линейные модели и регуляризация', { exact: true })).toBeVisible()
  await expect(page.getByText('Деревья, бэггинг и бустинг', { exact: true })).toBeVisible()
  await expect(page.getByText('Метод опорных векторов и кластеризация', { exact: true })).toBeVisible()
  await expect(page.getByText('Статистика и дизайн исследования', { exact: true })).toBeVisible()
  await expect(page.getByText('Биомедицинский ML без утечек', { exact: true })).toBeVisible()
  await expect(page.getByText('Гены, экспрессия и рак', { exact: true })).toBeVisible()
  await expect(page.getByText('Белки, последовательности и deep learning', { exact: true })).toBeVisible()
  await expect(page.getByText('NLP для биомедицины и научных текстов', { exact: true })).toBeVisible()
  await expect(page.getByText('От протокола до статьи', { exact: true })).toBeVisible()
  await expect(page.getByText('14 модулей · 77 уроков · 560 интерактивных шагов')).toBeVisible()
})

test('research lessons expose their individual learning design', async ({ page }) => {
  await page.goto('/topics/biomedical-leakage-pipeline/biomedical-leakage-pipeline-theory')
  await expect(page.getByText('клиническое расследование + 2 практики · ≈ 80 мин · 7 вопросов · 2 практики')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Утечка данных в биомедицинском исследовании' })).toBeVisible()
  await expect(page.getByText('Кейс Gamma Knife', { exact: true })).toBeVisible()
  await expect(page.getByText('Отбор top-genes до CV', { exact: true })).toBeVisible()
})

test('from-zero validation and NLP have distinct learning designs', async ({ page }) => {
  await page.goto('/topics/ml-validation-strategies/ml-validation-strategies-splits')
  await expect(page.getByText(/≈ 125 мин · 19 вопросов · 5 практик/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Train, validation и test' })).toBeVisible()

  await page.goto('/topics/nlp-data-labels-tokenization/nlp-data-labels-tokenization-theory')
  await expect(page.getByText('лаборатория разметки + 2 проверки · ≈ 85 мин · 6 вопросов · 2 практики')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Текст становится исследовательскими данными' })).toBeVisible()
})

test('research lesson remains readable on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics')
  await expect(page.getByText('560 интерактивных шагов')).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-topics-desktop.png' })

  await page.goto('/topics/biomedical-leakage-pipeline/biomedical-leakage-pipeline-theory')
  await expect(page.locator('.stepik-sidebar')).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-lesson-desktop.png' })

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'Утечка данных в биомедицинском исследовании' })).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-lesson-mobile.png' })
})

test('leaving a step automatically records completion', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-theory')
  await page.getByRole('link', { name: 'Следующий шаг →' }).click()
  await expect(page).toHaveURL(/matplotlib-basics-oo$/)

  const completed = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('ml-trainer-progress-v3') ?? '{}') as { completedSteps?: string[] }
    return state.completedSteps ?? []
  })
  expect(completed).toContain('matplotlib-basics-theory')
})

test('quiz gives immediate Stepik-like feedback and can be retried', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-quiz')
  const correctAnswers = [
    /область графика/,
    /явно указать изменяемую область графика/,
    /несколько серий, различаемых цветом или линией/,
  ]
  for (let question = 0; question < correctAnswers.length; question += 1) {
    await page.getByRole('radio', { name: correctAnswers[question] }).check()
    await page.locator('button:not([disabled])').filter({ hasText: 'Отправить' }).click()
    await expect(page.locator('p').filter({ hasText: 'Верно' })).toBeVisible()
    await page.getByRole('button', { name: question === 2 ? 'Завершить тест' : 'Следующий вопрос' }).click()
  }
  await expect(page.getByText('100%')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Решить снова' })).toBeVisible()
})

test('Matplotlib is a complete asynchronous module with local Russian definitions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-theory')
  await expect(page.getByText('объяснение → разбор кода → аудит ошибок → тест → практика · ≈ 70 мин · 3 вопроса · 1 практика')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Что именно создаёт Matplotlib' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Термины текущего шага' })).toBeVisible()
  await expect(page.getByText('область графика (Axes)')).toBeVisible()
  await expect(page.getByText('отдельная система координат внутри рисунка Matplotlib')).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-matplotlib-desktop.png' })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('heading', { name: 'Термины текущего шага' }).scrollIntoViewIfNeeded()
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await page.screenshot({ path: '/tmp/ai-train-matplotlib-glossary-mobile.png' })

  await page.goto('/topics/matplotlib-layout-export/matplotlib-layout-export-files')
  await expect(page.getByRole('heading', { name: 'PNG, SVG, PDF и разрешение' })).toBeVisible()
  await expect(page.getByText('сохранение рисунка (savefig)')).toBeVisible()
})

test('topics 4.1-4.3 follow the introductory ML sequence', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto('/topics/ml-problem-types/ml-problem-types-foundations')
  await expect(page.getByRole('heading', { name: 'Что машинное обучение делает с данными' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Обучение с учителем: правильные ответы известны' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Обучение без учителя: готовых ответов нет' })).toBeVisible()
  await expect(page.getByText(/признаки X/)).toHaveCount(0)
  await expect(page.getByText(/целевая переменная y/)).toHaveCount(0)
  await expect(page.getByRole('figure')).toHaveCount(1)
  await expect(page.getByRole('figure').locator('img')).toHaveAttribute('src', '/course-visuals/ml-4-1-task-map.svg')

  await page.goto('/topics/ml-problem-types/ml-problem-types-three-tasks')
  await expect(page.getByRole('heading', { name: 'Классификация: предсказать категорию' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Регрессия: предсказать число' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Кластеризация: найти группы' })).toBeVisible()
  await expect(page.getByRole('figure')).toHaveCount(0)

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-table')
  await expect(page.getByRole('heading', { name: 'Набор данных как таблица' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Объект, строка и столбец' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Признак, цель и разметка' })).toBeVisible()
  await expect(page.getByRole('figure')).toHaveCount(1)
  await page.screenshot({ path: '/tmp/ai-train-topic-4-2-desktop.png', fullPage: true })

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-leakage')
  await expect(page.getByRole('heading', { name: 'Прямая утечка: ответ уже спрятан во входе' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Временная утечка: сведения появились позже' })).toBeVisible()
  await expect(page.getByRole('figure')).toHaveCount(1)

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model')
  await expect(page.getByRole('heading', { name: 'Что такое модель и её параметры' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Сначала разбиение 80/20' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'test_size=0.2' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'random_state=42' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'shuffle=True' })).toBeVisible()
  await expect(page.getByText(/stratify.*классификации.*не используют/)).toBeVisible()
  const predictionFigure = page.getByRole('figure')
  await expect(predictionFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-4-3-linear-prediction.svg')
  await expect(predictionFigure.locator('figcaption')).toContainText('fit')
  await expect(page.locator('pre').filter({ hasText: 'model.fit(X_train, y_train)' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'y_pred = model.predict(X_test)' })).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model')
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'fit на train, predict на test' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await expect(page.getByRole('figure').locator('figcaption')).toBeVisible()
  await page.screenshot({ path: '/tmp/ai-train-topic-4-3-mobile.png', fullPage: true })
})

test('core ML theory has distinct raster visuals, plain-language explanations, and worked formulas', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/linear-regression/linear-regression-theory')
  await expect(page.getByRole('heading', { name: 'Как прямая превращает признаки в числовой прогноз' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Зачем нужен метод наименьших квадратов (МНК)' })).toBeVisible()
  await expect(page.getByText('МНК — не отдельная модель поверх линейной регрессии, а способ подобрать её коэффициенты.')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Прогноз квартиры' })).toBeVisible()
  const linearVisuals = page.getByRole('region', { name: 'Иллюстрации к теме' }).locator('img')
  await expect(linearVisuals).toHaveCount(2)
  await expect.poll(async () => linearVisuals.evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 1000))).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-linear-regression-desktop.png', fullPage: true })

  await page.goto('/topics/decision-trees/decision-trees-theory')
  await expect(page.getByRole('heading', { name: 'Путь одного объекта' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gini смешанного узла' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Иллюстрации к теме' }).locator('img')).toHaveCount(2)

  await page.goto('/topics/ml-validation-strategies/ml-validation-strategies-splits')
  await expect(page.getByRole('heading', { name: 'Train, validation и test' })).toBeVisible()
  await expect(page.locator('.katex-display')).toHaveCount(0)

  await page.goto('/topics/ml-math-optimization/ml-math-optimization-foundations')
  await expect(page.getByRole('heading', { name: 'Вектор объекта и матрица признаков' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Градиент и шаг параметров' })).toBeVisible()
})

test('block 4 visuals have semantic captions and follow their declared pedagogical placement', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/ml-validation-strategies/ml-validation-strategies-splits')

  const validationFigures = page.getByRole('figure')
  await expect(validationFigures).toHaveCount(1)
  await expect(validationFigures.locator('figcaption')).toHaveCount(1)
  await expect(validationFigures.locator('figcaption').first()).toContainText('Что показано:')
  await expect(validationFigures.locator('figcaption').first()).toContainText('Как читать:')
  await expect(validationFigures.locator('figcaption').first()).toContainText('Главный вывод:')

  const validationDescriptions = await validationFigures.locator('img').evaluateAll((images) => images.map((image) => ({
    alt: image.getAttribute('alt') ?? '',
    caption: image.closest('figure')?.querySelector('figcaption')?.textContent ?? '',
  })))
  expect(new Set(validationDescriptions.map((item) => item.alt)).size).toBe(1)
  expect(new Set(validationDescriptions.map((item) => item.caption)).size).toBe(1)
  expect(validationDescriptions.every((item) => item.alt.length >= 40)).toBe(true)
  expect(validationDescriptions.every((item) => !item.alt.includes('Учебная иллюстрация к теме'))).toBe(true)

  const placementOrderIsValid = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h2')]
    const roles = headings.find((heading) => heading.textContent?.includes('Случайное и стратифицированное разделение'))
    const figures = [...document.querySelectorAll('figure')]
    if (!roles || figures.length !== 1) return false
    return Boolean(roles.compareDocumentPosition(figures[0]) & Node.DOCUMENT_POSITION_FOLLOWING)
  })
  expect(placementOrderIsValid).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-block4-visual-placement-desktop.png', fullPage: true })

  await page.goto('/topics/ml-problem-types/ml-problem-types-foundations')
  await expect(page.getByRole('figure')).toHaveCount(1)
  await expect(page.getByRole('figure').locator('img')).toHaveAttribute('src', '/course-visuals/ml-4-1-task-map.svg')

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByRole('figure').locator('figcaption')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-block4-visual-placement-mobile.png', fullPage: true })
})

test('local comments control changes real UI state', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-theory')
  await page.getByPlaceholder('Написать комментарий').fill('Проверка обсуждения')
  await page.locator('button:not([disabled])').filter({ hasText: 'Отправить' }).click()
  await expect(page.getByText('Проверка обсуждения')).toBeVisible()
})

test('Python solution is checked against sample and hidden tests', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-practice')
  const editor = page.locator('.monaco-editor')
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText([
    'values = list(map(int, input().split()))',
    't = int(input())',
    'left = sum(value < t for value in values)',
    'right = sum(value >= t for value in values)',
    'print(left, right)',
  ].join('\n'))

  await page.locator('button:not([disabled])').filter({ hasText: 'Отправить' }).click()
  await expect(page.getByText(/Проверка пройдена/)).toBeVisible({ timeout: 45_000 })
  await expect(page.getByText('Скрытый сценарий пройден.')).toHaveCount(2)
})

test('editor offers context-aware Python completions', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-practice')
  const editor = page.locator('.monaco-editor')
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText('import numpy as np\nnp.')
  await page.keyboard.press('Control+Space')

  const suggestions = page.locator('.suggest-widget.visible')
  await expect(suggestions).toBeVisible()
  await expect(suggestions).toContainText('array')
  await expect(suggestions).toContainText('linspace')
})

test('a running Python program can be cancelled', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-practice')
  const editor = page.locator('.monaco-editor')
  await expect(editor).toBeVisible({ timeout: 30_000 })
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.insertText('while True:\n    pass')

  await page.getByRole('button', { name: 'Запустить' }).click()
  await page.getByRole('button', { name: 'Отменить' }).click()
  await expect(page.getByText(/Выполнение отменено пользователем/)).toBeVisible()
})
