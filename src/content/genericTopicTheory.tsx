import Formula from '../components/Formula'
import CodeBlock from '../components/CodeBlock'
import InfoBlock from '../components/InfoBlock'
import TaskBlock, { type Task } from '../components/TaskBlock'

type TopicKind =
  | 'metrics'
  | 'preprocessing'
  | 'trees'
  | 'pytorch'
  | 'neural'
  | 'optimization'
  | 'statistics'
  | 'classical'
  | 'general'

interface FormulaItem {
  title: string
  math: string
  explanation: string
}

interface TopicTemplate {
  shortEssence: string
  outcomes: string[]
  theory: string[]
  formulas: FormulaItem[]
  intuition: string
  handCalcTitle: string
  handCalcSteps: string[]
  code: {
    snippet: string
    output: string
    explanation: string
  }
  pitfalls: string[]
  summary: string[]
  tasks: Task[]
  sources: string[]
}

interface GenericTopicTheoryProps {
  topicTitle: string
  topicDescription: string
  sectionTitle: string
}

function includesAny(text: string, keys: string[]): boolean {
  return keys.some((key) => text.includes(key))
}

function detectTopicKind(title: string, description: string): TopicKind {
  const text = `${title} ${description}`.toLowerCase()

  if (includesAny(text, ['pytorch', 'torch', 'nn.module', 'dataloader', 'dataset', 'optimizer'])) return 'pytorch'
  if (includesAny(text, ['precision', 'recall', 'f1', 'roc', 'auc', 'метрик', 'confusion', 'calibration'])) return 'metrics'
  if (includesAny(text, ['split', 'stratify', 'scaler', 'normaliz', 'one-hot', 'pipeline', 'columntransformer', 'leakage'])) return 'preprocessing'
  if (includesAny(text, ['tree', 'дерев', 'random forest', 'boost', 'gini', 'xgboost', 'lightgbm', 'catboost'])) return 'trees'
  if (includesAny(text, ['transformer', 'attention', 'cnn', 'rnn', 'lstm', 'gru', 'нейрон', 'backprop', 'dropout'])) return 'neural'
  if (includesAny(text, ['gradient', 'оптимиз', 'regulariz', 'learning rate', 'loss', 'weight decay'])) return 'optimization'
  if (includesAny(text, ['bayes', 'probab', 'распредел', 'mle', 'map', 'hypothesis', 'p-value', 'корреляц', 'entropy', 'kl'])) return 'statistics'
  if (includesAny(text, ['logistic', 'linear', 'svm', 'naive', 'k-nn', 'knn', 'регресс', 'классифик'])) return 'classical'
  return 'general'
}

function buildTemplate(kind: TopicKind, title: string, description: string, sectionTitle: string): TopicTemplate {
  const commonTasks: Task[] = [
    {
      level: 'basic',
      question: `Сформулируйте в 2–3 предложениях, что именно решает тема «${title}» и где это применяют на практике.`,
      solution: 'Опора на бизнес-кейс + тип данных + метрика качества. Хороший ответ связывает тему с конкретным этапом ML-пайплайна.',
    },
    {
      level: 'concept',
      question: 'Назовите главное ограничение подхода и один способ его компенсировать.',
      solution: 'Ограничение зависит от метода: чувствительность к шуму, утечки, переобучение, плохая калибровка и т.д. Компенсация: валидация, регуляризация, корректный split, калибровка или подбор гиперпараметров.',
    },
    {
      level: 'tricky',
      question: 'Как объяснить тему интервьюеру без формул, но технически корректно?',
      solution: 'Нужно проговорить: цель метода, вход/выход, критерий качества, типовые ошибки и как диагностировать проблему на практике.',
    },
  ]

  const generalTemplate: TopicTemplate = {
    shortEssence: `Тема «${title}» относится к разделу «${sectionTitle}» и закрывает важный шаг практического ML/DL-процесса: от постановки задачи до проверки качества и интерпретации результата.`,
    outcomes: [
      'Понимать, какую проблему решает подход и какие входные данные ему нужны.',
      'Выбирать корректные метрики и валидационную схему для задачи.',
      'Объяснять ограничения метода и типовые источники ошибок.',
      'Связывать теорию с рабочим Python/ML-кодом.',
    ],
    theory: [
      'Любой ML-алгоритм оптимизирует целевую функцию: качество на обучении должно переноситься на новые данные.',
      'Надежная оценка модели строится на разделении данных (train/valid/test) и контроле утечек.',
      'Сложность модели, размер данных и шум определяют компромисс bias-variance.',
      'Метод считается применимым, если его предположения согласуются с природой признаков и целевой переменной.',
    ],
    formulas: [
      {
        title: 'Эмпирический риск',
        math: 'R_{emp}(f) = \\frac{1}{n}\\sum_{i=1}^{n}\\ell(y_i, f(x_i))',
        explanation: 'Средняя ошибка модели на обучающей выборке.',
      },
      {
        title: 'Обновление градиентным шагом',
        math: '\\theta_{t+1} = \\theta_t - \\eta\\nabla_\\theta L(\\theta_t)',
        explanation: 'Базовый механизм обучения параметрических моделей.',
      },
    ],
    intuition: 'Хорошая модель не та, что идеально запомнила train, а та, что стабильно держит качество на новых данных.',
    handCalcTitle: 'Мини-пример ручного рассуждения',
    handCalcSteps: [
      'Возьмите 8–12 объектов и зафиксируйте целевую переменную.',
      'Оцените простой baseline (например, самый частый класс или среднее).',
      'Сравните качество baseline и подхода из темы на одинаковой метрике.',
      'Сделайте вывод: где метод дает прирост и где его предположения не выполняются.',
    ],
    code: {
      snippet: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.linear_model import LogisticRegression

X = np.array([
    [0.1, 1.0], [0.3, 0.8], [0.2, 1.1], [1.2, 0.2],
    [1.3, 0.3], [1.1, 0.1], [0.0, 0.9], [1.4, 0.4]
])
y = np.array([0, 0, 0, 1, 1, 1, 0, 1])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)

model = LogisticRegression()
model.fit(X_train, y_train)
pred = model.predict(X_test)

print("F1:", round(f1_score(y_test, pred), 3))`,
      output: 'F1: 1.0',
      explanation: 'Даже на крошечном датасете важно соблюдать корректный split и считать метрику на отложенной части.',
    },
    pitfalls: [
      'Оценивать качество только на train и делать вывод об обобщении.',
      'Смешивать этапы подготовки данных и допускать leakage.',
      'Выбирать метрику, не соответствующую бизнес-стоимости ошибок.',
    ],
    summary: [
      `Тема: ${title}`,
      `Ключевая идея: ${description}`,
      'Главный принцип: валидируй гипотезы на отложенных данных.',
      'Главный риск: переоценить качество из-за неверной методологии.',
    ],
    tasks: commonTasks,
    sources: [
      'scikit-learn User Guide — model selection и metrics',
      'Deep Learning (Goodfellow et al.) — оптимизация и обобщение',
      'Stanford CS229 notes — bias/variance, validation',
    ],
  }

  if (kind === 'metrics') {
    return {
      ...generalTemplate,
      theory: [
        'Метрика должна отражать цену ошибок в конкретной задаче.',
        'При дисбалансе классов accuracy часто вводит в заблуждение.',
        'Порог классификации влияет на precision/recall, но не меняет ранжирование ROC-AUC.',
        'Для редкого положительного класса PR-AUC обычно информативнее ROC-AUC.',
      ],
      formulas: [
        { title: 'Precision', math: 'P = \\frac{TP}{TP + FP}', explanation: 'Точность положительных предсказаний.' },
        { title: 'Recall', math: 'R = \\frac{TP}{TP + FN}', explanation: 'Полнота обнаружения положительного класса.' },
        { title: 'F1', math: 'F_1 = 2\\cdot\\frac{PR}{P+R}', explanation: 'Баланс precision и recall.' },
      ],
      intuition: 'Если ложноположительные очень дороги — оптимизируй precision; если опасно пропустить позитив — recall.',
      handCalcTitle: 'Ручной расчет метрик по confusion matrix',
      handCalcSteps: [
        'Пусть TP=32, FP=8, FN=10, TN=50.',
        'Precision = 32 / (32 + 8) = 0.80.',
        'Recall = 32 / (32 + 10) = 0.762.',
        'F1 = 2 * 0.80 * 0.762 / (0.80 + 0.762) ≈ 0.781.',
      ],
      pitfalls: [
        'Сравнивать модели только по accuracy при сильном дисбалансе.',
        'Не фиксировать порог при сравнении precision/recall.',
        'Интерпретировать ROC-AUC как «процент правильных ответов».',
      ],
      tasks: [
        {
          level: 'basic',
          question: 'При TP=18, FP=6, FN=3 вычислите precision, recall и F1.',
          solution: 'Precision=0.75, Recall=0.857, F1≈0.80.',
        },
        ...commonTasks.slice(1),
      ],
      sources: [
        'scikit-learn Docs — Classification metrics',
        'PR/ROC tutorial (Davis & Goadrich, 2006)',
        'Pattern Recognition and Machine Learning (Bishop), раздел по оценке классификаторов',
      ],
    }
  }

  if (kind === 'preprocessing') {
    return {
      ...generalTemplate,
      theory: [
        'Качество модели часто ограничено не алгоритмом, а качеством подготовки данных.',
        'Любые параметры преобразований (mean/std, target statistics) должны вычисляться только на train.',
        'Stratified split сохраняет доли классов и делает оценку стабильнее.',
        'Pipeline/ColumnTransformer защищают от утечек и упрощают reproducibility.',
      ],
      formulas: [
        { title: 'Стандартизация', math: 'z = \\frac{x - \\mu_{train}}{\\sigma_{train}}', explanation: 'Статистики считаются по train.' },
        { title: 'Min-Max scaling', math: 'x_{scaled} = \\frac{x - x_{min}}{x_{max} - x_{min}}', explanation: 'Чувствителен к выбросам.' },
      ],
      intuition: 'Если модель «подглядывает» в test через preprocessing, качество на бумаге растет, а в проде падает.',
      handCalcTitle: 'Ручной пример standardization',
      handCalcSteps: [
        'Train-признак: [10, 12, 14, 16], значит μ=13, σ≈2.236.',
        'Test-значение x=18 даёт z=(18-13)/2.236≈2.236.',
        'Важно: нельзя пересчитывать μ и σ по test.',
      ],
      pitfalls: [
        'fit_transform на всех данных до train/test split.',
        'Использование target encoding без защиты от leakage.',
        'Случайный split для временных рядов без учета времени.',
      ],
      sources: [
        'scikit-learn Docs — Pipeline, ColumnTransformer, preprocessing',
        'Kaggle Learn — Data Leakage',
        'Hands-On Machine Learning (Geron), главы по preprocessing',
      ],
    }
  }

  if (kind === 'trees') {
    return {
      ...generalTemplate,
      theory: [
        'Деревья строят последовательность логических правил вида feature <= threshold.',
        'Критерий split максимизирует уменьшение impurity (Gini/entropy).',
        'Random Forest снижает variance через bagging и случайный выбор признаков.',
        'Boosting снижает bias: новые деревья исправляют ошибки предыдущих.',
      ],
      formulas: [
        { title: 'Gini impurity', math: 'G = 1 - \\sum_{k=1}^{K} p_k^2', explanation: 'Неоднородность узла.' },
        { title: 'Information Gain', math: 'IG = H(parent) - \\sum_j w_j H(child_j)', explanation: 'Прирост информации после split.' },
      ],
      intuition: 'Bagging усредняет много «шумных» деревьев, boosting учит деревья работать как команда исправлений.',
      handCalcTitle: 'Ручной расчет Gini для split',
      handCalcSteps: [
        'Родитель: 6 объектов класса A, 4 класса B => Gini=1-(0.6^2+0.4^2)=0.48.',
        'Левый узел: [4A,1B] => Gini=0.32, правый: [2A,3B] => Gini=0.48.',
        'Взвешенный Gini после split = 0.5*0.32 + 0.5*0.48 = 0.40.',
        'Gain = 0.48 - 0.40 = 0.08.',
      ],
      pitfalls: [
        'Считать feature importance как причинность.',
        'Сравнивать boosting/forest без одинаковой схемы CV.',
        'Игнорировать раннюю остановку и регуляризацию в boosting.',
      ],
      sources: [
        'scikit-learn Docs — Tree-based models',
        'Elements of Statistical Learning, главы 8–10',
        'XGBoost, LightGBM, CatBoost official docs',
      ],
    }
  }

  if (kind === 'pytorch') {
    return {
      ...generalTemplate,
      theory: [
        'В PyTorch ключевая идея — динамический вычислительный граф (define-by-run).',
        'Шаблон обучения: forward -> loss -> zero_grad -> backward -> optimizer.step.',
        'Режимы model.train() и model.eval() влияют на Dropout/BatchNorm.',
        'Для инференса нужно отключать градиенты через torch.no_grad().',
      ],
      formulas: [
        { title: 'CrossEntropyLoss', math: 'L = -\\sum_{c=1}^{C} y_c\\log(\\hat{p}_c)', explanation: 'Для многоклассовой классификации.' },
        { title: 'SGD update', math: '\\theta \\leftarrow \\theta - \\eta\\nabla_\\theta L', explanation: 'Базовое обновление параметров.' },
      ],
      intuition: 'Большинство багов в PyTorch — не в архитектуре, а в неправильном train/eval цикле и работе с устройствами.',
      handCalcTitle: 'Ручной шаг градиентного обновления',
      handCalcSteps: [
        'Пусть текущий вес w=0.8, градиент dw=0.25, learning rate=0.1.',
        'Обновление: w_new = 0.8 - 0.1*0.25 = 0.775.',
        'Такой шаг выполняется для каждого обучаемого параметра.',
      ],
      code: {
        snippet: `import torch
import torch.nn as nn

class TinyNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(8, 32), nn.ReLU(),
            nn.Linear(32, 16), nn.ReLU(),
            nn.Linear(16, 2)
        )
    def forward(self, x):
        return self.net(x)

model = TinyNet()
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

x = torch.randn(16, 8)
y = torch.randint(0, 2, (16,))

model.train()
logits = model(x)
loss = criterion(logits, y)
opt.zero_grad()
loss.backward()
opt.step()

model.eval()
with torch.no_grad():
    probs = torch.softmax(model(x), dim=1)
print("loss:", float(loss), "probs_shape:", tuple(probs.shape))`,
        output: 'loss: 0.69 ... probs_shape: (16, 2)',
        explanation: 'Показан минимальный корректный цикл обучения и инференса.',
      },
      pitfalls: [
        'Забывать optimizer.zero_grad() и накапливать старые градиенты.',
        'Передавать в CrossEntropyLoss уже softmax-вероятности вместо logits.',
        'Не переключать модель в eval() перед валидацией/инференсом.',
      ],
      sources: [
        'PyTorch Docs — nn.Module, optim, autograd',
        'PyTorch Tutorials — Training a Classifier',
        'Dive into Deep Learning — chapter on implementation',
      ],
    }
  }

  if (kind === 'neural') {
    return {
      ...generalTemplate,
      theory: [
        'Нейросеть — композиция дифференцируемых слоев с обучаемыми параметрами.',
        'Обучение происходит через backpropagation и градиентный спуск.',
        'Архитектура выбирается по структуре данных: CNN для изображений, RNN/LSTM для последовательностей, Transformer для длинного контекста.',
        'Регуляризация и нормализация критичны для стабильного обучения.',
      ],
      formulas: [
        { title: 'Линейный слой', math: 'h = Wx + b', explanation: 'Базовая аффинная трансформация.' },
        { title: 'ReLU', math: '\\mathrm{ReLU}(x)=\\max(0,x)', explanation: 'Нелинейная активация.' },
        { title: 'Attention core', math: '\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V', explanation: 'Ядро self-attention.' },
      ],
      intuition: 'Архитектура задает индуктивное смещение: модель быстрее учит нужные паттерны, если форма данных совпадает с формой слоя.',
      handCalcTitle: 'Ручной forward pass (1 нейрон)',
      handCalcSteps: [
        'Вход x=[2, -1], веса w=[0.3, 0.8], смещение b=-0.1.',
        'z = 2*0.3 + (-1)*0.8 - 0.1 = -0.3.',
        'После ReLU: max(0, -0.3)=0.',
      ],
      pitfalls: [
        'Слишком глубокая сеть без нормализации и skip connections.',
        'Отсутствие контроля train/val метрик по эпохам.',
        'Слепое увеличение числа параметров без проверки data regime.',
      ],
      sources: [
        'Deep Learning (Goodfellow et al.)',
        'CS231n/CS224n lecture notes',
        'Attention Is All You Need (Vaswani et al.)',
      ],
    }
  }

  if (kind === 'optimization') {
    return {
      ...generalTemplate,
      theory: [
        'Оптимизация подбирает параметры модели через минимум функции потерь.',
        'Скорость обучения определяется learning rate, типом оптимизатора и масштабом градиентов.',
        'Регуляризация ограничивает сложность модели и снижает переобучение.',
        'Scheduler и early stopping стабилизируют обучение в глубоких сетях.',
      ],
      formulas: [
        { title: 'Gradient descent', math: '\\theta_{t+1}=\\theta_t-\\eta\\nabla L(\\theta_t)', explanation: 'Базовый шаг оптимизации.' },
        { title: 'L2 regularization', math: 'L_{total}=L+\\lambda\\|w\\|_2^2', explanation: 'Штраф за большие веса.' },
      ],
      intuition: 'Оптимизатор отвечает за скорость и стабильность шага, регуляризация — за качество обобщения.',
      handCalcTitle: 'Один шаг GD',
      handCalcSteps: [
        'Пусть w=1.5, grad=0.4, lr=0.05.',
        'w_new = 1.5 - 0.05*0.4 = 1.48.',
        'Если grad шумный, уменьшайте lr или используйте моментум/AdamW.',
      ],
      pitfalls: [
        'Слишком большой lr: loss скачет и не сходится.',
        'Слишком маленький lr: обучение чрезмерно медленное.',
        'Путать L2 regularization и decoupled weight decay в AdamW.',
      ],
      sources: [
        'Deep Learning book — optimization chapter',
        'PyTorch Docs — optimizers and schedulers',
        'Adam/AdamW original papers',
      ],
    }
  }

  if (kind === 'statistics') {
    return {
      ...generalTemplate,
      theory: [
        'Статистическая часть ML отвечает за неопределенность, оценивание и проверку гипотез.',
        'Вероятностные модели позволяют интерпретировать предсказания как распределения.',
        'MLE/MAP связывают оптимизацию с вероятностной постановкой задачи.',
        'Корректная статистика предотвращает ложные выводы в экспериментах.',
      ],
      formulas: [
        { title: 'Формула Байеса', math: 'P(A|B)=\\frac{P(B|A)P(A)}{P(B)}', explanation: 'Переход от априорных к апостериорным вероятностям.' },
        { title: 'Log-likelihood', math: '\\log L(\\theta)=\\sum_{i=1}^{n}\\log p(x_i|\\theta)', explanation: 'Основа MLE.' },
      ],
      intuition: 'Данные не «доказывают» истину, а сдвигают вероятности в пользу одних гипотез против других.',
      handCalcTitle: 'Мини-пример Байеса',
      handCalcSteps: [
        'P(болезнь)=0.01, чувствительность теста=0.95, ложноположительная=0.05.',
        'P(+)=0.95*0.01 + 0.05*0.99 = 0.059.',
        'P(болезнь|+) = 0.95*0.01 / 0.059 ≈ 0.161.',
        'Даже хороший тест при редком событии может иметь низкий PPV.',
      ],
      pitfalls: [
        'Игнорировать base rate при интерпретации вероятностей.',
        'Использовать p-value как «вероятность истинности гипотезы».',
        'Путать корреляцию с причинностью.',
      ],
      sources: [
        'Probability for Data Science (MIT notes)',
        'PRML (Bishop), probabilistic view',
        'Statistical Inference (Casella & Berger)',
      ],
    }
  }

  if (kind === 'classical') {
    return {
      ...generalTemplate,
      theory: [
        'Классические ML-модели дают сильный baseline и часто выигрывают на табличных данных.',
        'Линейные модели просты, интерпретируемы и хорошо масштабируются.',
        'SVM/деревья/бустинг покрывают нелинейные зависимости разными способами.',
        'Ключ к качеству — признаки, валидация и корректный выбор регуляризации.',
      ],
      formulas: [
        { title: 'Логистическая функция', math: '\\sigma(z)=\\frac{1}{1+e^{-z}}', explanation: 'Преобразует logit в вероятность.' },
        { title: 'Линейная регрессия', math: '\\hat{y}=w^\\top x + b', explanation: 'Базовая модель для непрерывной цели.' },
      ],
      intuition: 'Сильная простая модель с чистым пайплайном часто полезнее сложной модели без контроля методологии.',
      handCalcTitle: 'Мини-пример logit -> probability',
      handCalcSteps: [
        'Пусть z = 1.2.',
        'σ(z)=1/(1+e^-1.2)≈0.768.',
        'При пороге 0.5 объект пойдет в положительный класс.',
      ],
      pitfalls: [
        'Считать, что линейная модель «не может быть мощной».',
        'Не масштабировать признаки для SVM/k-NN/логистической регрессии.',
        'Переобучать подбором гиперпараметров на test.',
      ],
      sources: [
        'scikit-learn User Guide — linear models, SVM, neighbors',
        'An Introduction to Statistical Learning',
        'ESL (Hastie/Tibshirani/Friedman)',
      ],
    }
  }

  return generalTemplate
}

export default function GenericTopicTheory({ topicTitle, topicDescription, sectionTitle }: GenericTopicTheoryProps) {
  const kind = detectTopicKind(topicTitle, topicDescription)
  const template = buildTemplate(kind, topicTitle, topicDescription, sectionTitle)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Краткая суть</h2>
        <p className="text-gray-700 leading-relaxed">{template.shortEssence}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Что вы поймете после темы</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1.5">
          {template.outcomes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Теория по шагам</h2>
        <div className="space-y-2.5">
          {template.theory.map((line) => (
            <p key={line} className="text-gray-700 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
        <InfoBlock type="intuition" title="Интуиция">
          {template.intuition}
        </InfoBlock>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Формулы</h2>
        <div className="space-y-4">
          {template.formulas.map((formula) => (
            <div key={formula.title} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="font-semibold text-gray-800 text-sm mb-2">{formula.title}</div>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-center mb-2">
                <Formula math={formula.math} block />
              </div>
              <p className="text-sm text-gray-600">{formula.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">{template.handCalcTitle}</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1.5">
          {template.handCalcSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Пример на Python</h2>
        <CodeBlock
          language="python"
          code={template.code.snippet}
          output={template.code.output}
          explanation={template.code.explanation}
        />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Типичные ошибки</h2>
        <div className="space-y-2">
          {template.pitfalls.map((pitfall) => (
            <div key={pitfall} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              ❌ {pitfall}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Мини-конспект</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1.5">
          {template.summary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Практика</h2>
        <TaskBlock tasks={template.tasks} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">Источники</h2>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {template.sources.map((source) => (
            <li key={source}>📚 {source}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

