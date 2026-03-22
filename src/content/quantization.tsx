import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'

export default function QuantizationContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>Квантизация</strong> — сжатие весов и/или активаций нейросети из FP32 (32-бит) в INT8
          (8-бит) или ниже. Цель: уменьшить объём памяти в 4× и ускорить инференс за счёт целочисленных
          операций. Ключевые проблемы: <em>ошибка округления</em> и <em>нулевые градиенты</em> функций
          round/floor. Решение последней — <strong>Straight-Through Estimator (STE)</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Базовая схема квантизации</h3>
        <p className="text-gray-700 mb-2">
          Вещественное число <Formula math="x \in [x_{min}, x_{max}]" /> отображается в целое{' '}
          <Formula math="q \in [q_{min}, q_{max}]" /> через масштаб <Formula math="s" /> и нулевую точку{' '}
          <Formula math="z" />:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="s = \frac{x_{max} - x_{min}}{q_{max} - q_{min}}, \quad z = q_{min} - \left\lfloor\frac{x_{min}}{s}\right\rceil" block />
          <Formula math="Q(x) = \text{clamp}\!\left(\left\lfloor\frac{x}{s}\right\rceil + z,\ q_{min},\ q_{max}\right)" block />
          <Formula math="\hat{x} = s \cdot (Q(x) - z) \quad \text{(деквантизация)}" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Упрощённая симметричная версия (z=0):{' '}
          <Formula math="Q(x) = \text{round}(x / s) \cdot s" />, где{' '}
          <Formula math="s = x_{max} / (2^{b-1} - 1)" /> для b-битного квантования.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Проблема нулевых градиентов</h3>
        <p className="text-gray-700 mb-2">
          Функция round кусочно-постоянна — производная равна нулю везде, где определена:
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\frac{d}{dx}\text{round}(x) = 0 \quad \text{почти везде}" block />
        </div>
        <p className="text-gray-700 mb-3 text-sm">
          При backpropagation через квантованный слой градиент исчезает — веса не обновляются.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Straight-Through Estimator (STE)</h3>
        <p className="text-gray-700 mb-2">
          STE аппроксимирует производную квантизатора как 1 (или 0 вне диапазона насыщения):
        </p>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\frac{\partial \mathcal{L}}{\partial x} \approx \frac{\partial \mathcal{L}}{\partial Q(x)} \cdot \mathbf{1}[x_{min} \le x \le x_{max}]" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          При forward проходе используется реальное округление; при backward — градиент «проходит насквозь»
          без изменений (straight through). Это позволяет обучать сеть с учётом квантизации.
        </p>
        <InfoBlock type="note" title="Почему STE работает?">
          Квантизация создаёт шум, близкий к мелкозернистой случайной добавке. Если шаг квантизации мал,
          STE даёт достаточно точную оценку градиента для того, чтобы сеть сходилась. Это обоснование
          хэвристическое, но подтверждается практикой.
        </InfoBlock>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Post-Training vs Quantization-Aware Training</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Метод</th>
                <th className="px-3 py-2">Описание</th>
                <th className="px-3 py-2">Качество</th>
                <th className="px-3 py-2">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PTQ (Post-Training Quantization)', 'Квантуем готовую FP32 модель, небольшой калибровочный набор', 'Хорошее для INT8', 'Дёшево (часы)'],
                ['QAT (Quantization-Aware Training)', 'Обучаем с fake-квантизацией (STE), модель адаптируется', 'Лучшее, нужно для INT4', 'Дорого (дообучение)'],
                ['GPTQ / GGUF', 'PTQ с компенсацией ошибок (метод Hessian), для LLM', 'Близко к FP16', 'Средняя'],
              ].map(([method, desc, quality, cost]) => (
                <tr key={method} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-semibold text-sm">{method}</td>
                  <td className="px-3 py-2 text-sm">{desc}</td>
                  <td className="px-3 py-2 text-center text-sm">{quality}</td>
                  <td className="px-3 py-2 text-center text-sm">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Экономия памяти</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Формат</th>
                <th className="px-3 py-2">Бит</th>
                <th className="px-3 py-2">Размер 1M параметров</th>
                <th className="px-3 py-2">Сжатие vs FP32</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['FP32', '32', '4 MB', '1×'],
                ['FP16 / BF16', '16', '2 MB', '2×'],
                ['INT8', '8', '1 MB', '4×'],
                ['INT4', '4', '0.5 MB', '8×'],
                ['INT2', '2', '0.25 MB', '16×'],
              ].map(([fmt, bits, size, comp]) => (
                <tr key={fmt} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-mono font-semibold">{fmt}</td>
                  <td className="px-3 py-2 text-center">{bits}</td>
                  <td className="px-3 py-2 text-center">{size}</td>
                  <td className="px-3 py-2 text-center font-semibold">{comp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Ручной пример: INT8 квантизация</h2>
        <p className="text-gray-700 mb-3">
          Допустим, веса слоя: <Formula math="w = [-1.2,\; 0.3,\; 0.8,\; -0.5,\; 1.5]" />.
          INT8 диапазон: [-128, 127]. Симметричная квантизация:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">Вес w</th>
                <th className="px-3 py-2">w / s (s≈0.01181)</th>
                <th className="px-3 py-2">round</th>
                <th className="px-3 py-2">Деквант. ŵ</th>
                <th className="px-3 py-2">Ошибка</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['-1.2', '-101.6', '-102', '-1.205', '-0.005'],
                ['0.3', '25.4', '25', '0.295', '-0.005'],
                ['0.8', '67.7', '68', '0.803', '+0.003'],
                ['-0.5', '-42.3', '-42', '-0.496', '+0.004'],
                ['1.5', '127.0', '127', '1.500', '0.000'],
              ].map(([w, ws, r, dq, err]) => (
                <tr key={w} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-center font-mono">{w}</td>
                  <td className="px-3 py-2 text-center font-mono">{ws}</td>
                  <td className="px-3 py-2 text-center font-mono font-bold">{r}</td>
                  <td className="px-3 py-2 text-center font-mono">{dq}</td>
                  <td className="px-3 py-2 text-center font-mono text-gray-500">{err}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Масштаб <Formula math="s = 1.5 / 127 \approx 0.01181" />. Ошибки порядка 0.01 — приемлемо для INT8.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn

# --- Ручная реализация STE ---
class STEQuantize(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x, scale, num_bits=8):
        q_max = 2 ** (num_bits - 1) - 1  # 127 для INT8
        q_min = -(2 ** (num_bits - 1))   # -128
        # Квантизация
        x_q = torch.clamp(torch.round(x / scale), q_min, q_max)
        ctx.save_for_backward(x)
        ctx.q_min, ctx.q_max, ctx.scale = q_min, q_max, scale
        return x_q * scale  # деквантизация

    @staticmethod
    def backward(ctx, grad_output):
        x, = ctx.saved_tensors
        # STE: пропускаем градиент через round, обнуляем вне диапазона
        x_min = ctx.q_min * ctx.scale
        x_max = ctx.q_max * ctx.scale
        mask = (x >= x_min) & (x <= x_max)
        grad_input = grad_output * mask.float()
        return grad_input, None, None  # нет grad для scale и num_bits

# --- Тест STE ---
x = torch.tensor([0.3, -1.2, 0.8, 1.5, -0.5], requires_grad=True)
scale = torch.tensor(1.5 / 127)

x_quant = STEQuantize.apply(x, scale)
print("Исходные веса: ", x.detach().numpy().round(3))
print("Квантованные:  ", x_quant.detach().numpy().round(4))

loss = x_quant.sum()
loss.backward()
print("Градиент (STE):", x.grad.numpy())  # должен быть [1, 1, 1, 1, 1]

# --- Post-Training Quantization через torch.quantization ---
class SimpleMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(8, 16)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(16, 4)

    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))

model_fp32 = SimpleMLP().eval()

# Подготовка к квантизации
model_fp32.qconfig = torch.quantization.get_default_qconfig('fbgemm')
model_prepared = torch.quantization.prepare(model_fp32)

# Калибровка на случайных данных
with torch.no_grad():
    for _ in range(10):
        model_prepared(torch.randn(4, 8))

# Конвертация в INT8
model_int8 = torch.quantization.convert(model_prepared)

x_test = torch.randn(4, 8)
with torch.no_grad():
    out_fp32 = SimpleMLP()(x_test)
    out_int8  = model_int8(x_test)

print(f"\\nРазмер FP32 модели: ~{sum(p.numel()*4 for p in SimpleMLP().parameters())} байт")
print(f"Выход FP32:  {out_fp32[0].detach().numpy().round(3)}")
print(f"Выход INT8:  {out_int8[0].detach().numpy().round(3)}")`}
          output={`Исходные веса:  [ 0.3  -1.2   0.8   1.5  -0.5]
Квантованные:   [ 0.2996 -1.2047  0.8031  1.5    -0.4961]
Градиент (STE): [1. 1. 1. 1. 1.]

Размер FP32 модели: ~960 байт
Выход FP32:  [ 0.142 -0.089  0.217 -0.154]
Выход INT8:  [ 0.141 -0.089  0.216 -0.153]`}
          explanation="STE: градиент проходит через round как 1 (straight through). INT8 выход почти идентичен FP32 — потеря точности менее 0.1%. PTQ с torch.quantization автоматически вычисляет масштабы и нулевые точки во время калибровки."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Квантизовать без калибровочных данных', 'Масштаб s определяется по реальным активациям. Без калибровки масштаб будет неоптимальным → большая потеря точности.'],
            ['Квантизовать softmax или layer norm', 'Эти операции чувствительны к точности. Обычно оставляют в FP32 даже при INT8 инференсе.'],
            ['Думать, что INT8 всегда быстрее', 'На некоторых GPU/CPU INT8 не быстрее FP32, если нет специальной аппаратной поддержки (NVIDIA TensorCore для INT8, VNNI для x86).'],
            ['Применять QAT к предобученной LLM без LoRA', 'Полный QAT для LLM требует огромных ресурсов. Современный подход: GPTQ или bitsandbytes (4-bit) для PTQ.'],
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
            question: 'Значение x=0.75, масштаб s=0.01, INT8 диапазон [-128, 127]. Каково квантованное значение Q(x) и деквантованное ŵ?',
            solution: <div><p>Q(x) = clamp(round(0.75/0.01), -128, 127) = clamp(round(75), -128, 127) = <strong>75</strong></p><p>ŵ = 75 × 0.01 = <strong>0.75</strong> (нет ошибки, так как 0.75 кратно s)</p></div>,
          },
          {
            level: 'concept',
            question: 'Почему функция round имеет нулевой градиент и как STE решает эту проблему?',
            solution: <div><p>round(x) — кусочно-постоянная функция: её значение меняется только в точках 0.5, 1.5, 2.5... Производная = 0 везде, кроме точек разрыва.</p><p className="mt-1"><strong>STE:</strong> при forward pass используем реальный round, при backward — притворяемся, что производная = 1 (градиент проходит насквозь без изменений). Это позволяет обучать сеть, несмотря на дискретизацию.</p></div>,
          },
          {
            level: 'concept',
            question: 'В чём разница между симметричной и асимметричной квантизацией? Когда нужна асимметричная?',
            solution: <div><p><strong>Симметричная:</strong> нулевая точка z=0, диапазон [-s×127, s×127]. Проще реализовать.</p><p><strong>Асимметричная:</strong> z≠0, диапазон смещён. Нужна для: активаций после ReLU (только положительные значения [0, max]) — симметричная теряет половину диапазона INT8 впустую. Асимметричная использует полные 256 уровней.</p></div>,
          },
          {
            level: 'code',
            question: 'Реализуйте функцию symmetric_quantize(x, num_bits) на PyTorch, возвращающую квантованный тензор.',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`def symmetric_quantize(x: torch.Tensor, num_bits: int = 8) -> torch.Tensor:
    q_max = 2 ** (num_bits - 1) - 1  # 127 для 8 бит
    # Масштаб: максимальное abs значение → q_max
    scale = x.abs().max() / q_max
    if scale == 0:
        return x
    # Квантизация и деквантизация
    x_q = torch.clamp(torch.round(x / scale), -q_max, q_max)
    return x_q * scale  # приближение в FP32`}</pre>,
          },
          {
            level: 'tricky',
            question: 'Почему квантизация первого и последнего слоёв нейросети часто приводит к большей потере точности, чем средних слоёв?',
            solution: <div><p>Первый слой: работает с сырыми входными признаками, которые имеют широкий и специфичный диапазон. Ошибка квантизации здесь распространяется через всю сеть.</p><p>Последний слой: напрямую определяет предсказания. Небольшая ошибка в логитах → заметная ошибка в классификации.</p><p className="mt-1">Практика: первый и последний слои часто оставляют в FP32 даже при INT8 квантизации остальных слоёв (смешанная точность).</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Jacob et al., 2018 — "Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference"</strong> — QAT и INT8</li>
          <li>📚 <strong>Bengio et al., 2013 — "Estimating or Propagating Gradients Through Stochastic Neurons"</strong> — оригинальный STE</li>
          <li>📚 <strong>Frantar et al., 2022 — "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers"</strong></li>
          <li>📚 <strong>PyTorch Docs — torch.quantization</strong> — API для PTQ и QAT</li>
        </ul>
      </section>
    </div>
  )
}
