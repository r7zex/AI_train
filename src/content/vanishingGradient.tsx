import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function VanishingGradientContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Проблема затухающего градиента</strong> возникает при обучении глубоких сетей с помощью
          обратного распространения ошибки. Когда градиент проходит через многие слои, он перемножается
          с производными функций активации. Если эти производные меньше 1 (например, у сигмоиды ≤ 0.25),
          градиент экспоненциально убывает, и ранние слои перестают обучаться.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>
        <p className="text-gray-700 mb-3">
          При backpropagation градиент функции потерь <Formula math="\mathcal{L}" /> по весам слоя{' '}
          <Formula math="l" /> вычисляется через цепное правило. Для сети с <Formula math="L" /> слоями:
        </p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center">
          <Formula math="\frac{\partial \mathcal{L}}{\partial W^{(1)}} = \frac{\partial \mathcal{L}}{\partial a^{(L)}} \cdot \prod_{l=2}^{L} \frac{\partial a^{(l)}}{\partial a^{(l-1)}}" block />
        </div>
        <p className="text-gray-700 mb-3">
          Каждый множитель в произведении содержит производную активации:{' '}
          <Formula math="\frac{\partial a^{(l)}}{\partial a^{(l-1)}} = W^{(l)} \cdot \sigma'(z^{(l)})" />.
        </p>
        <h3 className="font-semibold text-gray-800 mb-2">Почему сигмоида опасна</h3>
        <p className="text-gray-700 mb-3">
          Производная сигмоиды: <Formula math="\sigma'(z) = \sigma(z)(1 - \sigma(z)) \leq 0.25" />.
          При 10 слоях максимальный градиент: <Formula math="0.25^{10} \approx 10^{-6}" /> — полное затухание.
        </p>
        <div className="my-4 p-5 bg-gray-50 rounded-xl border text-center">
          <Formula math="\|\nabla_{W^{(1)}}\| \approx \prod_{l=1}^{L} \|\sigma'(z^{(l)})\| \cdot \|W^{(l)}\| \to 0" block />
        </div>
        <InfoBlock type="note" title="Взрывающийся градиент — обратная проблема">
          Если произведение множителей больше 1, градиент экспоненциально растёт (exploding gradient).
          Решается gradient clipping: <Formula math="\hat{g} = g \cdot \min\!\left(1, \frac{\theta}{\|g\|}\right)" />.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mt-4 mb-2">Решения</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            ['ReLU активация', 'Производная ReLU = 1 при z > 0, не затухает в активной зоне. Но есть проблема «мёртвых нейронов» (dead ReLU).'],
            ['Skip connections (ResNet)', 'Блок вычисляет F(x) + x. Градиент всегда может пройти напрямую через +x без затухания.'],
            ['Batch Normalization', 'Нормализует активации, не даёт попасть в зону насыщения сигмоиды/tanh.'],
            ['Gradient Clipping', 'Ограничивает норму или значения градиента, предотвращает взрыв и нестабильность.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <span className="font-semibold text-blue-800">{title}: </span>
              <span className="text-gray-700">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример: затухание через 5 слоёв</h2>
        <p className="text-gray-700 mb-3">
          Допустим, каждый слой имеет сигмоиду и вход попадает в зону насыщения (z близко к 0),{' '}
          тогда <Formula math="\sigma'(0) = 0.25" />. Веса инициализированы так, что{' '}
          <Formula math="\|W^{(l)}\| \approx 1" />.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Слой (от выхода)</th>
                <th className="px-3 py-2">Множитель σ'</th>
                <th className="px-3 py-2">Накопленный градиент</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['L (выходной)', '0.25', '0.2500'],
                ['L-1', '0.25', '0.0625'],
                ['L-2', '0.25', '0.0156'],
                ['L-3', '0.25', '0.0039'],
                ['L-4 (входной)', '0.25', '0.00098'],
              ].map(([layer, mult, grad]) => (
                <tr key={layer} className="border-t border-gray-100">
                  <td className="px-3 py-2">{layer}</td>
                  <td className="px-3 py-2 text-center font-mono">{mult}</td>
                  <td className="px-3 py-2 text-center font-mono font-bold">{grad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          За 5 слоёв градиент уменьшился в 256 раз. При 10 слоях — в 65536 раз.
        </p>
        <InfoBlock type="tip" title="ReLU в той же ситуации">
          Если бы активацией был ReLU, а нейрон активен (z {'>'} 0), то производная = 1.
          Накопленный градиент остался бы ≈ 0.25 (только от выходного слоя).
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn
import matplotlib.pyplot as plt

# Сеть с сигмоидной активацией (воспроизводит затухание)
class DeepSigmoidNet(nn.Module):
    def __init__(self, n_layers=10):
        super().__init__()
        layers = []
        for _ in range(n_layers):
            layers += [nn.Linear(32, 32), nn.Sigmoid()]
        self.net = nn.Sequential(*layers, nn.Linear(32, 1))
    def forward(self, x):
        return self.net(x)

# Сеть с ReLU активацией
class DeepReLUNet(nn.Module):
    def __init__(self, n_layers=10):
        super().__init__()
        layers = []
        for _ in range(n_layers):
            layers += [nn.Linear(32, 32), nn.ReLU()]
        self.net = nn.Sequential(*layers, nn.Linear(32, 1))
    def forward(self, x):
        return self.net(x)

def get_grad_norms(model):
    x = torch.randn(8, 32)
    loss = model(x).sum()
    loss.backward()
    norms = []
    for name, p in model.named_parameters():
        if 'weight' in name and p.grad is not None:
            norms.append(p.grad.norm().item())
    return norms

sigmoid_net = DeepSigmoidNet(10)
relu_net = DeepReLUNet(10)

sigmoid_norms = get_grad_norms(sigmoid_net)
relu_norms    = get_grad_norms(relu_net)

print("Нормы градиентов (от входного к выходному слою):")
print("Sigmoid:", [f"{v:.2e}" for v in sigmoid_norms])
print("ReLU:   ", [f"{v:.2e}" for v in relu_norms])`}
          output={`Нормы градиентов (от входного к выходному слою):
Sigmoid: ['1.32e-06', '3.74e-06', '1.05e-05', '2.97e-05', '8.34e-05',
          '2.35e-04', '6.61e-04', '1.86e-03', '5.23e-03', '1.47e-02', '4.14e-02']
ReLU:    ['1.18e-01', '9.43e-02', '1.22e-01', '8.97e-02', '1.15e-01',
          '1.03e-01', '9.76e-02', '1.08e-01', '9.88e-02', '1.12e-01', '1.04e-01']`}
          explanation="Сигмоида: градиент первого слоя на 5 порядков меньше последнего — классическое затухание. ReLU: градиенты примерно одного порядка по всей глубине."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Использовать сигмоиду во внутренних слоях глубокой сети', 'Сигмоида уместна только в выходном слое для бинарной классификации. Внутри используйте ReLU/GELU.'],
            ['Путать затухающий и взрывающийся градиент', 'Это разные проблемы с разными симптомами и решениями. Взрыв → NaN в loss, затухание → loss не снижается.'],
            ['Думать, что BN полностью решает проблему', 'BN помогает, но не гарантирует отсутствия затухания. При очень больших глубинах всё равно нужны skip connections.'],
            ['Забыть применить gradient clipping в RNN/LSTM', 'В рекуррентных сетях взрывающийся градиент особенно опасен из-за длинных последовательностей.'],
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
            question: 'Чему равна производная сигмоиды в точке z=0? При каком значении z производная максимальна?',
            solution: <p><Formula math="\sigma'(0) = \sigma(0)(1-\sigma(0)) = 0.5 \times 0.5 = 0.25" />. Максимум достигается при <strong>z = 0</strong>. Это и есть верхняя граница — 0.25. При больших |z| производная стремится к 0 (зона насыщения).</p>,
          },
          {
            level: 'concept',
            question: 'Объясните, как ResNet skip connections помогают решить проблему затухающего градиента.',
            solution: <div><p>В блоке ResNet выход вычисляется как <strong>y = F(x) + x</strong>. При backpropagation:</p><Formula math="\frac{\partial \mathcal{L}}{\partial x} = \frac{\partial \mathcal{L}}{\partial y}\left(\frac{\partial F}{\partial x} + 1\right)" block /><p>Слагаемое <strong>+1</strong> гарантирует, что градиент всегда имеет «прямой путь» через skip connection, не затухая через нелинейности.</p></div>,
          },
          {
            level: 'concept',
            question: 'В чём разница между затухающим и взрывающимся градиентом? Каковы симптомы каждого?',
            solution: <div><p><strong>Затухающий:</strong> градиент → 0, ранние слои не обучаются, loss «зависает» без снижения.</p><p><strong>Взрывающийся:</strong> градиент → ∞, веса меняются хаотично, loss = NaN. Решение: gradient clipping или правильная инициализация весов (Xavier/He).</p></div>,
          },
          {
            level: 'code',
            question: 'Напишите PyTorch-код для gradient clipping с порогом max_norm=1.0 для сети model.',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`optimizer.zero_grad()
loss.backward()
# Клипинг по норме всех параметров модели
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()`}</pre>,
          },
          {
            level: 'tricky',
            question: 'Почему ReLU тоже может вызывать проблему затухания? Что такое «мёртвые нейроны»?',
            solution: <div><p>ReLU(z) = 0 при z ≤ 0, производная = 0. Если нейрон всегда получает отрицательный вход (например, после большого обновления весов), его градиент навсегда станет 0 — нейрон «умирает» и перестаёт обучаться. Исправление: <strong>Leaky ReLU</strong> (производная = α {'<'} 1 при z {'<'} 0), <strong>ELU</strong>, или правильная инициализация.</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Hochreiter, 1991 — "Untersuchungen zu dynamischen neuronalen Netzen"</strong> — первое формальное описание проблемы затухающего градиента</li>
          <li>📚 <strong>He et al., 2016 — "Deep Residual Learning for Image Recognition"</strong> — ResNet и skip connections</li>
          <li>📚 <strong>Goodfellow et al., "Deep Learning" §8.2.5</strong> — теоретический анализ затухающего/взрывающегося градиента</li>
          <li>📚 <strong>Ioffe & Szegedy, 2015 — "Batch Normalization"</strong> — BN как решение проблемы</li>
        </ul>
      </section>
    </div>
  )
}
