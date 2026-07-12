import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear())
  await page.goto('/topics', { waitUntil: 'domcontentloaded' })
})

test('syllabus exposes the complete ML path', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Содержание курса' })).toBeVisible()
  await expect(page.getByText('Matplotlib и разведочный анализ данных', { exact: true })).toBeVisible()
  await expect(page.getByText('Линейные модели и регуляризация', { exact: true })).toBeVisible()
  await expect(page.getByText('Деревья, бэггинг и бустинг', { exact: true })).toBeVisible()
  await expect(page.getByText('Метод опорных векторов и кластеризация', { exact: true })).toBeVisible()
  await expect(page.getByText('240 интерактивных шагов')).toBeVisible()
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
