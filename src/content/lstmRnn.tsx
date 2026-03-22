import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function LstmRnnContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Vanilla RNN</strong> обрабатывает последовательности, но страдает от затухающего
          градиента на длинных зависимостях. <strong>LSTM</strong> (Long Short-Term Memory) решает
          эту проблему с помощью явного <em>состояния ячейки</em> (<Formula math="c_t" />) и трёх вентилей
          (gates), которые регулируют поток информации. <strong>GRU</strong> — упрощённая версия LSTM
          с двумя вентилями и меньшим числом параметров.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Проблема Vanilla RNN</h2>
        <p className="text-gray-700 mb-3">
          В vanilla RNN скрытое состояние обновляется как:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="h_t = \tanh(W_h h_{t-1} + W_x x_t + b)" block />
        </div>
        <p className="text-gray-700 mb-3">
          При BPTT (backpropagation through time) градиент в шаге <Formula math="t=0" /> содержит:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\frac{\partial h_T}{\partial h_0} = \prod_{t=1}^{T} \frac{\partial h_t}{\partial h_{t-1}} = \prod_{t=1}^{T} W_h \cdot \text{diag}(\tanh'(z_t))" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          <Formula math="\tanh'(z) \leq 1" />, и если <Formula math="\|W_h\| < 1" />, произведение за T шагов → 0.
          При T=100 с множителями 0.9 получаем <Formula math="0.9^{100} \approx 2.6 \times 10^{-5}" />.
        </p>
        <InfoBlock type="warning" title="Практический эффект">
          Vanilla RNN не может обучить зависимость «помни начало предложения для предсказания конца».
          Это мотивирует LSTM, где состояние ячейки передаётся с минимальными изменениями.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">LSTM: формулы вентилей</h2>
        <p className="text-gray-700 mb-3">
          На каждом шаге LSTM вычисляет 4 вектора от конкатенации{' '}
          <Formula math="[h_{t-1}, x_t]" />:
        </p>

        <div className="space-y-3">
          {([
            { label: 'Вентиль забывания (forget gate)', cls: 'border-red-200 bg-red-50', formula: 'f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)', desc: 'Какую часть старого состояния ячейки забыть. 0 = забыть всё, 1 = сохранить всё.' },
            { label: 'Входной вентиль (input gate)', cls: 'border-green-200 bg-green-50', formula: 'i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)', desc: 'Какие новые значения записать в состояние ячейки.' },
            { label: 'Кандидат состояния', cls: 'border-blue-200 bg-blue-50', formula: '\\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)', desc: 'Новые кандидаты для обновления состояния ячейки.' },
            { label: 'Обновление состояния ячейки', cls: 'border-purple-200 bg-purple-50', formula: 'c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t', desc: 'Ключевая формула: часть старого + часть нового. Поток градиента почти не затухает.' },
            { label: 'Выходной вентиль (output gate)', cls: 'border-orange-200 bg-orange-50', formula: 'o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)', desc: 'Какую часть состояния ячейки выдать как скрытое состояние.' },
            { label: 'Скрытое состояние', cls: 'border-gray-300 bg-gray-100', formula: 'h_t = o_t \\odot \\tanh(c_t)', desc: 'Выход LSTM на шаге t. Используется как предсказание и передаётся на следующий шаг.' },
          ] as const).map(({ label, cls, formula, desc }) => (
            <div key={label} className={`border ${cls} rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">{label}</h4>
                  <div className="my-2 text-center">
                    <Formula math={formula} block />
                  </div>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <InfoBlock type="tip" title="Почему c_t решает проблему затухания?">
          В формуле <Formula math="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" /> градиент
          распространяется через аддитивное соединение (как в ResNet). Если{' '}
          <Formula math="f_t \approx 1" /> (ничего не забываем), градиент проходит от{' '}
          <Formula math="c_T" /> до <Formula math="c_0" /> без затухания.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">GRU: упрощённая альтернатива</h2>
        <p className="text-gray-700 mb-3">
          GRU объединяет forget и input gates в один <em>update gate</em>:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            ['Reset gate', 'r_t = \\sigma(W_r [h_{t-1}, x_t])'],
            ['Update gate', 'z_t = \\sigma(W_z [h_{t-1}, x_t])'],
            ['New hidden state', 'h_t = (1-z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t'],
          ].map(([name, formula]) => (
            <div key={name} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
              <p className="text-xs font-semibold text-gray-700 mb-2">{name}</p>
              <Formula math={formula} block />
            </div>
          ))}
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Характеристика</th>
                <th className="px-3 py-2">RNN</th>
                <th className="px-3 py-2">LSTM</th>
                <th className="px-3 py-2">GRU</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Параметров (hidden=h)', 'h²+hx', '4(h²+hx)', '3(h²+hx)'],
                ['Долгосрочная память', '❌', '✅ (cell state)', '✅ (update gate)'],
                ['Скорость обучения', 'Быстрая', 'Медленная', 'Средняя'],
                ['Практика', 'Редко', 'Классика', 'Быстрая альтернатива'],
              ].map(([prop, rnn, lstm, gru]) => (
                <tr key={prop} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium">{prop}</td>
                  <td className="px-3 py-2 text-center">{rnn}</td>
                  <td className="px-3 py-2 text-center">{lstm}</td>
                  <td className="px-3 py-2 text-center">{gru}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn

torch.manual_seed(42)

# Параметры
input_size  = 10  # размер признакового вектора
hidden_size = 32
seq_len     = 20  # длина последовательности
batch_size  = 4

# Входная последовательность [seq_len, batch, input_size]
x = torch.randn(seq_len, batch_size, input_size)
h0 = torch.zeros(1, batch_size, hidden_size)

# Vanilla RNN
rnn = nn.RNN(input_size, hidden_size, batch_first=False)
out_rnn, hn_rnn = rnn(x, h0)
print("RNN output:", out_rnn.shape)  # [20, 4, 32]
print("RNN hidden:", hn_rnn.shape)   # [1, 4, 32]

# LSTM (дополнительно состояние ячейки c0)
lstm = nn.LSTM(input_size, hidden_size, batch_first=False)
c0 = torch.zeros(1, batch_size, hidden_size)
out_lstm, (hn_lstm, cn_lstm) = lstm(x, (h0, c0))
print("\\nLSTM output:", out_lstm.shape)   # [20, 4, 32]
print("LSTM hidden:", hn_lstm.shape)      # [1, 4, 32]
print("LSTM cell:  ", cn_lstm.shape)      # [1, 4, 32]

# GRU
gru = nn.GRU(input_size, hidden_size, batch_first=False)
out_gru, hn_gru = gru(x, h0)
print("\\nGRU output:", out_gru.shape)

# Сравнение числа параметров
def count_params(model):
    return sum(p.numel() for p in model.parameters())

print(f"\\nПараметры RNN:  {count_params(rnn):,}")
print(f"Параметры LSTM: {count_params(lstm):,}")
print(f"Параметры GRU:  {count_params(gru):,}")`}
          output={`RNN output: torch.Size([20, 4, 32])
RNN hidden: torch.Size([1, 4, 32])

LSTM output: torch.Size([20, 4, 32])
LSTM hidden: torch.Size([1, 4, 32])
LSTM cell:   torch.Size([1, 4, 32])

GRU output: torch.Size([20, 4, 32])

Параметры RNN:  1,408
Параметры LSTM: 5,504
Параметры GRU:  4,224`}
          explanation="LSTM имеет в 4 раза больше параметров, чем RNN (4 матрицы для 4 вентилей). GRU — в 3 раза (3 матрицы). Выходная форма одинакова, но LSTM возвращает пару (h_n, c_n)."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Путать hidden state и cell state в LSTM', 'h_t — «рабочая память», передаётся следующему шагу и используется как выход. c_t — «долгосрочная память», не выводится напрямую. На инференсе используется h_t, а не c_t.'],
            ['Забыть инициализировать (h0, c0) при LSTM', 'По умолчанию PyTorch инициализирует нулями, но при batched inference нужно убедиться в правильных размерах.'],
            ['Использовать batch_first неконсистентно', 'nn.LSTM(batch_first=True) ожидает [B, T, C], а по умолчанию [T, B, C]. Несоответствие даст неверные результаты без ошибки.'],
            ['Думать, что LSTM полностью решает затухание', 'LSTM значительно снижает проблему, но при очень длинных последовательностях (T > 1000) всё равно теряет информацию. Для этого — Transformer с attention.'],
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
            question: 'Сколько параметров имеет LSTM с input_size=10 и hidden_size=20? Подсчитайте вручную.',
            solution: <div><p>Четыре вентиля, каждый имеет матрицы W_h (20×20) и W_x (20×10) и bias (20):</p><p className="font-mono text-sm mt-1">4 × (20×20 + 20×10 + 20) = 4 × (400 + 200 + 20) = 4 × 620 = <strong>2480</strong></p></div>,
          },
          {
            level: 'concept',
            question: 'Объясните роль forget gate в LSTM. Что происходит, если f_t ≈ 0? Если f_t ≈ 1?',
            solution: <div><p><Formula math="c_t = f_t \odot c_{t-1} + i_t \odot \tilde{c}_t" /></p><p className="mt-1"><strong>f_t ≈ 0:</strong> старое состояние ячейки полностью забывается, LSTM начинает «с нуля».</p><p><strong>f_t ≈ 1:</strong> старое состояние сохраняется полностью — долгосрочная память в действии.</p><p>Gradient highway: при f_t ≈ 1 градиент проходит через c_t без затухания.</p></div>,
          },
          {
            level: 'concept',
            question: 'В чём ключевое отличие GRU от LSTM? Когда стоит использовать GRU вместо LSTM?',
            solution: <div><p>GRU объединяет forget и input gates в один update gate, нет отдельного cell state. Результат: меньше параметров (3× vs 4× по сравнению с RNN), быстрее обучается.</p><p className="mt-1">GRU предпочтительнее когда: мало данных (меньше переобучение), нужна скорость, задача не требует сложной долгосрочной памяти. LSTM лучше на длинных последовательностях с сложными зависимостями.</p></div>,
          },
          {
            level: 'code',
            question: 'Напишите двунаправленный LSTM (bidirectional) в PyTorch для классификации последовательности.',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`lstm = nn.LSTM(
    input_size=10,
    hidden_size=32,
    num_layers=2,
    bidirectional=True,  # прямое + обратное направление
    dropout=0.3,
    batch_first=True,
)
# Выход: [B, T, 64] (64 = 32*2 из-за bidirectional)
# Для классификации берём последний шаг:
out, (hn, cn) = lstm(x)
# hn: [4, B, 32] (2 layers * 2 directions)
last = out[:, -1, :]  # [B, 64]
classifier = nn.Linear(64, num_classes)`}</pre>,
          },
          {
            level: 'tricky',
            question: 'Почему для LSTM нужны два нулевых тензора (h0, c0), а для GRU только один (h0)?',
            solution: <p>LSTM поддерживает два состояния: <strong>h_t</strong> (hidden state / «рабочая память») и <strong>c_t</strong> (cell state / «долгосрочная память»). GRU объединил их в одно hidden state h_t — у него нет отдельного cell state, поэтому инициализируется только одним вектором.</p>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Hochreiter & Schmidhuber, 1997 — "Long Short-Term Memory"</strong> — оригинальная статья LSTM</li>
          <li>📚 <strong>Cho et al., 2014 — "Learning Phrase Representations using RNN Encoder-Decoder"</strong> — введение GRU</li>
          <li>📚 <strong>Colah's Blog — "Understanding LSTMs"</strong> — лучшее визуальное объяснение LSTM</li>
          <li>📚 <strong>PyTorch Docs — nn.LSTM, nn.GRU, nn.RNN</strong> — API и параметры</li>
        </ul>
      </section>
    </div>
  )
}
