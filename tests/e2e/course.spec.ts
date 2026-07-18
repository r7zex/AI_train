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
  await expect(page.getByText('14 модулей · 81 урок · 592 интерактивных шага')).toBeVisible()
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
  await expect(page.getByText('592 интерактивных шага')).toBeVisible()
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
  await expect(page).toHaveURL(/matplotlib-basics-parameters$/)

  const completed = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('ml-trainer-progress-v3') ?? '{}') as { completedSteps?: string[] }
    return state.completedSteps ?? []
  })
  expect(completed).toContain('matplotlib-basics-theory')
})

test('quiz gives immediate Stepik-like feedback and can be retried', async ({ page }) => {
  await page.goto('/topics/matplotlib-basics/matplotlib-basics-quiz')
  await page.getByRole('radio', { name: 'Axes' }).check()
  await page.locator('button:not([disabled])').filter({ hasText: 'Отправить' }).click()
  await expect(page.locator('p').filter({ hasText: 'Верно' })).toBeVisible()
  await page.getByRole('button', { name: 'Завершить тест' }).click()
  await expect(page.getByText('100%')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Решить снова' })).toBeVisible()
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
