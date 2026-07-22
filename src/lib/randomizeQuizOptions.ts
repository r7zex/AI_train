import type { Quiz, QuizOption } from '../data/quizzes'

export type QuizRandomSource = () => number

export function shuffleQuizOptions(
  options: QuizOption[],
  random: QuizRandomSource = Math.random,
): QuizOption[] {
  const shuffled = [...options]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const currentOption = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentOption
  }
  return shuffled
}

export function randomizeFourOptionSingleChoiceQuiz(
  quiz: Quiz,
  random: QuizRandomSource = Math.random,
): Quiz {
  let changed = false
  const questions = quiz.questions.map((question) => {
    if (question.type !== 'single' || question.options?.length !== 4) return question
    changed = true
    return {
      ...question,
      options: shuffleQuizOptions(question.options, random),
    }
  })

  return changed ? { ...quiz, questions } : quiz
}
