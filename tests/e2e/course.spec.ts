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
  await expect(page.getByText('14 модулей · 84 урока · 618 интерактивных шагов')).toBeVisible()
})

test('research lessons expose their individual learning design', async ({ page }) => {
  await page.goto('/topics/biomedical-leakage-pipeline/biomedical-leakage-pipeline-theory')
  await expect(page.getByText('клиническое расследование + 2 практики · ≈ 80 мин · 7 вопросов · 2 практики')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Утечка данных в биомедицинском исследовании' })).toBeVisible()
  await expect(page.getByText('Кейс Gamma Knife', { exact: true })).toBeVisible()
  await expect(page.getByText('Отбор top-genes до CV', { exact: true })).toBeVisible()
})

test('from-zero validation and NLP have distinct learning designs', async ({ page }) => {
  await page.goto('/topics/ml-split-strategy-lab/ml-split-strategy-lab-theory')
  await expect(page.getByText('пять предметных split-кейсов + 2 аудита · ≈ 105 мин · 9 вопросов · 2 практики')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Train, validation, evaluation и единица разбиения' })).toBeVisible()

  await page.goto('/topics/nlp-data-labels-tokenization/nlp-data-labels-tokenization-theory')
  await expect(page.getByText('лаборатория разметки + 2 проверки · ≈ 85 мин · 6 вопросов · 2 практики')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Текст становится исследовательскими данными' })).toBeVisible()
})

test('research lesson remains readable on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics')
  await expect(page.getByText('618 интерактивных шагов')).toBeVisible()
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
  for (let question = 0; question < 3; question += 1) {
    await page.getByRole('radio').first().check()
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

test('topics 4.1 and 4.2 keep one dataset while topic 4.1 stays concise', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-object')
  await expect(page.getByRole('heading', { name: 'Таблица для прогноза оттока' })).toBeVisible()
  await expect(page.getByText('C101', { exact: true })).toBeVisible()
  await expect(page.getByText('C106', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Роль каждого столбца' })).toHaveCount(0)
  await expect(page.getByText(/явно синтетический набор данных/)).toHaveCount(0)
  await expect(page.getByRole('figure')).toHaveCount(0)
  await page.screenshot({ path: '/tmp/ai-train-topic-4-1-desktop.png', fullPage: true })

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-x-y')
  await expect(page.getByRole('heading', { name: 'Извлечь целевую переменную через pop' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'y = data.pop("churn_after_30d")' })).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: 'feature_cols =' })).toHaveCount(0)
  await expect(page.getByText('X: (6, 3) y: (6,)', { exact: false })).toBeVisible()
  await expect(page.getByText(/Тариф пока остаётся строкой/)).toBeVisible()
  await expect(page.getByText(/теме 4\.16/)).toBeVisible()

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-leakage')
  await expect(page.getByRole('heading', { name: 'Не брать ответ и сведения из будущего' })).toBeVisible()
  await expect(page.getByText(/Если добавить такой будущий столбец в X, возникнет утечка данных/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Четыре разных источника утечки' })).toHaveCount(0)
  await expect(page.getByRole('figure')).toHaveCount(0)

  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-quiz')
  await expect(page.getByText(/Для клиента C106 нужно предсказать отток/)).toBeVisible()

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-model')
  await expect(page.getByRole('heading', { name: 'Вычислительное правило для прогноза' })).toBeVisible()
  await expect(page.getByText(/До fit: алгоритм \+ настройки/)).toBeVisible()
  await expect(page.getByText('estimator до fit', { exact: true })).toBeVisible()
  await expect(page.getByText('model после fit', { exact: true })).toBeVisible()
  const stateFigure = page.getByRole('figure')
  await expect(stateFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-foundations-model-fit-predict-2.png')
  await expect(stateFigure.locator('figcaption')).toContainText('гиперпараметр задан заранее')

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-fit')
  await expect(page.getByText(/оценивание параметров, правил или сводных значений/)).toBeVisible()
  await expect(page.getByText('most-frequent dummy', { exact: true })).toBeVisible()
  await expect(page.getByText(/Подробно.*теме 4\.15/)).toBeVisible()

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-predict')
  await expect(page.getByText(/X_new\.shape = \(1, 3\)/)).toBeVisible()
  await expect(page.getByText(/y_pred\.shape = \(1,\)/)).toBeVisible()
  await expect(page.locator('pre').filter({ hasText: "['нет']" })).toBeVisible()
  await expect(page.getByText('классификация, predict_proba', { exact: true })).toBeVisible()

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-compare')
  await expect(page.getByText(/Путь обучения \(training path\)/)).toBeVisible()
  await expect(page.getByText(/Путь применения \(inference path\)/)).toBeVisible()
  await expect(page.getByText(/те же признаки, в том же порядке, в тех же единицах/)).toBeVisible()
  const pathsFigure = page.getByRole('figure')
  await expect(pathsFigure.locator('img')).toHaveAttribute('src', '/course-visuals/ml-foundations-model-fit-predict.png')
  await expect(pathsFigure.locator('figcaption')).toContainText('y не входит в predict')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/topics/ml-foundations-data-target/ml-foundations-data-target-x-y')
  await expect(page.locator('.stepik-sidebar')).toBeHidden()
  await expect(page.getByRole('heading', { name: 'Извлечь целевую переменную через pop' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-topic-4-1-mobile.png', fullPage: true })

  await page.goto('/topics/ml-foundations-model-fit-predict/ml-foundations-model-fit-predict-compare')
  await expect(page.getByRole('figure').locator('figcaption')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
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

  await page.goto('/topics/validation-split/validation-split-theory')
  await expect(page.getByRole('heading', { name: 'У каждой части данных своя работа' })).toBeVisible()
  await expect(page.locator('.katex-display')).toHaveCount(0)
  await expect(page.getByText('Holdout-оценка')).toHaveCount(0)

  await page.goto('/topics/ml-math-vectors-gradients/ml-math-vectors-gradients-formula')
  await expect(page.getByRole('heading', { name: 'Длина вектора [3, 4]' })).toBeVisible()
  await expect(page.getByText('Длина вектора; лежит в основе расстояний и L2-регуляризации.')).toHaveCount(0)
})

test('block 4 visuals have semantic captions and follow their declared pedagogical placement', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/topics/validation-split/validation-split-theory')

  const validationFigures = page.getByRole('figure')
  await expect(validationFigures).toHaveCount(2)
  await expect(validationFigures.locator('figcaption')).toHaveCount(2)
  await expect(validationFigures.locator('figcaption').first()).toContainText('Что показано:')
  await expect(validationFigures.locator('figcaption').first()).toContainText('Как читать:')
  await expect(validationFigures.locator('figcaption').first()).toContainText('Главный вывод:')

  const validationDescriptions = await validationFigures.locator('img').evaluateAll((images) => images.map((image) => ({
    alt: image.getAttribute('alt') ?? '',
    caption: image.closest('figure')?.querySelector('figcaption')?.textContent ?? '',
  })))
  expect(new Set(validationDescriptions.map((item) => item.alt)).size).toBe(2)
  expect(new Set(validationDescriptions.map((item) => item.caption)).size).toBe(2)
  expect(validationDescriptions.every((item) => item.alt.length >= 40)).toBe(true)
  expect(validationDescriptions.every((item) => !item.alt.includes('Учебная иллюстрация к теме'))).toBe(true)

  const placementOrderIsValid = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h2')]
    const roles = headings.find((heading) => heading.textContent?.includes('У каждой части данных своя работа'))
    const hundred = headings.find((heading) => heading.textContent?.includes('Пример со 100 объектами'))
    const figures = [...document.querySelectorAll('figure')]
    if (!roles || !hundred || figures.length !== 2) return false
    return Boolean(roles.compareDocumentPosition(figures[0]) & Node.DOCUMENT_POSITION_FOLLOWING)
      && Boolean(figures[0].compareDocumentPosition(hundred) & Node.DOCUMENT_POSITION_FOLLOWING)
      && Boolean(hundred.compareDocumentPosition(figures[1]) & Node.DOCUMENT_POSITION_FOLLOWING)
  })
  expect(placementOrderIsValid).toBe(true)
  await page.screenshot({ path: '/tmp/ai-train-block4-visual-placement-desktop.png', fullPage: true })

  await page.goto('/topics/ml-problem-types/ml-problem-types-theory')
  await expect(page.getByRole('figure')).toHaveCount(1)
  await expect(page.getByRole('figure').locator('img')).toHaveAttribute('src', '/course-visuals/ml-problem-types.png')

  await page.goto('/topics/ml-problem-types/ml-problem-types-implementation')
  await expect(page.getByRole('figure')).toHaveCount(1)
  await expect(page.getByRole('figure').locator('img')).toHaveAttribute('src', '/course-visuals/ml-problem-types-2.png')

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
