import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock from '../components/TaskBlock'
import AttentionShapeCalc from '../components/calculators/AttentionShapeCalc'

export default function TransformersQKVContent() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">
          В механизме <strong>Multi-Head Attention</strong> входная последовательность проецируется
          в три матрицы: <strong>Q (Query)</strong>, <strong>K (Key)</strong> и <strong>V (Value)</strong>.
          Для каждой «головы» вычисляется scaled dot-product attention. Выходы голов конкатенируются
          и проецируются обратно. Понимание форм тензоров на каждом шаге — ключ к отладке Transformer.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория и формулы</h2>

        <h3 className="font-semibold text-gray-800 mb-2">Scaled Dot-Product Attention</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Деление на <Formula math="\sqrt{d_k}" /> предотвращает слишком большие значения скалярных произведений,
          которые загоняют softmax в зону насыщения с маленькими градиентами.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Multi-Head Attention</h3>
        <div className="my-3 p-4 bg-gray-50 rounded-xl border text-center">
          <Formula math="\text{MHA}(X) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W^O" block />
          <Formula math="\text{head}_i = \text{Attention}(XW_i^Q,\; XW_i^K,\; XW_i^V)" block />
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Где <Formula math="W_i^Q, W_i^K, W_i^V \in \mathbb{R}^{d_{model} \times d_k}" />,{' '}
          <Formula math="d_k = d_{model} / h" />, <Formula math="W^O \in \mathbb{R}^{d_{model} \times d_{model}}" />.
        </p>

        <h3 className="font-semibold text-gray-800 mb-2 mt-4">Пошаговое отслеживание форм</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Шаг</th>
                <th className="px-3 py-2">Операция</th>
                <th className="px-3 py-2">Форма тензора</th>
                <th className="px-3 py-2">Обозначение</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', 'Вход (embeddings)', '[B, T, d_model]', 'B=batch, T=seq_len'],
                ['2', 'Linear проекция → Q', '[B, T, d_model] @ W^Q', '[B, T, d_model]'],
                ['3', 'Reshape по головам', 'view → [B, T, h, d_k]', 'd_k = d_model / h'],
                ['4', 'Transpose для matmul', '[B, h, T, d_k]', 'головы на dim=1'],
                ['5', 'QK^T (scores)', '[B, h, T, T]', 'T×T матрица внимания'],
                ['6', 'Scale + Softmax', '[B, h, T, T]', 'веса внимания ∈ [0,1]'],
                ['7', 'Weighted sum @ V', '[B, h, T, d_k]', 'взвешенные значения'],
                ['8', 'Transpose + Concat', '[B, T, d_model]', 'h * d_k = d_model'],
                ['9', 'Output proj W^O', '[B, T, d_model]', 'финальный выход MHA'],
              ].map(([step, op, shape, note]) => (
                <tr key={step} className={`border-t border-gray-100 ${parseInt(step) % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <td className="px-3 py-2 text-center font-bold text-purple-700">{step}</td>
                  <td className="px-3 py-2">{op}</td>
                  <td className="px-3 py-2 font-mono text-purple-700 font-semibold">{shape}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBlock type="note" title="Зачем несколько голов?">
          Каждая голова может обращать внимание на разные паттерны в последовательности: одна голова — на
          синтаксические зависимости, другая — на семантику, третья — на позиционные отношения.
          Multi-head позволяет параллельно строить несколько представлений.
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Интерактивный калькулятор форм</h2>
        <AttentionShapeCalc />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python/PyTorch</h2>
        <CodeBlock
          language="python"
          code={`import torch
import torch.nn as nn
import torch.nn.functional as F
import math

# Параметры
B       = 2    # batch size
T       = 10   # sequence length
d_model = 64   # embedding dim
h       = 8    # number of heads
d_k     = d_model // h  # 8

print(f"d_model={d_model}, heads={h}, d_k={d_k}\\n")

# --- Шаг 1: входные эмбеддинги ---
x = torch.randn(B, T, d_model)
print(f"Вход x:              {tuple(x.shape)}")

# --- Шаг 2: линейные проекции Q, K, V ---
W_Q = nn.Linear(d_model, d_model, bias=False)
W_K = nn.Linear(d_model, d_model, bias=False)
W_V = nn.Linear(d_model, d_model, bias=False)

Q = W_Q(x)  # [B, T, d_model]
K = W_K(x)
V = W_V(x)
print(f"После проекций Q,K,V: {tuple(Q.shape)}")

# --- Шаг 3-4: reshape и transpose для multi-head ---
Q = Q.view(B, T, h, d_k).transpose(1, 2)  # [B, h, T, d_k]
K = K.view(B, T, h, d_k).transpose(1, 2)
V = V.view(B, T, h, d_k).transpose(1, 2)
print(f"После reshape:        {tuple(Q.shape)}")

# --- Шаг 5-6: Scaled Dot-Product Attention ---
scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
print(f"Attention scores:     {tuple(scores.shape)}")  # [B, h, T, T]

attn_weights = F.softmax(scores, dim=-1)
print(f"Attention weights:    {tuple(attn_weights.shape)}")

# --- Шаг 7: взвешенная сумма ---
context = torch.matmul(attn_weights, V)
print(f"После attention:      {tuple(context.shape)}")  # [B, h, T, d_k]

# --- Шаг 8: concat heads ---
context = context.transpose(1, 2).contiguous().view(B, T, d_model)
print(f"После concat:         {tuple(context.shape)}")  # [B, T, d_model]

# --- Шаг 9: output projection ---
W_O = nn.Linear(d_model, d_model, bias=False)
output = W_O(context)
print(f"Финальный выход:      {tuple(output.shape)}")  # [B, T, d_model]

# --- Встроенный PyTorch MHA ---
mha = nn.MultiheadAttention(embed_dim=d_model, num_heads=h, batch_first=True)
out_mha, attn_map = mha(x, x, x)
print(f"\\nnn.MHA выход:         {tuple(out_mha.shape)}")
print(f"Карта внимания:       {tuple(attn_map.shape)}")`}
          output={`d_model=64, heads=8, d_k=8

Вход x:              (2, 10, 64)
После проекций Q,K,V: (2, 10, 64)
После reshape:        (2, 8, 10, 8)
Attention scores:     (2, 8, 10, 10)
Attention weights:    (2, 8, 10, 10)
После attention:      (2, 8, 10, 8)
После concat:         (2, 10, 64)
Финальный выход:      (2, 10, 64)

nn.MHA выход:         (2, 10, 64)
Карта внимания:       (2, 10, 10)`}
          explanation="Форма входа и выхода совпадают [B, T, d_model]. Ключевая промежуточная форма — матрица внимания [B, h, T, T]: для каждой головы и каждого токена — вектор весов по всей последовательности."
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {[
            ['Забыть scale на √d_k', 'Без масштабирования скалярные произведения при больших d_k слишком велики → softmax возвращает почти one-hot → маленькие градиенты → сеть не учится.'],
            ['Перепутать transpose(-2, -1) и transpose(1, 2)', 'transpose(1, 2) меняет головы и время (нужно при reshape). transpose(-2, -1) меняет T и d_k (нужно для QK^T).'],
            ['Неправильные маски (padding mask vs causal mask)', 'В encoder: маскируют padding токены (padding mask). В decoder: маскируют будущие токены (causal/autoregressive mask). Смешение — критическая ошибка.'],
            ['Думать, что d_k и d_v всегда равны', 'В оригинальном Transformer d_k = d_v = d_model/h. Но в некоторых архитектурах (MQA, GQA) K,V имеют меньше голов, чем Q.'],
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
            question: 'Transformer с d_model=512, h=8 головами. Чему равно d_k? Какова форма матрицы внимания для одной головы при batch=1, T=20?',
            solution: <div><p><Formula math="d_k = d_{model} / h = 512 / 8 = 64" /></p><p>Матрица внимания для одной головы: <strong>[1, 20, 20]</strong> (или [20, 20] без батч-размерности) — для каждого из 20 токенов вектор весов по 20 позициям.</p></div>,
          },
          {
            level: 'concept',
            question: 'Почему нужно делить скалярное произведение на √d_k, а не на d_k?',
            solution: <div><p>При вычислении <Formula math="q \cdot k = \sum_{i=1}^{d_k} q_i k_i" />, если{' '}
            <Formula math="q_i, k_i \sim \mathcal{N}(0,1)" />, то дисперсия суммы = <Formula math="d_k" />,
            стандартное отклонение = <Formula math="\sqrt{d_k}" />. Деление на <Formula math="\sqrt{d_k}" />
            нормирует к единичной дисперсии, не слишком сжимая и не растягивая аргумент softmax.</p></div>,
          },
          {
            level: 'concept',
            question: 'В чём разница между Self-Attention и Cross-Attention? Где каждый используется в Transformer?',
            solution: <div><p><strong>Self-Attention:</strong> Q, K, V берутся из одной и той же последовательности X. Используется в encoder (каждый токен смотрит на все токены входа) и в decoder (маскированное).</p><p><strong>Cross-Attention:</strong> Q берётся из decoder, K и V — из encoder output. Позволяет decoder «смотреть» на encodings входной последовательности.</p></div>,
          },
          {
            level: 'code',
            question: 'Напишите causal mask (маску будущего) для последовательности длины T=5 в PyTorch.',
            solution: <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{`T = 5
# Нижнетреугольная матрица: 1 — можно смотреть, 0 — нельзя
causal_mask = torch.tril(torch.ones(T, T)).bool()
# В nn.MultiheadAttention используется attn_mask (True = игнорировать):
attn_mask = ~causal_mask  # инвертируем
# [[F,T,T,T,T],
#  [F,F,T,T,T],
#  [F,F,F,T,T],
#  [F,F,F,F,T],
#  [F,F,F,F,F]]`}</pre>,
          },
          {
            level: 'tricky',
            question: 'Что такое Multi-Query Attention (MQA) и Grouped-Query Attention (GQA)? Зачем они нужны?',
            solution: <div><p><strong>MQA:</strong> все Q-головы разные, но K и V — общие (одна голова). Экономия памяти KV-cache в 8× (при 8 головах).</p><p><strong>GQA:</strong> головы Q делятся на группы, каждая группа разделяет K и V. Компромисс между MHA (качество) и MQA (скорость).</p><p className="mt-1">Мотивация: при инференсе LLM KV-cache занимает огромную память. MQA/GQA (LLaMA-3, Mistral) снижают её почти без потери качества.</p></div>,
          },
        ]} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📚 <strong>Vaswani et al., 2017 — "Attention Is All You Need"</strong> — оригинальный Transformer</li>
          <li>📚 <strong>The Illustrated Transformer (Jay Alammar)</strong> — лучшая визуализация механизма внимания</li>
          <li>📚 <strong>Ainslie et al., 2023 — "GQA: Training Generalized Multi-Query Transformer Models"</strong></li>
          <li>📚 <strong>PyTorch Docs — nn.MultiheadAttention</strong> — полная документация API</li>
        </ul>
      </section>
    </div>
  )
}
