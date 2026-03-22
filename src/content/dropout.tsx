import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function DropoutContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Dropout</strong> — техника регуляризации, которая во время обучения случайно «выключает»
          нейроны с вероятностью <Formula math="p" />. На инференсе дропаут отключается, но возникает
          несоответствие масштаба активаций. Современный стандарт — <strong>inverted dropout</strong>:
          масштабирование происходит при обучении (делением на <Formula math="1-p" />), тогда на инференсе
          ничего менять не нужно.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Обычный dropout (наивный)</h3>
        <p className="text-gray-700 mb-2">
          При обучении каждый нейрон обнуляется с вероятностью <Formula math="p" />:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\tilde{h}_i = \begin{cases} 0 & \text{с вероятностью } p \\ h_i & \text{с вероятностью } 1-p \end{cases}" block />
        </div>
        <p className="text-gray-700 mb-3">
          При инференсе, чтобы ожидаемые активации совпали, нейроны масштабируются:{' '}
          <Formula math="\hat{h}_i = (1-p) \cdot h_i" />.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Inverted dropout (стандарт PyTorch)</h3>
        <p className="text-gray-700 mb-2">
          Масштабирование переносится в стадию обучения. Ненулевые активации делятся на <Formula math="(1-p)" />:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\tilde{h}_i = \begin{cases} 0 & \text{с вероятностью } p \\ \dfrac{h_i}{1-p} & \text{с вероятностью } 1-p \end{cases}" block />
        </div>
        <p className="text-gray-700 mb-1">
          Математическое ожидание активации при обучении:{' '}
          <Formula math="\mathbb{E}[\tilde{h}_i] = (1-p) \cdot \dfrac{h_i}{1-p} = h_i" />
        </p>
        <p className="text-gray-700 mb-3">
          На инференсе dropout отключается — никакого масштабирования не нужно.
        </p>

        <InfoBlock type="note" title="model.eval() в PyTorch">
          Вызов <code>model.eval()</code> переключает все слои <code>nn.Dropout</code> в режим инференса
          (проходит вход без изменений). <code>model.train()</code> — обратно в режим обучения.
          Это не влияет на вычисление градиентов — для этого используется <code>torch.no_grad()</code>.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Интуиция: зачем dropout работает?</h3>
        <div className="space-y-2">
          {[
            ['Ансамблирование', 'Каждый проход обучает случайную субсеть. Итоговая сеть — ансамбль из ≈2^n субсетей.'],
            ['Снижение ко-адаптации', 'Нейроны не могут полагаться друг на друга — вынуждены обучать более независимые признаки.'],
            ['Регуляризация весов', 'Dropout имплицитно добавляет шум, схожий с L2-регуляризацией весов.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-indigo-800">{title}: </span>
              <span className="text-gray-700">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример</h2>
        <p className="text-gray-700 mb-3">
          Слой с 5 нейронами, активации <Formula math="h = [1, 2, 3, 4, 5]" />, dropout p=0.4.
          Допустим, маска выключила нейроны 2 и 4 (индексы 1, 3).
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Нейрон</th>
                <th className="px-3 py-2">h</th>
                <th className="px-3 py-2">Маска</th>
                <th className="px-3 py-2">Naive train</th>
                <th className="px-3 py-2">Naive infer (×0.6)</th>
                <th className="px-3 py-2">Inverted train (÷0.6)</th>
                <th className="px-3 py-2">Inverted infer</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', '1', '1', '1', '0.6', '1.67', '1'],
                ['2', '2', '0', '0', '1.2', '0', '2'],
                ['3', '3', '1', '3', '1.8', '5.0', '3'],
                ['4', '4', '0', '0', '2.4', '0', '4'],
                ['5', '5', '1', '5', '3.0', '8.33', '5'],
              ].map(([n, h, m, nt, ni, it, ii]) => (
                <tr key={n} className={`border-t border-gray-100 ${m === '0' ? 'bg-red-50' : ''}`}>
                  <td className="px-3 py-2 text-center">{n}</td>
                  <td className="px-3 py-2 text-center font-mono">{h}</td>
                  <td className="px-3 py-2 text-center">{m === '1' ? '✓' : '✗'}</td>
                  <td className="px-3 py-2 text-center font-mono">{nt}</td>
                  <td className="px-3 py-2 text-center font-mono">{ni}</td>
                  <td className="px-3 py-2 text-center font-mono">{it}</td>
                  <td className="px-3 py-2 text-center font-mono">{ii}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Inverted infer = исходные h (масштабирования нет). Naive infer компенсирует масштаб умножением на (1-p).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn

torch.manual_seed(42)

# --- Демонстрация inverted dropout ---
dropout = nn.Dropout(p=0.5)
x = torch.ones(1, 10)

# Режим обучения: часть нейронов обнуляется, остальные масштабируются на 1/(1-p)=2
dropout.train()
out_train = dropout(x)
print("Train mode:", out_train)
print("Сумма (train):", out_train.sum().item())

# Режим инференса: вход не изменяется
dropout.eval()
out_eval = dropout(x)
print("Eval mode: ", out_eval)
print("Сумма (eval): ", out_eval.sum().item())

# --- Полная модель: разное поведение train vs eval ---
model = nn.Sequential(
    nn.Linear(8, 16),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(16, 1),
)

x_data = torch.randn(100, 8)

model.train()
preds_train = [model(x_data).detach() for _ in range(5)]
var_train = torch.stack(preds_train).var(dim=0).mean().item()

model.eval()
preds_eval = [model(x_data).detach() for _ in range(5)]
var_eval = torch.stack(preds_eval).var(dim=0).mean().item()

print(f"\\nДисперсия предсказаний (train mode): {var_train:.4f}")
print(f"Дисперсия предсказаний (eval mode):  {var_eval:.6f}")`}
          output={`Train mode: tensor([[0., 0., 2., 2., 2., 0., 2., 0., 2., 0.]])
Сумма (train): 8.0

Eval mode:  tensor([[1., 1., 1., 1., 1., 1., 1., 1., 1., 1.]])
Сумма (eval):  10.0

Дисперсия предсказаний (train mode): 0.2341
Дисперсия предсказаний (eval mode):  0.000000`}
          explanation="В режиме eval дропаут не применяется → предсказания детерминированы (дисперсия = 0). В train mode одинаковые входы дают разные выходы из-за случайных масок. Ненулевые значения масштабированы на 2 (= 1/(1-0.5))."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Забыть вызвать model.eval() при валидации/тесте', 'Дропаут останется активным, предсказания будут стохастическими и заниженными. Всегда: model.eval() перед оценкой.'],
            ['Путать model.eval() и torch.no_grad()', 'model.eval() отключает дропаут и BN; torch.no_grad() отключает граф вычислений. Обычно нужны оба при инференсе.'],
            ['Применять дропаут к выходному слою', 'Dropout перед финальным softmax/sigmoid искажает предсказания. Обычно дропаут ставят перед последним линейным слоем.'],
            ['Использовать большой p для маленьких сетей', 'Если p=0.5 и сеть маленькая, половина нейронов обнуляется — сеть просто не способна что-то выучить.'],
          ].map(([err, fix]) => (
            <div key={err} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-red-700">❌ {err}: </span>
              <span className="text-gray-700">{fix}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Практические задания</h2>
        <TaskBlock tasks={[
          {
            level: 'basic',
            question: 'Слой имеет 4 нейрона с активациями [2, 4, 6, 8]. Применяется inverted dropout с p=0.5, маска = [1,0,1,0]. Каков вывод слоя при обучении?',
            solution: <div><p>Масштабирование: делим ненулевые на (1-0.5) = 0.5, т.е. умножаем на 2:</p><p className="font-mono mt-1">маска: [1,0,1,0] → [2/0.5, 0, 6/0.5, 0] = <strong>[4, 0, 12, 0]</strong></p></div>,
          },
          {
            level: 'concept',
            question: 'Зачем нужен inverted dropout? В чём недостаток «наивного» dropout?',
            solution: <div><p><strong>Наивный dropout</strong> требует умножать все активации на (1-p) при инференсе — нужно помнить значение p и изменять код. <strong>Inverted dropout</strong> переносит масштабирование в обучение: инференс-код ничего не знает про dropout и работает без изменений. Это удобно и снижает вероятность ошибок.</p></div>,
          },
          {
            level: 'concept',
            question: 'Почему предсказания нейросети с dropout стохастичны в train mode, но детерминированы в eval mode?',
            solution: <p>В train mode на каждом forward pass генерируется новая случайная маска — нейроны выключаются по-разному. В eval mode маска не применяется, вход проходит без изменений, поэтому при одинаковом входе всегда один и тот же выход.</p>,
          },
          {
            level: 'code',
            question: 'Реализуйте функцию inverted_dropout(x, p, training) на чистом PyTorch (без nn.Dropout).',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`def inverted_dropout(x, p=0.5, training=True):
    if not training or p == 0:
        return x
    # Бернулли маска: 1 с вероятностью (1-p)
    mask = (torch.rand_like(x) > p).float()
    return x * mask / (1 - p)`}</pre>,
          },
          {
            level: 'tricky',
            question: 'MC Dropout — что это такое и зачем применять dropout на инференсе намеренно?',
            solution: <div><p><strong>Monte Carlo Dropout</strong> (Gal & Ghahramani, 2016): оставляем dropout активным при инференсе и делаем T прогонов одного входа. Среднее T предсказаний — оценка алеаторической/эпистемической неопределённости. Это позволяет получить байесовскую неопределённость «бесплатно» без изменения архитектуры.</p><p className="mt-1">Реализация: <code>model.train()</code> при инференсе, усреднение T выходов.</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Srivastava et al., 2014 — "Dropout: A Simple Way to Prevent Neural Networks from Overfitting"</strong> — оригинальная статья</li>
          <li>📚 <strong>Gal & Ghahramani, 2016 — "Dropout as a Bayesian Approximation"</strong> — MC Dropout</li>
          <li>📚 <strong>PyTorch Docs — nn.Dropout</strong> — документация по inverted dropout в PyTorch</li>
          <li>📚 <strong>Goodfellow et al., "Deep Learning" §7.12</strong> — теоретическое обоснование дропаута</li>
        </ul>
      </section>
    </div>
  )
}
