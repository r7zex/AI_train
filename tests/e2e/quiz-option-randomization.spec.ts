import { expect, test } from '@playwright/test'
import type { Quiz } from '../../src/data/quizzes'
import { randomizeFourOptionSingleChoiceQuiz } from '../../src/lib/randomizeQuizOptions'

const quiz: Quiz = {
  id: 'quiz-randomization-check',
  title: 'Проверка перестановки',
  description: 'Тестовый квиз',
  sectionId: 'test-section',
  questions: [
    {
      id: 'four-options',
      topicId: 'test-topic',
      sectionId: 'test-section',
      type: 'single',
      question: 'Какой вариант правильный?',
      options: [
        { id: 'a', text: 'Правильный' },
        { id: 'b', text: 'Второй' },
        { id: 'c', text: 'Третий' },
        { id: 'd', text: 'Четвёртый' },
      ],
      correctAnswer: 'a',
      explanation: 'Правильность задаётся идентификатором, а не позицией.',
      difficulty: 'easy',
    },
    {
      id: 'three-options',
      topicId: 'test-topic',
      sectionId: 'test-section',
      type: 'single',
      question: 'Этот порядок должен сохраниться.',
      options: [
        { id: 'a', text: 'Первый' },
        { id: 'b', text: 'Второй' },
        { id: 'c', text: 'Третий' },
      ],
      correctAnswer: 'a',
      explanation: 'Рандомизируются только вопросы с четырьмя вариантами.',
      difficulty: 'easy',
    },
  ],
}

test('перемешивает только четыре варианта и сохраняет correctAnswer', () => {
  const randomized = randomizeFourOptionSingleChoiceQuiz(quiz, () => 0)

  expect(randomized.questions[0].options?.map((option) => option.id)).toEqual(['b', 'c', 'd', 'a'])
  expect(randomized.questions[0].correctAnswer).toBe('a')
  expect(randomized.questions[1].options?.map((option) => option.id)).toEqual(['a', 'b', 'c'])
  expect(quiz.questions[0].options?.map((option) => option.id)).toEqual(['a', 'b', 'c', 'd'])
})
