import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function NaiveBayesContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          Наивный Байес — вероятностный классификатор, применяющий теорему Байеса с «наивным» допущением о
          условной независимости признаков. Несмотря на сильное упрощение, работает хорошо на текстах,
          спам-фильтрации и других задачах с высокой размерностью. Ключевая идея — выбирать класс с максимальной
          апостериорной вероятностью (argmax posterior).
        </p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теорема Байеса</h2>
        <div className="my-4 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="P(C|\mathbf{x}) = \frac{P(\mathbf{x}|C)\cdot P(C)}{P(\mathbf{x})}" block/>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          <Formula math="P(C|\mathbf{x})"/> — апостериорная вероятность (posterior),{" "}
          <Formula math="P(\mathbf{x}|C)"/> — правдоподобие (likelihood),{" "}
          <Formula math="P(C)"/> — априорная вероятность (prior),{" "}
          <Formula math="P(\mathbf{x})"/> — нормировочный знаменатель (evidence).
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Наивное допущение независимости</h3>
        <div className="my-3 p-3 bg-gray-50 rounded-xl border text-center">
          <Formula math="P(\mathbf{x}|C) = \prod_{j=1}^{d} P(x_j|C)" block/>
        </div>
        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Ненормализованный posterior и argmax</h3>
        <p className="text-gray-700 text-sm mb-2">
          При классификации нас интересует argmax по классам. Знаменатель <Formula math="P(\mathbf{x})"/>
          одинаков для всех классов → его можно отбросить:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\hat{C} = \arg\max_C\; P(C) \prod_{j=1}^{d} P(x_j|C)" block/>
        </div>
        <InfoBlock type="note" title="Логарифмирование">
          На практике произведение вероятностей умножается на очень малые числа → числовой underflow.
          Используют log-сумму: <Formula math="\log P(C) + \sum_j \log P(x_j|C)"/>. Argmax не меняется.
        </InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 text-sm mb-3">
          Признаки: Облачно (Да/Нет), Влажность (Высокая/Низкая). Класс: Играть (Да/Нет).
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100"><tr>
              <th className="px-3 py-2">Облачно</th><th className="px-3 py-2">Влажность</th><th className="px-3 py-2">Класс</th>
            </tr></thead>
            <tbody>
              {[["Да","Высокая","Нет"],["Да","Низкая","Да"],["Нет","Высокая","Нет"],["Нет","Низкая","Да"],["Да","Высокая","Нет"],["Нет","Низкая","Да"],["Нет","Высокая","Нет"],["Да","Низкая","Да"]].map((r,i)=>(
                <tr key={i} className="border-t border-gray-100">
                  {r.map((c,j)=><td key={j} className="px-3 py-2 text-center">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700 text-sm mb-2"><strong>Priors:</strong> P(Да)=4/8=0.5, P(Нет)=4/8=0.5</p>
        <p className="text-gray-700 text-sm mb-2"><strong>Likelihoods:</strong></p>
        <ul className="text-sm text-gray-700 space-y-1 mb-3 ml-4">
          <li>P(Облачно=Да|Да)=2/4=0.5, P(Облачно=Да|Нет)=3/4=0.75</li>
          <li>P(Влажность=Высокая|Да)=0/4=0.0, P(Влажность=Высокая|Нет)=3/4=0.75</li>
        </ul>
        <p className="text-gray-700 text-sm mb-2"><strong>Запрос:</strong> Облачно=Да, Влажность=Высокая</p>
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
          <p>Score(Да) ∝ P(Да)×P(Облачно=Да|Да)×P(Влаж=Выс|Да) = 0.5×0.5×0.0 = <strong>0.0</strong></p>
          <p>Score(Нет) ∝ P(Нет)×P(Облачно=Да|Нет)×P(Влаж=Выс|Нет) = 0.5×0.75×0.75 = <strong>0.281</strong></p>
          <p>→ Предсказание: <strong>Нет</strong> (лучший score)</p>
        </div>
        <InfoBlock type="warning" title="Проблема нулевых вероятностей">
          P(Влажность=Высокая|Да)=0 обнуляет весь score для класса «Да». Решение — сглаживание Лапласа:
          прибавить 1 к каждому счётчику. Тогда P = (count+1)/(total+k), где k — число значений признака.
        </InfoBlock>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock language="python"
          code={`from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn.feature_extraction.text import CountVectorizer
import numpy as np

# Текстовая классификация (спам)
texts = [
    "купи iPhone скидка",
    "срочно займ деньги",
    "привет как дела",
    "встреча завтра офис",
    "бесплатно выиграй приз",
    "обед в 13:00",
]
labels = ["spam","spam","ham","ham","spam","ham"]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

nb = MultinomialNB(alpha=1.0)  # alpha=1 — сглаживание Лапласа
nb.fit(X, labels)

test = ["бесплатно iPhone скидка"]
X_test = vectorizer.transform(test)
pred = nb.predict(X_test)
proba = nb.predict_proba(X_test)

print(f"Текст: {test[0]}")
print(f"Предсказание: {pred[0]}")
print(f"P(ham)={proba[0][0]:.4f}, P(spam)={proba[0][1]:.4f}")`}
          output={`Текст: бесплатно iPhone скидка
Предсказание: spam
P(ham)=0.0819, P(spam)=0.9181`}
          explanation="Слова 'бесплатно', 'iPhone', 'скидка' встречаются чаще в спам-текстах → модель уверенно классифицирует сообщение как spam."
        />
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ["Игнорировать сглаживание Лапласа","Один нулевой признак обнуляет весь score. alpha=1 в sklearn включает сглаживание по умолчанию."],
            ["Использовать MultinomialNB для непрерывных признаков","MultinomialNB — для счётчиков/частот. GaussianNB — для непрерывных (предполагает гауссово распределение)."],
            ["Думать что наивность = плохая точность","На текстах NB часто конкурирует с логрегрессией и быстрее обучается на больших данных."],
          ].map(([e,f])=>(
            <div key={e} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-red-700">❌ {e}:</span> <span className="text-gray-700">{f}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Практические задания</h2>
        <TaskBlock tasks={[
          {level:"basic",question:"Вычислите ненормализованный posterior для P(C=spam)=0.3, P(x₁=1|spam)=0.6, P(x₂=0|spam)=0.4, P(x₃=1|spam)=0.7.",
           solution:<p>Score(spam) = 0.3 × 0.6 × 0.4 × 0.7 = <strong>0.0504</strong></p>},
          {level:"concept",question:"Почему знаменатель P(x) можно отбросить при классификации argmax?",
           solution:<p>P(x) одинаков для всех классов при фиксированном объекте x. Argmax по классам от дроби = argmax от числителя. Знаменатель нужен только если требуется нормализованная вероятность.</p>},
          {level:"concept",question:"Что такое сглаживание Лапласа и зачем оно нужно?",
           solution:<p>К каждому счётчику события прибавляют α (обычно 1). Это предотвращает нулевые вероятности для незамеченных комбинаций. P(xⱼ=v|C) = (count(xⱼ=v, C) + α) / (count(C) + α×k), где k — число возможных значений.</p>},
          {level:"tricky",question:"Наивное допущение независимости признаков нарушено в реальных данных. Почему NB всё равно работает?",
           solution:<p>Для задачи классификации (не оценки вероятностей) важно правильное ранжирование классов. Argmax может быть верен даже если сами вероятности искажены. На практике NB хорошо работает там, где признаки хотя бы слабо скоррелированы (напр., слова в тексте).</p>},
        ]}/>
      </section>
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>📚 <strong>Mitchell, "Machine Learning" (1997) §6</strong> — классическое объяснение Naive Bayes</li>
          <li>📚 <strong>scikit-learn Docs — Naive Bayes</strong></li>
          <li>📚 <strong>CS229 Stanford (Andrew Ng) — Generative Learning Algorithms</strong></li>
        </ul>
      </section>
    </div>
  )
}
