import Formula from '../components/Formula'

interface FormulaEntry {
  name: string
  math: string
  explanation: string
}

interface Category {
  id: string
  title: string
  icon: string
  color: string
  formulas: FormulaEntry[]
}

const categories: Category[] = [
  {
    id: 'classical',
    title: 'Классическое МО',
    icon: '🌳',
    color: 'green',
    formulas: [
      {
        name: 'Gini Impurity',
        math: 'G = 1 - \\sum_{k=1}^{K} p_k^2',
        explanation: 'Мера неоднородности узла дерева решений. p_k — доля объектов класса k. Равна 0 для чистого узла, максимальна при равном распределении.',
      },
      {
        name: 'Information Gain (Entropy)',
        math: 'IG = H(S) - \\sum_{v} \\frac{|S_v|}{|S|} H(S_v)',
        explanation: 'Прирост информации при разбиении множества S по признаку. H(S) = -Σ p_k log₂(p_k) — энтропия Шеннона.',
      },
      {
        name: 'SVM: Margin',
        math: '\\text{margin} = \\frac{2}{\\|\\mathbf{w}\\|}',
        explanation: 'Зазор между двумя параллельными гиперплоскостями, разделяющими классы. SVM максимизирует этот зазор.',
      },
      {
        name: 'SVM: Расстояние от точки до гиперплоскости',
        math: 'd = \\frac{|\\mathbf{w}^\\top \\mathbf{x} + b|}{\\|\\mathbf{w}\\|}',
        explanation: 'Подписанное расстояние от объекта x до разделяющей гиперплоскости w·x+b=0. Именно это расстояние возвращает decision_function в sklearn.SVC.',
      },
      {
        name: 'SVM: Hinge Loss',
        math: 'L = \\frac{1}{n}\\sum_{i=1}^{n} \\max(0,\\, 1 - y_i(\\mathbf{w}^\\top \\mathbf{x}_i + b))',
        explanation: 'Функция потерь SVM. Штрафует только объекты внутри зазора или неправильно классифицированные.',
      },
      {
        name: 'Naive Bayes',
        math: 'P(y \\mid x_1,\\ldots,x_n) \\propto P(y)\\prod_{i=1}^{n} P(x_i \\mid y)',
        explanation: 'Предполагает условную независимость признаков. P(y) — априорная вероятность класса.',
      },
      {
        name: 'Logistic Regression',
        math: '\\hat{y} = \\sigma(\\mathbf{w}^\\top \\mathbf{x} + b) = \\frac{1}{1 + e^{-(\\mathbf{w}^\\top \\mathbf{x} + b)}}',
        explanation: 'Sigmoid-функция сжимает линейную комбинацию признаков в вероятность [0, 1].',
      },
      {
        name: 'K-Nearest Neighbors (KNN)',
        math: '\\hat{y} = \\text{majority}\\{y_j : x_j \\in N_k(x)\\}',
        explanation: 'N_k(x) — k ближайших соседей точки x по выбранной метрике (Евклид, Манхэттен). KNN не имеет этапа обучения (lazy learner), вся работа — при предсказании.',
      },
      {
        name: 'Decision Tree: Information Entropy',
        math: 'H(S) = -\\sum_{k=1}^{K} p_k \\log_2 p_k',
        explanation: 'Энтропия Шеннона для множества S. p_k — доля объектов класса k. H=0 для чистого узла, максимальна при равном распределении классов.',
      },
      {
        name: 'Bayes Theorem',
        math: 'P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}',
        explanation: 'Основа байесовской статистики. P(A|B) — апостериорная вероятность; P(B|A) — правдоподобие; P(A) — априорная вероятность; P(B) — нормировочная константа.',
      },
    ],
  },
  {
    id: 'metrics',
    title: 'Метрики качества',
    icon: '📊',
    color: 'blue',
    formulas: [
      {
        name: 'Precision',
        math: '\\text{Precision} = \\frac{TP}{TP + FP}',
        explanation: 'Доля правильных положительных предсказаний среди всех положительных. Важна когда дорого ошибочно предсказать позитив.',
      },
      {
        name: 'Recall (Sensitivity)',
        math: '\\text{Recall} = \\frac{TP}{TP + FN}',
        explanation: 'Доля найденных положительных объектов среди всех реально положительных. Важна когда дорого пропустить позитив.',
      },
      {
        name: 'F1-Score',
        math: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
        explanation: 'Гармоническое среднее Precision и Recall. Сбалансированная метрика для несбалансированных классов.',
      },
      {
        name: 'F_β Score',
        math: 'F_\\beta = (1+\\beta^2)\\cdot\\frac{\\text{Precision}\\cdot\\text{Recall}}{\\beta^2 \\cdot \\text{Precision}+\\text{Recall}}',
        explanation: 'β > 1 придаёт больший вес Recall (важнее не пропустить); β < 1 — больший вес Precision.',
      },
      {
        name: 'ROC-AUC (AUROC)',
        math: '\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}^{-1}(t))\\,dt',
        explanation: 'Площадь под кривой ROC. 0.5 — случайный классификатор, 1.0 — идеальный. Инвариантен к порогу классификации.',
      },
      {
        name: 'MSE / RMSE',
        math: '\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}',
        explanation: 'Среднеквадратичная ошибка регрессии. RMSE в тех же единицах, что целевая переменная.',
      },
      {
        name: 'R² (Coefficient of Determination)',
        math: 'R^2 = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}',
        explanation: 'Доля дисперсии, объяснённая моделью. R²=1 — идеальная подгонка; R²=0 — модель не лучше среднего.',
      },
      {
        name: 'PR-AUC (Average Precision)',
        math: '\\text{AP} = \\sum_n (R_n - R_{n-1}) P_n',
        explanation: 'Площадь под Precision-Recall кривой. Информативнее ROC-AUC при сильном дисбалансе классов — не учитывает TN, которых много в несбалансированных задачах.',
      },
      {
        name: 'Cohen\'s Kappa',
        math: '\\kappa = \\frac{p_o - p_e}{1 - p_e}',
        explanation: 'p_o — наблюдаемая доля совпадений, p_e — ожидаемая случайная доля. κ=1: полное согласие; κ=0: случайное; κ<0: хуже случайного. Учитывает дисбаланс классов лучше Accuracy.',
      },
      {
        name: 'Log Loss (Cross-Entropy для классификатора)',
        math: '\\text{LogLoss} = -\\frac{1}{n}\\sum_{i=1}^{n}\\sum_{k=1}^{K} y_{ik}\\log(\\hat{p}_{ik})',
        explanation: 'Штрафует за уверенные ошибочные предсказания экспоненциально. При бинарной классификации: -[y log(p) + (1-y) log(1-p)].',
      },
    ],
  },
  {
    id: 'optimization',
    title: 'Оптимизация и регуляризация',
    icon: '⚙️',
    color: 'orange',
    formulas: [
      {
        name: 'Gradient Descent Update',
        math: '\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} L(\\theta_t)',
        explanation: 'θ — параметры модели, η — learning rate, ∇L — градиент функции потерь по параметрам.',
      },
      {
        name: 'SGD с моментом',
        math: 'v_{t+1} = \\mu v_t - \\eta \\nabla L(\\theta_t), \\quad \\theta_{t+1} = \\theta_t + v_{t+1}',
        explanation: 'μ ∈ [0,1) — коэффициент момента (обычно 0.9). Накапливает «инерцию» в направлении устойчивого градиента.',
      },
      {
        name: 'Adam Update',
        math: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t,\\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2',
        explanation: 'Adam хранит первый (m) и второй (v) моменты градиента. Стандартные значения: β₁=0.9, β₂=0.999.',
      },
      {
        name: 'Adam: финальное обновление',
        math: '\\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\varepsilon}\\hat{m}_t',
        explanation: 'Деление на корень второго момента адаптирует learning rate под каждый параметр. ε ≈ 1e-8 предотвращает деление на 0.',
      },
      {
        name: 'L1 Regularization (Lasso)',
        math: 'L_{\\text{total}} = L + \\lambda \\|\\mathbf{w}\\|_1 = L + \\lambda \\sum_j |w_j|',
        explanation: 'Штраф за сумму модулей весов. Порождает разрежённые решения (многие веса = 0). Байесовски — Лапласов априорный.',
      },
      {
        name: 'L2 Regularization (Ridge)',
        math: 'L_{\\text{total}} = L + \\lambda \\|\\mathbf{w}\\|_2^2 = L + \\lambda \\sum_j w_j^2',
        explanation: 'Штраф за сумму квадратов весов. Веса стягиваются к 0, но остаются ненулевыми. Байесовски — Гауссов априорный.',
      },
      {
        name: 'Elastic Net',
        math: 'L_{\\text{total}} = L + \\lambda_1 \\|\\mathbf{w}\\|_1 + \\lambda_2 \\|\\mathbf{w}\\|_2^2',
        explanation: 'Комбинация L1 и L2. Даёт разрежённость (как L1) и устойчивость при коррелированных признаках (как L2).',
      },
      {
        name: 'RMSprop Update',
        math: 'v_t = \\rho v_{t-1} + (1-\\rho)g_t^2,\\quad \\theta_{t+1} = \\theta_t - \\frac{\\eta}{\\sqrt{v_t}+\\varepsilon}g_t',
        explanation: 'Адаптивный метод: делит learning rate на корень скользящего среднего квадрата градиентов. ρ ≈ 0.9. Хорошо работает для RNN и нестационарных задач.',
      },
      {
        name: 'Learning Rate Schedule: Cosine Annealing',
        math: '\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\frac{\\pi t}{T}\\right)',
        explanation: 'Плавное убывание learning rate от max до min по косинусному закону. T — период (число итераций). Позволяет «найти» плоский минимум, избегая sharp minima.',
      },
      {
        name: 'Weight Decay (L2 Regularization в оптимизаторе)',
        math: '\\theta_{t+1} = (1 - \\lambda\\eta)\\theta_t - \\eta\\nabla L(\\theta_t)',
        explanation: 'Эквивалент L2-регуляризации в виде умножения весов на (1 - λη) на каждом шаге. В AdamW weight decay применяется независимо от адаптивного LR.',
      },
    ],
  },
  {
    id: 'deeplearning',
    title: 'Глубокое обучение',
    icon: '🧠',
    color: 'purple',
    formulas: [
      {
        name: 'Cross-Entropy Loss (бинарная)',
        math: 'L = -\\frac{1}{n}\\sum_{i=1}^{n}\\bigl[y_i\\log \\hat{y}_i + (1-y_i)\\log(1-\\hat{y}_i)\\bigr]',
        explanation: 'Стандартная функция потерь для бинарной классификации. Сильно штрафует уверенные неверные предсказания.',
      },
      {
        name: 'Softmax',
        math: '\\text{softmax}(z_j) = \\frac{e^{z_j}}{\\sum_{k=1}^{K} e^{z_k}}',
        explanation: 'Превращает логиты z в вероятностное распределение. Сумма всех выходов = 1. Используется на последнем слое для K-классовой задачи.',
      },
      {
        name: 'Batch Normalization',
        math: '\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\varepsilon}},\\quad y_i = \\gamma \\hat{x}_i + \\beta',
        explanation: 'Нормализует активации по мини-батчу. γ и β — обучаемые параметры масштаба и сдвига. ε ≈ 1e-5 для стабильности.',
      },
      {
        name: 'LSTM: Input Gate',
        math: 'i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)',
        explanation: 'Управляет тем, сколько новой информации записывается в ячейку памяти. σ — сигмоид, выход в [0,1].',
      },
      {
        name: 'LSTM: Cell State Update',
        math: 'C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t',
        explanation: 'f_t — forget gate (что забыть из прошлого), i_t⊙C̃_t — что записать нового. ⊙ — поэлементное умножение.',
      },
      {
        name: 'Scaled Dot-Product Attention',
        math: '\\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V',
        explanation: 'Q — запросы, K — ключи, V — значения. Деление на √d_k предотвращает проблему затухания градиентов при больших d_k.',
      },
      {
        name: 'Multi-Head Attention',
        math: '\\text{MHA}(Q,K,V) = \\text{Concat}(\\text{head}_1,\\ldots,\\text{head}_h)W^O',
        explanation: 'h голов внимания проецируют Q,K,V в разные пространства, что позволяет модели смотреть на разные аспекты контекста одновременно.',
      },
      {
        name: 'Dropout',
        math: 'y_i = \\frac{x_i \\cdot \\text{Bernoulli}(p)}{p}',
        explanation: 'Случайно обнуляет нейроны с вероятностью (1-p) во время обучения. Деление на p сохраняет ожидаемый масштаб активаций (inverted dropout).',
      },
      {
        name: 'Layer Normalization',
        math: '\\hat{x}_i = \\frac{x_i - \\mu_L}{\\sqrt{\\sigma_L^2 + \\varepsilon}},\\quad y_i = \\gamma \\hat{x}_i + \\beta',
        explanation: 'Нормализует по всем признакам одного примера (не по батчу). μ_L, σ_L² вычисляются по каналам/признакам конкретного объекта. Независима от размера батча — идеальна для Transformer.',
      },
      {
        name: 'Pooling Output Size',
        math: 'H_{out} = \\left\\lfloor \\frac{H_{in} - k + 2p}{s} \\right\\rfloor + 1',
        explanation: 'H_in — размер входа, k — kernel size, p — padding, s — stride. Та же формула для свёрточных слоёв. Для Global Average Pooling: H_out = W_out = 1.',
      },
      {
        name: 'Residual Connection (Skip Connection)',
        math: 'y = F(x, \\{W_i\\}) + x',
        explanation: 'Добавляет вход x к выходу блока F(x). Позволяет градиентам протекать напрямую (highway path). Ключевой элемент ResNet, Transformer. Решает проблему деградации при большой глубине.',
      },
      {
        name: 'GRU: Update Gate',
        math: 'z_t = \\sigma(W_z[h_{t-1}, x_t] + b_z)',
        explanation: 'z_t контролирует, насколько обновляется hidden state: h_t = (1-z_t)⊙h_{t-1} + z_t⊙h̃_t. При z≈0 сохраняется прошлое состояние; при z≈1 — принимается новое. Аналог forget+input gate в LSTM.',
      },
    ],
  },
]

const colorHeader: Record<string, string> = {
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  orange: 'bg-orange-500',
  purple: 'bg-purple-600',
}

const colorBorder: Record<string, string> = {
  green: 'border-green-200',
  blue: 'border-blue-200',
  orange: 'border-orange-200',
  purple: 'border-purple-200',
}

const colorBg: Record<string, string> = {
  green: 'bg-green-50',
  blue: 'bg-blue-50',
  orange: 'bg-orange-50',
  purple: 'bg-purple-50',
}

export default function CheatsheetPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📐 Шпаргалка формул</h1>
        <p className="text-gray-600">
          Все ключевые формулы машинного обучения на одной странице. Используй для быстрого повторения перед собеседованием.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map(cat => (
          <section key={cat.id}>
            <div className={`${colorHeader[cat.color]} text-white rounded-t-xl px-6 py-3 flex items-center gap-3`}>
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="text-xl font-bold">{cat.title}</h2>
            </div>
            <div className={`border-x border-b ${colorBorder[cat.color]} rounded-b-xl divide-y ${colorBorder[cat.color]}`}>
              {cat.formulas.map(f => (
                <div key={f.name} className={`${colorBg[cat.color]} px-6 py-5`}>
                  <div className="font-semibold text-gray-800 mb-3 text-sm">{f.name}</div>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-4 mb-3 overflow-x-auto text-center">
                    <Formula math={f.math} block={true} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-500">
        Формулы рендерятся через <strong>KaTeX</strong>. Для интерактивных примеров с ручными расчётами открой нужную тему в разделе{' '}
        <a href="/topics" className="text-blue-600 hover:underline">Все темы</a>.
      </div>
    </div>
  )
}
