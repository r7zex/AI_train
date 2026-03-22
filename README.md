# 🧠 ML Тренажёр

Локальный интерактивный учебник по машинному обучению и deep learning — для подготовки к собеседованиям и самостоятельного изучения.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173) в браузере.

## 📦 Сборка

```bash
npm run build
npm run preview
```

## 📚 Содержание курса

### Разделы (20 тем)

| Раздел | Темы |
|--------|------|
| 🌳 Классическое МО | Gini Impurity, Bagging vs Boosting, SVM Margin, Наивный Байес |
| 📊 Метрики качества | Precision/Recall/F1, ROC-AUC, PR-AUC, Macro-averaging |
| ⚙️ Методология и оптимизация | Data Leakage, K-fold CV, Gradient Descent, L1/L2 Регуляризация, CatBoost/LightGBM/XGBoost |
| 🧠 Глубокое обучение | Vanishing Gradient, Dropout, Pooling в CNN, LSTM vs RNN, BatchNorm/LayerNorm, Transformers Q/K/V |
| 🚀 Оптимизация и деплой | Quantization нейросетей |

### Справочные страницы

- **📐 Шпаргалка формул** — все ключевые формулы на одной странице
- **⚖️ Сравнительные таблицы** — Bagging/Boosting, L1/L2, нормализации, оптимизаторы, CNN/RNN/Transformer, XGBoost/LightGBM/CatBoost
- **📖 Словарь терминов** — 34 ключевых понятия ML/DL с поиском
- **🚫 Типичные ошибки** — 23 частых заблуждения на собеседованиях с правильными ответами
- **❓ Как учиться** — руководство по использованию тренажёра

## 🛠️ Технологии

- **Vite + React + TypeScript**
- **Tailwind CSS v3** — стилизация
- **React Router v7** — роутинг
- **KaTeX** — математические формулы
- **react-syntax-highlighter** — подсветка кода
- **localStorage** — хранение прогресса

## 📁 Структура проекта

```
src/
├── App.tsx                    # Роутинг
├── main.tsx                   # Точка входа
├── data/topics.ts             # Данные о темах и разделах
├── hooks/useProgress.ts       # Хук для прогресса (localStorage)
├── layouts/MainLayout.tsx     # Основной layout
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Formula.tsx            # KaTeX формулы
│   ├── CodeBlock.tsx          # Блоки кода с подсветкой
│   ├── InfoBlock.tsx          # Информационные блоки
│   ├── TaskBlock.tsx          # Практические задания
│   ├── Breadcrumbs.tsx
│   ├── ProgressButton.tsx
│   └── calculators/
│       ├── GiniCalc.tsx
│       ├── PrecisionRecallCalc.tsx
│       ├── GradientDescentCalc.tsx
│       └── AttentionShapeCalc.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── TopicsPage.tsx
│   ├── TopicDetailPage.tsx
│   ├── GuidePage.tsx
│   ├── CheatsheetPage.tsx
│   ├── MistakesPage.tsx
│   ├── GlossaryPage.tsx
│   └── ComparisonPage.tsx
└── content/                   # Контент для 20 тем
    ├── giniImpurity.tsx
    ├── baggingBoosting.tsx
    ├── svmMargin.tsx
    ├── naiveBayes.tsx
    ├── precisionRecall.tsx
    ├── rocAuc.tsx
    ├── prAuc.tsx
    ├── macroAveraging.tsx
    ├── dataLeakage.tsx
    ├── kfold.tsx
    ├── gradientDescent.tsx
    ├── regularization.tsx
    ├── boostingComparison.tsx
    ├── vanishingGradient.tsx
    ├── dropout.tsx
    ├── pooling.tsx
    ├── lstmRnn.tsx
    ├── normalization.tsx
    ├── transformersQKV.tsx
    └── quantization.tsx
```

## ✅ Функциональность

- Интерактивные калькуляторы (Gini, Precision/Recall, Gradient Descent, Attention shapes)
- KaTeX формулы с блочным и инлайн-отображением
- Подсветка синтаксиса кода (Python/PyTorch/sklearn)
- Система прогресса в localStorage
- Поиск по словарю терминов
- Фильтрация ошибок по категориям
- Адаптивный интерфейс (мобильный + десктоп)
