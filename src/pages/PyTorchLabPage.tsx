import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const coreTopics = [
  { to: '/topics/pytorch-tensors', title: 'Тензоры и операции', desc: 'dtype, device, shape/view/reshape, in-place нюансы' },
  { to: '/topics/pytorch-autograd', title: 'Autograd и вычислительный граф', desc: 'градиенты, backward, retain_graph' },
  { to: '/topics/pytorch-module', title: 'nn.Module и архитектуры', desc: 'модули, forward, параметры, state_dict' },
  { to: '/topics/pytorch-train-loop', title: 'Train/Valid loop', desc: 'zero_grad, backward, step, метрики по эпохам' },
  { to: '/topics/pytorch-eval-no-grad', title: 'train() vs eval() / no_grad()', desc: 'корректное поведение на инференсе' },
  { to: '/topics/pytorch-loss-functions', title: 'Функции потерь', desc: 'CrossEntropyLoss, BCEWithLogitsLoss, class weights' },
]

const checklistItems = [
  'Использую logits в CrossEntropyLoss (без softmax перед loss)',
  'В train-loop соблюдаю порядок: zero_grad -> forward -> loss -> backward -> step',
  'Переключаю модель в eval() перед валидацией и инференсом',
  'Использую torch.no_grad() для инференса',
  'Переношу и модель, и батч на один device',
  'Логирую train/val метрики отдельно',
]

export default function PyTorchLabPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const done = useMemo(
    () => checklistItems.filter((item) => checked[item]).length,
    [checked],
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PyTorch Lab</h1>
        <p className="text-gray-600 max-w-3xl">
          Практический хаб для задач по PyTorch: структура модели, train/eval поведение, типовые ошибки и базовые
          правила production-ready цикла обучения.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {coreTopics.map((topic) => (
          <Link
            key={topic.to}
            to={topic.to}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:border-orange-300 transition-all"
          >
            <h2 className="font-semibold text-gray-800 mb-1">{topic.title}</h2>
            <p className="text-sm text-gray-600">{topic.desc}</p>
            <div className="text-xs text-orange-600 mt-3 font-medium">Открыть →</div>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Self-check перед отправкой решения</h2>
        <p className="text-sm text-gray-600 mb-4">
          Отметьте пункты, чтобы убедиться, что базовые инженерные требования к PyTorch-решению соблюдены.
        </p>

        <div className="space-y-2 mb-4">
          {checklistItems.map((item) => (
            <label key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={!!checked[item]}
                onChange={(e) => setChecked((prev) => ({ ...prev, [item]: e.target.checked }))}
                className="mt-0.5"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <div className="text-sm">
          <span className="font-semibold text-gray-800">{done} / {checklistItems.length}</span>{' '}
          <span className="text-gray-600">критериев закрыто</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Link to="/code-practice" className="text-center bg-orange-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-orange-700 transition-colors">
          Открыть structural checker
        </Link>
        <Link to="/quiz" className="text-center bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold hover:bg-indigo-700 transition-colors">
          Пройти PyTorch квизы
        </Link>
        <Link to="/progress" className="text-center bg-white border border-gray-300 text-gray-700 rounded-xl px-4 py-3 font-semibold hover:bg-gray-50 transition-colors">
          Смотреть прогресс
        </Link>
      </div>
    </div>
  )
}

