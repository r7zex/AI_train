const inlinePattern = /(pd\.read_csv|pd\.DataFrame|df\.head|df\.info|df\.describe|df\.columns|df\.isna|value_counts|groupby|np\.array|np\.zeros|np\.ones|np\.full|np\.arange|np\.linspace|np\.sum|np\.mean|np\.min|np\.max|np\.std|np\.var|np\.median|np\.quantile|np\.percentile|np\.where|np\.any|np\.all|np\.sort|np\.argsort|np\.unique|np\.argmax|np\.argmin|np\.random\.default_rng|rng\.integers|rng\.normal|rng\.uniform|rng\.permutation|rng\.choice|model\.fit|model\.predict|train_test_split|fit_transform|predict_proba|OneHotEncoder|OrdinalEncoder|SimpleImputer|StandardScaler|MinMaxScaler|RobustScaler|ColumnTransformer|Pipeline|LogisticRegression|LinearRegression|RandomForestClassifier|XGBClassifier|CatBoostClassifier|CrossEntropyLoss|BCEWithLogitsLoss|DataLoader|Conv2d|Transformer|random_state|learning_rate|weight_decay|n_estimators|max_depth|early_stopping_rounds|sparse_output|class_weight|batch_size|test_size|stratify|shuffle|n_splits|kernel_size|padding|num_heads|d_model|validation|precision|recall|accuracy|logits|loss|leakage|dropout|ndarray|shape|ndim|size|dtype|astype|axis|reshape|ravel|flatten|broadcasting|baseline|target|features|loc|iloc|fit|transform|predict|train|validate|AdamW|Adam|SGD|RMSprop|MAE|MSE|RMSE|R²|F1|TP|FP|FN|[A-Za-z_][A-Za-z0-9_]*(?=\())/
const richTokenPattern = /(`[^`]+`|\*\*[^*]+\*\*)/g

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded border border-[#e1e5ea] bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.92em] text-[#111827]">
      {children}
    </code>
  )
}

function renderAutoCode(value: string, keyPrefix: string) {
  return value.split(inlinePattern).map((part, index) => {
    if (!part) return null
    if (inlinePattern.test(part)) {
      return <InlineCode key={`${keyPrefix}-${part}-${index}`}>{part}</InlineCode>
    }
    return <span key={`${keyPrefix}-${part}-${index}`}>{part}</span>
  })
}

export default function RichText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(richTokenPattern).map((part, index) => {
        if (!part) return null
        if (part.startsWith('`') && part.endsWith('`')) {
          return <InlineCode key={`${part}-${index}`}>{part.slice(1, -1)}</InlineCode>
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${part}-${index}`}>{renderAutoCode(part.slice(2, -2), `strong-${index}`)}</strong>
        }
        return renderAutoCode(part, `text-${index}`)
      })}
    </span>
  )
}
