import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function PoolingContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Pooling</strong> — операция уменьшения пространственных размерностей карт признаков в CNN.
          Пулинг агрегирует значения в окне (например, 2×2) в одно число: max pooling берёт максимум,
          average pooling — среднее. Это снижает вычислительную стоимость, добавляет трансляционную
          инвариантность и контролирует переобучение. Global Average Pooling заменяет flatten перед
          финальным классификатором.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Max Pooling</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{MaxPool}(i, j) = \max_{(r,c) \in \mathcal{W}(i,j)} x_{r,c}" block />
        </div>
        <p className="text-gray-700 mb-3 text-sm">
          Где <Formula math="\mathcal{W}(i,j)" /> — окно размера <Formula math="k \times k" /> с центром в{' '}
          <Formula math="(i,j)" />. Берёт наиболее сильно активированный признак.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Average Pooling</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{AvgPool}(i, j) = \frac{1}{k^2} \sum_{(r,c) \in \mathcal{W}(i,j)} x_{r,c}" block />
        </div>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Размер выхода</h3>
        <p className="text-gray-700 mb-1 text-sm">
          Для входа <Formula math="H \times W" />, окна <Formula math="k \times k" /> и шага <Formula math="s" />:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="H_{out} = \left\lfloor \frac{H - k}{s} \right\rfloor + 1, \quad W_{out} = \left\lfloor \frac{W - k}{s} \right\rfloor + 1" block />
        </div>
        <p className="text-sm text-gray-600">
          Стандарт: k=2, s=2 → размер делится на 2 по каждому измерению.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Global Average Pooling (GAP)</h3>
        <p className="text-gray-700 mb-2">
          Усредняет всю карту признаков в одно число на канал:{' '}
          <Formula math="\text{GAP}(c) = \frac{1}{H \cdot W} \sum_{i,j} x_{i,j,c}" />
        </p>
        <InfoBlock type="tip" title="GAP vs Flatten">
          GAP преобразует [B, C, H, W] → [B, C], Flatten — в [B, C*H*W].
          GAP намного меньше параметров в финальном слое, меньше переобучение, работает с любым размером входа.
          Используется в ResNet, MobileNet, EfficientNet.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Сравнение Max vs Average Pooling</h3>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Свойство</th>
                <th className="px-3 py-2">Max Pooling</th>
                <th className="px-3 py-2">Average Pooling</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Что сохраняет', 'Наиболее сильный признак', 'Среднюю активацию'],
                ['Трансляционная инвариантность', 'Высокая', 'Средняя'],
                ['Чувствительность к шуму', 'Низкая', 'Высокая'],
                ['Применение', 'Классификация (VGG, AlexNet)', 'GAP в финале (ResNet), style transfer'],
                ['Backprop', 'Градиент только к max элементу', 'Градиент равномерно распределяется'],
              ].map(([prop, mx, avg]) => (
                <tr key={prop} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium">{prop}</td>
                  <td className="px-3 py-2 text-center">{mx}</td>
                  <td className="px-3 py-2 text-center">{avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример: 4×4 → 2×2</h2>
        <p className="text-gray-700 mb-3">
          Карта признаков 4×4, окно 2×2, шаг 2. Разбивается на 4 непересекающихся окна:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 text-center">Вход (4×4)</h4>
            <div className="overflow-x-auto">
              <table className="mx-auto text-sm border border-gray-200 rounded">
                <tbody>
                  {[
                    ['1', '3', '2', '8'],
                    ['5', '6', '1', '2'],
                    ['3', '2', '4', '7'],
                    ['1', '0', '9', '3'],
                  ].map((row, i) => (
                    <tr key={i}>
                      {row.map((v, j) => (
                        <td key={j} className={`w-10 h-10 text-center font-mono border border-gray-200
                          ${(i < 2 && j < 2) ? 'bg-blue-50' : ''}
                          ${(i < 2 && j >= 2) ? 'bg-green-50' : ''}
                          ${(i >= 2 && j < 2) ? 'bg-yellow-50' : ''}
                          ${(i >= 2 && j >= 2) ? 'bg-pink-50' : ''}`}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 text-center">Max Pool (2×2)</h4>
            <div className="overflow-x-auto">
              <table className="mx-auto text-sm border border-gray-200 rounded">
                <tbody>
                  <tr>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-blue-50">6</td>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-green-50">8</td>
                  </tr>
                  <tr>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-yellow-50">3</td>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-pink-50">9</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">max([1,3,5,6])=6 и т.д.</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 text-center">Avg Pool (2×2)</h4>
            <div className="overflow-x-auto">
              <table className="mx-auto text-sm border border-gray-200 rounded">
                <tbody>
                  <tr>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-blue-50">3.75</td>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-green-50">3.25</td>
                  </tr>
                  <tr>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-yellow-50">1.5</td>
                    <td className="w-16 h-16 text-center font-mono font-bold text-lg border border-gray-200 bg-pink-50">5.75</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">avg([1,3,5,6])=3.75 и т.д.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn

# Вход: batch=1, channels=1, H=4, W=4
x = torch.tensor([[[[1., 3., 2., 8.],
                     [5., 6., 1., 2.],
                     [3., 2., 4., 7.],
                     [1., 0., 9., 3.]]]])

print("Вход:", x.shape)  # [1, 1, 4, 4]

max_pool = nn.MaxPool2d(kernel_size=2, stride=2)
avg_pool = nn.AvgPool2d(kernel_size=2, stride=2)
gap      = nn.AdaptiveAvgPool2d(output_size=(1, 1))  # Global Average Pooling

out_max = max_pool(x)
out_avg = avg_pool(x)
out_gap = gap(x)

print("MaxPool2d:", out_max.shape)
print(out_max)

print("AvgPool2d:", out_avg.shape)
print(out_avg)

print("Global Avg Pool:", out_gap.shape)
print(out_gap)

# --- Пример в мини-CNN ---
cnn = nn.Sequential(
    nn.Conv2d(3, 16, kernel_size=3, padding=1),  # [B, 16, H, W]
    nn.ReLU(),
    nn.MaxPool2d(2, 2),                           # [B, 16, H/2, W/2]
    nn.Conv2d(16, 32, kernel_size=3, padding=1),  # [B, 32, H/2, W/2]
    nn.ReLU(),
    nn.AdaptiveAvgPool2d((1, 1)),                 # [B, 32, 1, 1] — GAP
    nn.Flatten(),                                  # [B, 32]
    nn.Linear(32, 10),
)

sample = torch.randn(4, 3, 32, 32)
print("\\nCNN output:", cnn(sample).shape)  # [4, 10]`}
          output={`Вход: torch.Size([1, 1, 4, 4])
MaxPool2d: torch.Size([1, 1, 2, 2])
tensor([[[[6., 8.],
          [3., 9.]]]])
AvgPool2d: torch.Size([1, 1, 2, 2])
tensor([[[[3.7500, 3.2500],
          [1.5000, 5.7500]]]])
Global Avg Pool: torch.Size([1, 1, 1, 1])
tensor([[[[3.9375]]]])

CNN output: torch.Size([4, 10])`}
          explanation="MaxPool сохранил максимумы из каждого квадранта. AvgPool посчитал средние. GAP свернул всю карту 4×4 в одно число (среднее всех 16 элементов). В CNN после GAP достаточно одного Linear(32, 10) без огромного Flatten."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Путать stride и kernel_size в pooling', 'MaxPool2d(2) — это kernel=2, stride=2 по умолчанию. Но MaxPool2d(kernel_size=3, stride=1) оставляет размер почти без изменений.'],
            ['Применять pooling после каждого Conv без учёта размера', 'После нескольких MaxPool2d с stride=2 на маленьком входе (32×32) пространство быстро сворачивается до 1×1.'],
            ['Думать, что pooling обучается', 'MaxPool и AvgPool не имеют обучаемых параметров. Обучаемый аналог — Strided Convolution.'],
            ['Использовать Flatten вместо GAP в мобильных сетях', 'Flatten [B, C, H, W] → [B, C*H*W] создаёт огромный линейный слой. GAP [B, C, H, W] → [B, C] — намного эффективнее.'],
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
            question: 'Карта признаков 6×6, MaxPool 2×2 stride 2. Каков размер выхода?',
            solution: <p>По формуле: <Formula math="\lfloor (6-2)/2 \rfloor + 1 = 3" />. Выход: <strong>3×3</strong>.</p>,
          },
          {
            level: 'basic',
            question: 'Примените MaxPool 2×2 stride 2 вручную к матрице [[2,4],[1,3]] (одно окно). Каков результат?',
            solution: <p>max(2, 4, 1, 3) = <strong>4</strong>. Одно окно 2×2 на входе 2×2 → выход 1×1 = [4].</p>,
          },
          {
            level: 'concept',
            question: 'В чём преимущество Global Average Pooling перед Flatten + Linear для финального классификатора?',
            solution: <div><p><strong>GAP:</strong> [B, C, H, W] → [B, C], затем Linear(C, num_classes) — C параметров на класс.</p><p><strong>Flatten:</strong> [B, C, H, W] → [B, C*H*W], Linear(C*H*W, num_classes) — в C*H*W раз больше параметров → переобучение. GAP также инвариантен к размеру входного изображения.</p></div>,
          },
          {
            level: 'concept',
            question: 'Почему Max Pooling обеспечивает трансляционную инвариантность? Приведите пример.',
            solution: <div><p>Если признак (например, вертикальная линия) сдвинется на 1 пиксель внутри окна 2×2, max pooling всё равно вернёт то же максимальное значение — позиция внутри окна не важна. Именно поэтому детектор кота в левом углу кадра и в правом углу даст похожие карты признаков после нескольких слоёв MaxPool.</p></div>,
          },
          {
            level: 'tricky',
            question: 'Как backpropagation работает через MaxPool? Как распределяется градиент?',
            solution: <div><p>При forward pass запоминается позиция максимального элемента в каждом окне. При backward pass <strong>весь градиент передаётся только этому элементу</strong>, остальные получают 0.</p><p className="mt-1">Пример: окно [1, 5, 3, 2], forward выбрал 5 (позиция 1). Если входящий градиент = 0.4, то:</p><p className="font-mono text-xs mt-1">[0, 0.4, 0, 0] — только максимальный элемент получает градиент.</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>LeCun et al., 1998 — "Gradient-Based Learning Applied to Document Recognition"</strong> — оригинальное введение pooling в CNN</li>
          <li>📚 <strong>Lin et al., 2014 — "Network In Network"</strong> — введение Global Average Pooling</li>
          <li>📚 <strong>PyTorch Docs — nn.MaxPool2d, nn.AvgPool2d, nn.AdaptiveAvgPool2d</strong></li>
          <li>📚 <strong>CS231n Stanford — CNNs for Visual Recognition</strong> — детальное объяснение pooling операций</li>
        </ul>
      </section>
    </div>
  )
}
