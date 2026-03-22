import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function NormalizationContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          Нормализация активаций стабилизирует обучение, ускоряет сходимость и снижает чувствительность
          к инициализации весов. Ключевой вопрос — <strong>по каким осям нормализовать</strong>.
          Разные методы отвечают на него по-разному:{' '}
          <strong>Batch Norm</strong> — по батчу и пространству,{' '}
          <strong>Layer Norm</strong> — по признакам внутри примера,{' '}
          <strong>Instance Norm</strong> — по пространству внутри канала,{' '}
          <strong>Group Norm</strong> — по группам каналов.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Общая формула нормализации</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\hat{x} = \frac{x - \mu}{\sqrt{\sigma^2 + \varepsilon}}, \quad y = \gamma \hat{x} + \beta" block />
        </div>
        <p className="text-gray-700 text-sm mb-4">
          <Formula math="\gamma" /> и <Formula math="\beta" /> — обучаемые параметры масштаба и сдвига.
          Разница между методами только в том, по каким элементам вычисляются <Formula math="\mu" /> и{' '}
          <Formula math="\sigma^2" />.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2">Batch Normalization (BatchNorm)</h3>
        <p className="text-gray-700 mb-2 text-sm">
          Для тензора <Formula math="x \in \mathbb{R}^{B \times C \times H \times W}" />{' '}
          нормализует по осям <strong>(B, H, W)</strong> — отдельно для каждого канала C:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\mu_c = \frac{1}{B \cdot H \cdot W} \sum_{b,h,w} x_{b,c,h,w}, \quad \sigma_c^2 = \frac{1}{B \cdot H \cdot W} \sum_{b,h,w} (x_{b,c,h,w} - \mu_c)^2" block />
        </div>
        <InfoBlock type="warning" title="Зависимость от батча">
          BatchNorm поведение меняется между train (использует статистику батча) и eval (использует
          накопленное скользящее среднее). При маленьком батче (B=1 или B=2) — нестабилен.
          Не подходит для RNN, где длина последовательности меняется.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Layer Normalization (LayerNorm)</h3>
        <p className="text-gray-700 mb-2 text-sm">
          Нормализует по осям <strong>(C, H, W)</strong> — по всем признакам одного примера:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\mu_b = \frac{1}{C \cdot H \cdot W} \sum_{c,h,w} x_{b,c,h,w}, \quad \sigma_b^2 = \frac{1}{C \cdot H \cdot W} \sum_{c,h,w} (x_{b,c,h,w} - \mu_b)^2" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Статистика вычисляется по каждому примеру отдельно — не зависит от размера батча.
          Стандарт для Transformer архитектур и NLP.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Instance Normalization</h3>
        <p className="text-gray-700 mb-2 text-sm">
          Нормализует по осям <strong>(H, W)</strong> — по пространству для каждого примера и канала отдельно:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\mu_{b,c} = \frac{1}{H \cdot W} \sum_{h,w} x_{b,c,h,w}" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Применяется в style transfer и генеративных моделях — нормализует стиль изображения,
          не смешивая информацию между каналами и примерами.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Сравнительная таблица</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Метод</th>
                <th className="px-3 py-2">Нормализует по</th>
                <th className="px-3 py-2">Зависит от B</th>
                <th className="px-3 py-2">Применение</th>
                <th className="px-3 py-2">PyTorch</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['BatchNorm', '(B, H, W) per C', '✅ Да', 'CV (ResNet, VGG)', 'nn.BatchNorm2d'],
                ['LayerNorm', '(C, H, W) per B', '❌ Нет', 'NLP (Transformer)', 'nn.LayerNorm'],
                ['InstanceNorm', '(H, W) per B,C', '❌ Нет', 'Style Transfer', 'nn.InstanceNorm2d'],
                ['GroupNorm', '(G каналов, H, W) per B', '❌ Нет', 'CV при малом B', 'nn.GroupNorm'],
                ['WeightNorm', 'Нормализует веса', '❌ Нет', 'RNN, RL', 'nn.utils.weight_norm'],
              ].map(([method, axes, dep, use, api]) => (
                <tr key={method} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-semibold">{method}</td>
                  <td className="px-3 py-2 font-mono text-xs">{axes}</td>
                  <td className="px-3 py-2 text-center">{dep}</td>
                  <td className="px-3 py-2 text-xs">{use}</td>
                  <td className="px-3 py-2 font-mono text-xs">{api}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Примеры на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn

# Тензор: batch=2, channels=4, height=3, width=3
B, C, H, W = 2, 4, 3, 3
x = torch.randn(B, C, H, W)
print("Вход:", x.shape)

# --- Batch Normalization ---
# Нормализует по (B, H, W) для каждого из C каналов
bn = nn.BatchNorm2d(num_features=C)
out_bn = bn(x)
print("BatchNorm2d:", out_bn.shape)
# Среднее по (B,H,W) для канала 0 ≈ 0 после нормализации
print("  μ по каналу 0:", out_bn[:, 0, :, :].mean().item())

# --- Layer Normalization ---
# Нормализует по (C, H, W) для каждого примера в батче
ln = nn.LayerNorm(normalized_shape=[C, H, W])
out_ln = ln(x)
print("\\nLayerNorm:", out_ln.shape)
# Среднее по (C,H,W) для примера 0 ≈ 0
print("  μ для примера 0:", out_ln[0].mean().item())

# --- Instance Normalization ---
# Нормализует по (H, W) для каждого (B, C)
ins = nn.InstanceNorm2d(num_features=C, affine=True)
out_ins = ins(x)
print("\\nInstanceNorm2d:", out_ins.shape)
# Среднее по (H,W) для примера 0, канала 0 ≈ 0
print("  μ для (b=0, c=0):", out_ins[0, 0].mean().item())

# --- Group Normalization ---
# Делит C=4 на 2 группы по 2 канала каждая
gn = nn.GroupNorm(num_groups=2, num_channels=C)
out_gn = gn(x)
print("\\nGroupNorm:", out_gn.shape)

# --- Weight Normalization для линейного слоя ---
linear = nn.Linear(16, 8)
linear_wn = nn.utils.weight_norm(linear, name='weight')
x_lin = torch.randn(4, 16)
out_wn = linear_wn(x_lin)
print("\\nWeightNorm Linear output:", out_wn.shape)`}
          output={`Вход: torch.Size([2, 4, 3, 3])
BatchNorm2d: torch.Size([2, 4, 3, 3])
  μ по каналу 0: -1.4901e-08

LayerNorm: torch.Size([2, 4, 3, 3])
  μ для примера 0: 2.9802e-08

InstanceNorm2d: torch.Size([2, 4, 3, 3])
  μ для (b=0, c=0): 0.0

GroupNorm: torch.Size([2, 4, 3, 3])

WeightNorm Linear output: torch.Size([4, 8])`}
          explanation="Все методы возвращают тензор того же размера. Разница в том, по каким осям нормализуется: BN — по B и пространству, LN — по всем признакам внутри примера, IN — только по пространству. Среднее ≈ 0 подтверждает корректность нормализации."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Использовать BatchNorm с batch_size=1', 'Дисперсия одного элемента = 0, нормализация нестабильна. Используйте LayerNorm или GroupNorm.'],
            ['Забыть model.eval() при инференсе с BatchNorm', 'В train mode BN использует статистику текущего батча; в eval mode — накопленные running_mean/running_var. При инференсе обязателен eval().'],
            ['Применять BatchNorm после нелинейности', 'Каноничный порядок: Linear → BatchNorm → ReLU. BN после ReLU теряет информацию об отрицательных значениях.'],
            ['Использовать BatchNorm в Transformer', 'В Transformer стандарт — LayerNorm. BatchNorm плохо работает с переменной длиной последовательностей и маленькими батчами в NLP.'],
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
            question: 'Для тензора формы [B=4, C=8, H=16, W=16]: по каким осям вычисляет статистику BatchNorm2d(8)? Сколько пар (γ, β) у него обучаемых параметров?',
            solution: <div><p>BatchNorm2d нормализует по <strong>(B, H, W)</strong> — это 4×16×16 = 1024 элемента для каждого из 8 каналов.</p><p>Обучаемых параметров: <strong>8 значений γ + 8 значений β = 16</strong> (по одному на канал).</p></div>,
          },
          {
            level: 'concept',
            question: 'Почему LayerNorm используется в Transformer, а не BatchNorm?',
            solution: <div><p>В NLP батч состоит из последовательностей разной длины. BatchNorm нормализует по батчу — это смешивает статистику разных примеров и нестабильно при малых батчах.</p><p className="mt-1">LayerNorm нормализует по <em>признакам внутри одного примера</em> — независимо от батча и длины последовательности. Это работает корректно даже при B=1.</p></div>,
          },
          {
            level: 'concept',
            question: 'Зачем нужны обучаемые параметры γ и β в нормализации? Что будет без них?',
            solution: <div><p>После нормализации активации имеют μ=0, σ=1. Это может быть слишком ограничивающим — сеть теряет способность выражать произвольные масштабы и сдвиги.</p><p className="mt-1">γ и β позволяют сети <em>отменить нормализацию</em> если нужно: при γ=σ, β=μ выход совпадает с входом. Они дают сети гибкость при сохранении стабильности обучения.</p></div>,
          },
          {
            level: 'code',
            question: 'Реализуйте LayerNorm вручную (без nn.LayerNorm) для тензора формы [B, T, D].',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`def manual_layer_norm(x, gamma, beta, eps=1e-5):
    # x: [B, T, D], нормализация по последней оси D
    mu = x.mean(dim=-1, keepdim=True)       # [B, T, 1]
    var = x.var(dim=-1, keepdim=True, unbiased=False)  # [B, T, 1]
    x_norm = (x - mu) / (var + eps).sqrt()  # [B, T, D]
    return gamma * x_norm + beta             # broadcast gamma/beta`}</pre>,
          },
          {
            level: 'tricky',
            question: 'GroupNorm с num_groups=C — это то же самое, что InstanceNorm? А GroupNorm с num_groups=1 — это то же самое, что LayerNorm?',
            solution: <div><p><strong>GroupNorm(num_groups=C):</strong> каждый канал = своя группа из 1 канала → нормализует по (H, W) = InstanceNorm ✅</p><p><strong>GroupNorm(num_groups=1):</strong> один группа содержит все C каналов → нормализует по (C, H, W) = LayerNorm для 2D входа ✅</p><p className="mt-1">GroupNorm — общий метод, включающий IN и LN как частные случаи.</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Ioffe & Szegedy, 2015 — "Batch Normalization"</strong> — оригинальная статья BatchNorm</li>
          <li>📚 <strong>Ba et al., 2016 — "Layer Normalization"</strong> — оригинальная статья LayerNorm</li>
          <li>📚 <strong>Ulyanov et al., 2016 — "Instance Normalization"</strong> — для style transfer</li>
          <li>📚 <strong>Wu & He, 2018 — "Group Normalization"</strong> — обобщение всех методов</li>
        </ul>
      </section>
    </div>
  )
}
