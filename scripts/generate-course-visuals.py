"""Generate deterministic PNG illustrations used by the AI Train curriculum.

The script intentionally writes raster assets: course pages consume the saved
PNG files and do not reconstruct diagrams in React. ML plots are produced from
real scikit-learn models fitted on deterministic synthetic datasets.
"""

from __future__ import annotations

import io
import math
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/ai-train-matplotlib")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Rectangle
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs, make_classification, make_moons, make_regression
from sklearn.ensemble import BaggingClassifier, GradientBoostingRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import KFold, learning_curve
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, plot_tree


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "course-visuals"
OUT.mkdir(parents=True, exist_ok=True)

GREEN = "#69be62"
GREEN_DARK = "#2f7a46"
BLUE = "#4f8edc"
BLUE_DARK = "#35546f"
CORAL = "#f17869"
YELLOW = "#f4c542"
INK = "#1f2933"
MUTED = "#68727b"
GRID = "#dfe5e8"
PALE = "#f5f7f8"


TOPICS = [
    ("python-syntax-types", "Переменные и типы данных"),
    ("python-collections-loops", "Коллекции и цикл"),
    ("python-functions-errors", "Функция и обработка ошибки"),
    ("python-files-environment", "Файлы, модули и окружение"),
    ("numpy-why", "Массив NumPy"),
    ("numpy-array-creation", "Способы создания массива"),
    ("numpy-shape-ndim-dtype", "Форма, размерность и тип"),
    ("numpy-indexing-slices", "Индексы и срезы"),
    ("numpy-vector-operations", "Векторные операции"),
    ("numpy-aggregations-statistics", "Агрегации и распределение"),
    ("numpy-2d-axis", "Оси двумерного массива"),
    ("numpy-masks-where", "Булева маска"),
    ("numpy-broadcasting", "Broadcasting без копирования"),
    ("numpy-random-reproducibility", "Одинаковый seed — одинаковый результат"),
    ("pandas-why-dataframe", "Строки и столбцы DataFrame"),
    ("pandas-read-inspect", "Загрузка и первый осмотр"),
    ("pandas-selection", "Выбор строк и столбцов"),
    ("pandas-filtering-sorting", "Фильтрация и сортировка"),
    ("pandas-missing-duplicates", "Пропуски и дубликаты"),
    ("pandas-groupby", "Группировка и агрегирование"),
    ("pandas-types-preparation", "Подготовка признаков"),
    ("matplotlib-basics", "Figure и Axes"),
    ("matplotlib-lines-scatter", "Линия и диаграмма рассеяния"),
    ("matplotlib-distributions", "Как выглядит распределение"),
    ("matplotlib-layout-export", "Несколько графиков на одном рисунке"),
    ("eda-correlation", "Связи между признаками"),
    ("ml-foundations-data-target", "Признаки X и целевая переменная y"),
    ("ml-foundations-model-fit-predict", "Как модель учится и делает прогноз"),
    ("ml-foundations-train-test-baseline-metrics", "Честная проверка модели"),
    ("ml-foundations-project-cycle", "Цикл ML-проекта"),
    ("ml-problem-types", "Три вида задач машинного обучения"),
    ("validation-split", "Обучающая, проверочная и тестовая части"),
    ("cross-validation-search", "Кросс-валидация"),
    ("metrics-confusion-matrix", "Матрица ошибок"),
    ("class-imbalance-pipeline", "Дисбаланс классов и Pipeline"),
    ("ml-math-vectors-gradients", "Вектор, матрица и градиент"),
    ("ml-probability-loss-bayes", "Вероятность и функция потерь"),
    ("ml-overfit-learning-curves", "Недообучение и переобучение"),
    ("ml-split-strategy-lab", "Разбиение с учётом групп и времени"),
    ("ml-cross-validation-oof", "Внефолдовые прогнозы"),
    ("ml-hyperparameter-nested-search", "Вложенный подбор параметров"),
    ("ml-preprocessing-feature-selection", "Преобразование и отбор признаков"),
    ("ml-uncertainty-calibration-utility", "Калибровка вероятностей"),
    ("ml-interpretability-error-fairness", "Анализ ошибок по группам"),
    ("linear-regression", "Линейная регрессия и остатки"),
    ("regularization-l1-l2", "Как регуляризация меняет коэффициенты"),
    ("logistic-regression", "Логистическая регрессия"),
    ("decision-trees", "Дерево решений"),
    ("bagging-random-forest", "Бэггинг и случайный лес"),
    ("gradient-boosting", "Последовательные поправки бустинга"),
    ("support-vector-machines", "Опорные векторы и зазор"),
    ("kmeans-clustering", "KMeans и центроиды"),
    ("research-uncertainty", "Неопределённость оценки"),
    ("research-tests-effects", "Размер эффекта и разброс"),
    ("research-multiple-testing", "Множественные проверки и FDR"),
    ("research-design-power", "Мощность исследования"),
    ("biomedical-cohort-target", "Когорта и временная точка прогноза"),
    ("biomedical-leakage-pipeline", "Безопасный биомедицинский Pipeline"),
    ("biomedical-evaluation", "Порог решения и клиническая цена ошибок"),
    ("biomedical-validation-reproducibility", "Внешняя проверка и воспроизводимость"),
    ("genomics-files-qc", "От образца к геномному файлу"),
    ("genomics-rnaseq-expression", "Экспрессия генов"),
    ("genomics-variants-annotation", "Вариант и его аннотация"),
    ("genomics-cancer-public-data", "Слои данных рака"),
    ("proteins-sequence-databases", "Белковая последовательность"),
    ("proteins-alignment-homology", "Выравнивание и гомология"),
    ("proteins-structure-confidence", "Уверенность структуры белка"),
    ("proteins-embeddings-deep-learning", "Белковое представление"),
    ("nlp-data-labels-tokenization", "Текст, токены и метки"),
    ("nlp-tfidf-classical-models", "Матрица TF-IDF"),
    ("nlp-split-leakage-evaluation", "Разбиение текстов без утечки"),
    ("nlp-embeddings-representations", "Векторное представление слов"),
    ("nlp-neural-transformers", "Механизм внимания"),
    ("nlp-biomedical-ner-relations", "Сущности и связи в биомедицинском тексте"),
    ("nlp-llm-rag-evidence", "Поиск источников и проверяемый ответ"),
    ("nlp-capstone-evidence-pipeline", "Воспроизводимый NLP-эксперимент"),
    ("capstone-protocol", "Протокол до эксперимента"),
    ("capstone-experiment-system", "Реестр экспериментов"),
    ("capstone-figures-results", "От результата к рисунку"),
    ("capstone-paper-package", "Воспроизводимый пакет статьи"),
    ("capstone-literature-gap", "Поиск исследовательского пробела"),
    ("capstone-ethics-sap-sample-size", "Этика, план анализа и выборка"),
    ("capstone-methods-discussion-supplement", "Структура научной статьи"),
    ("capstone-journal-submission-review", "Подача и ответ рецензентам"),
]

EXTRA_TOPICS = {
    "matplotlib-basics", "matplotlib-lines-scatter", "matplotlib-distributions", "matplotlib-layout-export", "eda-correlation",
    "ml-foundations-data-target", "ml-foundations-model-fit-predict",
    "ml-problem-types", "validation-split", "cross-validation-search", "metrics-confusion-matrix",
    "linear-regression", "regularization-l1-l2", "logistic-regression", "decision-trees",
    "bagging-random-forest", "gradient-boosting", "support-vector-machines", "kmeans-clustering",
}


def canvas(title: str, subtitle: str = ""):
    fig, ax = plt.subplots(figsize=(12, 6.4), dpi=150)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    fig.subplots_adjust(left=0.075, right=0.965, top=0.82, bottom=0.13)
    fig.suptitle(title, x=0.075, y=0.96, ha="left", fontsize=20, fontweight="bold", color=INK)
    if subtitle:
        fig.text(0.075, 0.89, subtitle, ha="left", fontsize=11, color=MUTED)
    return fig, ax


def save_png(fig, path: Path):
    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", facecolor="white", bbox_inches="tight", pad_inches=0.25)
    image_bytes = buffer.getvalue()
    if len(image_bytes) < 10_000:
        raise RuntimeError(f"Generated PNG is unexpectedly small: {path} ({len(image_bytes)} bytes)")
    temporary_path = path.with_name(f".{path.stem}.tmp.png")
    temporary_path.write_bytes(image_bytes)
    temporary_path.replace(path)


def finish(fig, ax, topic_id: str, suffix: str = ""):
    ax.spines[["top", "right"]].set_visible(False)
    save_png(fig, OUT / f"{topic_id}{suffix}.png")
    plt.close(fig)


def label_box(ax, x, y, w, h, text, color=BLUE, text_color=INK, size=11):
    patch = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.025", facecolor=color, edgecolor="white", linewidth=1.4)
    ax.add_patch(patch)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=size, color=text_color, fontweight="bold")


def arrow(ax, start, end, color=GREEN_DARK):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle="-|>", mutation_scale=18, linewidth=2, color=color))


def generic_pipeline(topic_id: str, title: str):
    fig, ax = canvas(title, "Схема показывает порядок действий и места контрольных проверок.")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    families = {
        "python": ["вход", "операция", "результат", "проверка"],
        "numpy": ["массив", "форма", "операция", "новый массив"],
        "pandas": ["таблица", "выбор", "преобразование", "проверка"],
        "research": ["вопрос", "дизайн", "оценка", "вывод"],
        "biomedical": ["когорта", "разбиение", "модель", "валидация"],
        "genomics": ["образец", "QC", "признаки", "анализ"],
        "proteins": ["последовательность", "представление", "модель", "проверка"],
        "nlp": ["текст", "разметка", "признаки", "оценка"],
        "capstone": ["протокол", "эксперимент", "результат", "публикация"],
        "ml": ["данные", "обучение", "прогноз", "метрика"],
    }
    prefix = next((key for key in families if topic_id.startswith(key)), "ml")
    labels = families[prefix]
    colors = ["#e8f1fb", "#e8f6e8", "#fff4cf", "#fde8e4"]
    for i, (text, color) in enumerate(zip(labels, colors)):
        x = 0.04 + i * 0.24
        label_box(ax, x, 0.37, 0.17, 0.22, text, color=color)
        if i < 3:
            arrow(ax, (x + 0.18, 0.48), (x + 0.235, 0.48))
    ax.text(0.5, 0.2, "Каждый переход должен быть понятен и воспроизводим", ha="center", fontsize=13, color=MUTED)
    finish(fig, ax, topic_id)


def data_target_visual(topic_id: str, title: str, suffix: str = ""):
    """Render the two topic 4.1 diagrams from the shared synthetic churn data."""
    if suffix:
        fig, ax = plt.subplots(figsize=(15, 7.2), dpi=150)
        fig.patch.set_facecolor("white")
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")
        fig.suptitle("Момент прогноза отделяет признаки от будущего", x=.055, y=.96,
                     ha="left", fontsize=20, fontweight="bold", color=INK)
        fig.text(.055, .89, "Синтетический прогноз оттока: сведения слева доступны до решения, события справа возникают позже.",
                 ha="left", fontsize=11, color=MUTED)

        ax.annotate("", xy=(.94, .23), xytext=(.06, .23),
                    arrowprops={"arrowstyle": "-|>", "color": INK, "lw": 2.5})
        ax.text(.06, .17, "раньше", color=MUTED, fontsize=11)
        ax.text(.90, .17, "позже", color=MUTED, fontsize=11)
        ax.axvline(.58, ymin=.15, ymax=.86, color=INK, linewidth=3)
        ax.text(.58, .91, "CUTOFF\nмомент решения", ha="center", va="center",
                fontsize=13, fontweight="bold", color=INK)

        before = [
            ("days_since_login", "2 / 18 / 5 / 31 / 9 / 24"),
            ("tariff", "pro / basic"),
            ("support_tickets", "0 / 2 / 1 / 4 / 0 / 3"),
        ]
        for index, (name, values) in enumerate(before):
            y = .72 - index * .20
            ax.add_patch(FancyBboxPatch((.07, y), .40, .13, boxstyle="round,pad=0.018",
                                        facecolor="#e8f6e8", edgecolor=GREEN_DARK, linewidth=1.8))
            ax.text(.09, y + .087, name, ha="left", fontsize=11, fontweight="bold", color=INK)
            ax.text(.09, y + .035, values, ha="left", fontsize=10, color=MUTED)
            ax.text(.44, y + .065, "ДОСТУПНО", ha="right", va="center", fontsize=9,
                    fontweight="bold", color=GREEN_DARK)

        after = [
            ("churn_after_30d", "target: да / нет"),
            ("account_closed_at", "дата закрытия аккаунта"),
        ]
        for index, (name, meaning) in enumerate(after):
            y = .66 - index * .25
            ax.add_patch(FancyBboxPatch((.67, y), .26, .15, boxstyle="round,pad=0.018",
                                        facecolor="#fde8e4", edgecolor=CORAL, linewidth=1.8))
            ax.text(.69, y + .10, name, ha="left", fontsize=11, fontweight="bold", color=INK)
            ax.text(.69, y + .05, meaning, ha="left", fontsize=10, color=MUTED)
            ax.text(.90, y + .02, "НЕ ВКЛЮЧАТЬ В X", ha="right", fontsize=8.5,
                    fontweight="bold", color=CORAL)

        ax.text(.5, .04,
                "Вывод: столбец из архива допустим только тогда, когда он был доступен тем же способом к cutoff.",
                ha="center", fontsize=12, fontweight="bold", color=INK)
        save_png(fig, OUT / f"{topic_id}{suffix}.png")
        plt.close(fig)
        return

    fig, (table_ax, split_ax) = plt.subplots(
        1, 2, figsize=(15, 7.4), dpi=150, gridspec_kw={"width_ratios": [1.75, 1]},
    )
    fig.patch.set_facecolor("white")
    fig.subplots_adjust(left=.04, right=.97, top=.80, bottom=.10, wspace=.08)
    fig.suptitle("Одна таблица разделяется на признаки X и ответ y", x=.045, y=.96,
                 ha="left", fontsize=20, fontweight="bold", color=INK)
    fig.text(.045, .89, "Синтетические данные: одна строка — один клиент на дату решения; шесть строк сохраняются в обеих частях.",
             ha="left", fontsize=11, color=MUTED)

    table_ax.axis("off")
    columns = [
        "client_id\n[ID]", "household_group\n[GROUP]", "days_since_login\n[FEATURE]",
        "tariff\n[FEATURE]", "support_tickets\n[FEATURE]", "churn_after_30d\n[TARGET]",
    ]
    rows = [
        ["C101", "H1", "2", "pro", "0", "нет"],
        ["C102", "H1", "18", "basic", "2", "да"],
        ["C103", "H2", "5", "pro", "1", "нет"],
        ["C104", "H2", "31", "basic", "4", "да"],
        ["C105", "H3", "9", "basic", "0", "нет"],
        ["C106", "H3", "24", "pro", "3", "да"],
    ]
    table = table_ax.table(cellText=rows, colLabels=columns, cellLoc="center", loc="center")
    table.auto_set_font_size(False)
    table.set_fontsize(9.5)
    table.scale(1, 2.25)
    for (row, column), cell in table.get_celld().items():
        cell.set_edgecolor("white")
        if row == 0:
            role_colors = [BLUE_DARK, MUTED, GREEN_DARK, GREEN_DARK, GREEN_DARK, CORAL]
            cell.set_facecolor(role_colors[column])
            cell.set_text_props(color="white", fontweight="bold")
        else:
            cell.set_facecolor("#edf5fb" if row % 2 else "#f5f7f8")
            if column == 5:
                cell.set_text_props(fontweight="bold")
    table_ax.text(.5, .09, "Исходная DataFrame: 6 строк × 6 столбцов с разными ролями",
                  transform=table_ax.transAxes, ha="center", fontsize=11, color=MUTED)

    split_ax.set_xlim(0, 1)
    split_ax.set_ylim(0, 1)
    split_ax.axis("off")
    split_ax.text(.04, .50, "РАЗДЕЛИТЬ\nПО РОЛИ", ha="center", va="center",
                  fontsize=10, fontweight="bold", color=INK)
    arrow(split_ax, (.12, .50), (.28, .66))
    arrow(split_ax, (.12, .50), (.28, .31))
    split_ax.add_patch(FancyBboxPatch((.31, .52), .62, .30, boxstyle="round,pad=0.025",
                                      facecolor="#e8f6e8", edgecolor=GREEN_DARK, linewidth=2))
    split_ax.text(.62, .75, "X — признаки", ha="center", fontsize=14, fontweight="bold", color=INK)
    split_ax.text(.62, .66, "days_since_login\ntariff\nsupport_tickets", ha="center", va="center", fontsize=11, color=INK)
    split_ax.text(.62, .55, "shape = (6, 3)", ha="center", fontsize=11, fontweight="bold", color=GREEN_DARK)
    split_ax.add_patch(FancyBboxPatch((.31, .17), .62, .23, boxstyle="round,pad=0.025",
                                      facecolor="#fde8e4", edgecolor=CORAL, linewidth=2))
    split_ax.text(.62, .33, "y — target", ha="center", fontsize=14, fontweight="bold", color=INK)
    split_ax.text(.62, .265, "churn_after_30d", ha="center", fontsize=11, color=INK)
    split_ax.text(.62, .20, "shape = (6,)", ha="center", fontsize=11, fontweight="bold", color=CORAL)
    split_ax.text(.62, .06, "ID и GROUP не входят в X", ha="center", fontsize=11,
                  fontweight="bold", color=INK)
    save_png(fig, OUT / f"{topic_id}.png")
    plt.close(fig)


def model_fit_predict_visual(topic_id: str, title: str, suffix: str = ""):
    """Render reproducible topic 4.2 diagrams using the same six-row dataset."""
    fig, ax = plt.subplots(figsize=(15, 7.2), dpi=150)
    fig.patch.set_facecolor("white")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")

    if suffix:
        fig.suptitle("Объект-оцениватель до fit и модель после fit", x=.055, y=.96,
                     ha="left", fontsize=20, fontweight="bold", color=INK)
        fig.text(.055, .89, "Пример простой сравнительной модели на синтетических клиентах C101–C105.",
                 ha="left", fontsize=11, color=MUTED)
        panels = [
            (.06, "ДО FIT: объект-оцениватель", "настройка:\nstrategy = most_frequent\n\nclasses_ отсутствует\nclass_prior_ отсутствует", "#e8f1fb", BLUE_DARK),
            (.62, "ПОСЛЕ FIT: обученная модель", "classes_ = [да, нет]\nclass_prior_ = [2/5, 3/5]\n\nобученное правило:\nвозвращать класс «нет»", "#e8f6e8", GREEN_DARK),
        ]
        for x, heading, body, fill, edge in panels:
            ax.add_patch(FancyBboxPatch((x, .23), .32, .52, boxstyle="round,pad=0.03",
                                        facecolor=fill, edgecolor=edge, linewidth=2.2))
            ax.text(x + .16, .67, heading, ha="center", fontsize=14, fontweight="bold", color=INK)
            ax.text(x + .16, .47, body, ha="center", va="center", fontsize=11.5,
                    linespacing=1.45, color=INK)
        arrow(ax, (.40, .50), (.60, .50))
        ax.text(.50, .57, "fit(X_train, y_train)", ha="center", fontsize=11,
                fontweight="bold", color=GREEN_DARK)
        ax.text(.50, .42, "состояние изменяется", ha="center", fontsize=10, color=MUTED)
        ax.text(.50, .10, "Вывод: настройка задана заранее, доли классов и правило получены из пяти обучающих ответов.",
                ha="center", fontsize=12, fontweight="bold", color=INK)
        save_png(fig, OUT / f"{topic_id}{suffix}.png")
        plt.close(fig)
        return

    fig.suptitle("Обучение и применение — две разные ветви", x=.055, y=.96,
                 ha="left", fontsize=20, fontweight="bold", color=INK)
    fig.text(.055, .89, "Target участвует только в training path; обычный predict не меняет обученные параметры.",
             ha="left", fontsize=11, color=MUTED)

    ax.text(.055, .72, "TRAINING PATH — ОБУЧЕНИЕ", fontsize=12, fontweight="bold", color=GREEN_DARK)
    training = [
        (.06, "X_train\nC101–C105\nshape (5, 3)", "#e8f1fb"),
        (.27, "+ y_train\n[нет, да, нет, да, нет]\nshape (5,)", "#fde8e4"),
        (.51, "fit\nоценивает состояние", "#fff4cf"),
        (.73, "fitted model\nкласс «нет» чаще:\n3 из 5", "#e8f6e8"),
    ]
    for index, (x, text_value, color) in enumerate(training):
        label_box(ax, x, .54, .17, .14, text_value, color=color, size=9.5)
        if index < len(training) - 1:
            arrow(ax, (x + .175, .61), (training[index + 1][0] - .01, .61))

    ax.text(.055, .36, "INFERENCE PATH — ПРИМЕНЕНИЕ", fontsize=12, fontweight="bold", color=BLUE_DARK)
    inference = [
        (.06, "X_new\nC106: [24, pro, 3]\nshape (1, 3)", "#e8f1fb"),
        (.35, "predict\nтолько применяет", "#fff4cf"),
        (.64, "y_pred = [нет]\nshape (1,)", "#e8f6e8"),
    ]
    for index, (x, text_value, color) in enumerate(inference):
        label_box(ax, x, .18, .22, .14, text_value, color=color, size=10)
        if index < len(inference) - 1:
            arrow(ax, (x + .225, .25), (inference[index + 1][0] - .01, .25), color=BLUE_DARK)
    ax.text(.91, .25, "y не входит\nв predict", ha="center", va="center",
            fontsize=10, fontweight="bold", color=CORAL)
    ax.text(.50, .06, "Параметры fitted model при обычном predict остаются неизменными.",
            ha="center", fontsize=12, fontweight="bold", color=INK)
    save_png(fig, OUT / f"{topic_id}.png")
    plt.close(fig)


def array_visual(topic_id: str, title: str):
    fig, ax = canvas(title, "Цветом выделена часть массива, к которой применяется операция.")
    ax.set_xlim(-0.8, 7.4)
    ax.set_ylim(-0.8, 4.2)
    ax.axis("off")
    values = np.arange(1, 13).reshape(3, 4)
    highlight = {
        "numpy-indexing-slices": {(1, 1), (1, 2), (2, 1), (2, 2)},
        "numpy-2d-axis": {(0, 0), (1, 0), (2, 0)},
        "numpy-masks-where": {(0, 3), (1, 2), (1, 3), (2, 1), (2, 2), (2, 3)},
    }.get(topic_id, {(0, 0), (0, 1), (0, 2), (0, 3)})
    for r in range(3):
        for c in range(4):
            color = "#cfe9d0" if (r, c) in highlight else "#e8f1fb"
            ax.add_patch(Rectangle((c, 2-r), 0.9, 0.9, facecolor=color, edgecolor="white", linewidth=2))
            ax.text(c + 0.45, 2.45-r, str(values[r, c]), ha="center", va="center", fontsize=14, color=INK)
    arrow(ax, (4.15, 1.45), (4.95, 1.45))
    label_box(ax, 5.1, 0.75, 1.75, 1.4, "результат\nоперации", color="#f5f7f8", size=12)
    finish(fig, ax, topic_id)


def dataframe_visual(topic_id: str, title: str):
    fig, ax = canvas(title, "Таблица сохраняет связь между строками, столбцами и типами данных.")
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    ax.axis("off")
    headers = ["пациент", "возраст", "маркер", "исход"]
    rows = [["A", "48", "2.1", "0"], ["B", "62", "—", "1"], ["C", "55", "4.8", "1"]]
    for c, text in enumerate(headers):
        ax.add_patch(Rectangle((0.4 + c*1.5, 3.4), 1.45, 0.65, facecolor=BLUE_DARK, edgecolor="white"))
        ax.text(1.125 + c*1.5, 3.73, text, color="white", ha="center", va="center", fontsize=10, fontweight="bold")
    for r, row in enumerate(rows):
        for c, text in enumerate(row):
            selected = (topic_id == "pandas-selection" and c in (1, 2)) or (topic_id == "pandas-filtering-sorting" and r == 1) or (topic_id == "pandas-missing-duplicates" and text == "—")
            color = "#fff4cf" if selected else ("#f5f7f8" if r % 2 else "#edf5fb")
            ax.add_patch(Rectangle((0.4 + c*1.5, 2.72-r*0.68), 1.45, 0.65, facecolor=color, edgecolor="white"))
            ax.text(1.125 + c*1.5, 3.045-r*0.68, text, color=INK, ha="center", va="center", fontsize=11)
    arrow(ax, (6.65, 2.7), (7.35, 2.7))
    label_box(ax, 7.55, 1.9, 1.9, 1.55, "проверенная\nтаблица", color="#e8f6e8", size=12)
    finish(fig, ax, topic_id)


def matplotlib_visual(topic_id: str, title: str, suffix: str = ""):
    rng = np.random.default_rng(7)
    fig, ax = canvas(title, "График построен реальным кодом Matplotlib на воспроизводимых данных.")
    if topic_id == "matplotlib-lines-scatter":
        x = np.linspace(0, 10, 35)
        y = 1.8*x + rng.normal(0, 2.4, len(x))
        if suffix:
            ax.scatter(x, y, color=BLUE, alpha=0.8, label="наблюдения")
            ax.plot(x, 1.8*x, color=CORAL, linewidth=2.5, label="общая связь")
        else:
            ax.plot(x, np.sin(x/1.5), color=GREEN_DARK, linewidth=2.5, marker="o", markevery=5)
            ax.set_ylabel("значение")
    elif topic_id == "matplotlib-distributions":
        data = rng.normal(65, 11, 350)
        if suffix:
            ax.boxplot([data, rng.normal(74, 8, 250)], tick_labels=["группа A", "группа B"], patch_artist=True, boxprops={"facecolor":"#cfe0f5"})
        else:
            ax.hist(data, bins=18, color=BLUE, edgecolor="white")
            ax.axvline(np.mean(data), color=CORAL, linewidth=2, label="среднее")
    elif topic_id == "eda-correlation":
        data = rng.normal(size=(250, 4))
        data[:, 1] = 0.8*data[:, 0] + rng.normal(0, 0.5, 250)
        data[:, 3] = -0.6*data[:, 2] + rng.normal(0, 0.7, 250)
        if suffix:
            ax.scatter(data[:, 0], data[:, 1], color=BLUE, alpha=.55, s=24, label="положительная связь")
            ax.scatter(data[:, 2], data[:, 3], color=CORAL, alpha=.55, s=24, label="отрицательная связь")
            ax.axhline(0, color=GRID, linewidth=1)
            ax.axvline(0, color=GRID, linewidth=1)
            ax.set_xlabel("значение первого признака")
            ax.set_ylabel("значение второго признака")
        else:
            corr = np.corrcoef(data, rowvar=False)
            image = ax.imshow(corr, cmap="RdBu_r", vmin=-1, vmax=1)
            fig.colorbar(image, ax=ax, fraction=0.04, label="коэффициент корреляции")
            ax.set_xticks(range(4), ["возраст", "давление", "маркер A", "маркер B"])
            ax.set_yticks(range(4), ["возраст", "давление", "маркер A", "маркер B"])
            for i in range(4):
                for j in range(4):
                    ax.text(j, i, f"{corr[i,j]:.2f}", ha="center", va="center", color="white" if abs(corr[i,j]) > .55 else INK)
    elif topic_id == "matplotlib-layout-export":
        ax.axis("off")
        rows, columns = (2, 2) if suffix else (1, 2)
        inner = fig.add_gridspec(rows, columns, left=.09, right=.96, top=.8, bottom=.15, wspace=.24, hspace=.36)
        inner_axes = [fig.add_subplot(inner[row, column]) for row in range(rows) for column in range(columns)]
        x = np.linspace(0, 8, 80)
        inner_axes[0].plot(x, np.sin(x), color=GREEN_DARK); inner_axes[0].set_title("динамика")
        inner_axes[1].hist(rng.normal(size=300), bins=16, color=BLUE); inner_axes[1].set_title("распределение")
        if suffix:
            inner_axes[2].scatter(x[::4], np.cos(x[::4]), color=CORAL); inner_axes[2].set_title("связь")
            inner_axes[3].bar(["A", "B", "C"], [4, 7, 5], color=[BLUE, GREEN, CORAL]); inner_axes[3].set_title("категории")
        for item in inner_axes: item.spines[["top", "right"]].set_visible(False)
    else:
        x = np.linspace(0, 8, 60)
        if suffix:
            ax.scatter(x, np.sin(x) + rng.normal(0, .12, len(x)), color=BLUE, alpha=.75, label="наблюдения")
            ax.axhline(0, color=GRID, linewidth=1)
        else:
            ax.plot(x, np.sin(x), color=GREEN_DARK, linewidth=2.5, label="линия")
            ax.scatter(x[::6], np.sin(x[::6]), color=CORAL, zorder=3, label="точки")
        ax.set_xlabel("ось X"); ax.set_ylabel("ось Y")
    if ax.axison:
        ax.grid(alpha=.2)
        handles, labels = ax.get_legend_handles_labels()
        if handles: ax.legend(frameon=False)
    finish(fig, ax, topic_id, suffix)


def model_problem_types(topic_id: str, title: str, suffix: str = ""):
    if suffix:
        fig, ax = canvas(title, "Постановка определяется формой ответа, который нужен для нового объекта.")
        ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
        label_box(ax, .04, .40, .20, .18, "новый\nобъект", "#e8eef4")
        arrow(ax, (.25, .49), (.38, .49))
        label_box(ax, .39, .40, .22, .18, "обученная\nмодель", "#d7ecd8")
        arrow(ax, (.62, .49), (.74, .49))
        outputs = [("класс", .73, CORAL), ("число", .46, BLUE), ("кластер", .19, YELLOW)]
        for text, y, color in outputs:
            label_box(ax, .76, y, .18, .14, text, color)
            ax.plot([.68, .76], [.49, y + .07], color=GREEN_DARK, linewidth=1.8)
        finish(fig, ax, topic_id, suffix)
        return
    fig = plt.figure(figsize=(12, 6.4), dpi=150, facecolor="white")
    fig.suptitle(title, x=.06, y=.96, ha="left", fontsize=20, fontweight="bold", color=INK)
    gs = fig.add_gridspec(1, 3, left=.06, right=.96, top=.83, bottom=.13, wspace=.24)
    rng = np.random.default_rng(12)
    axes = [fig.add_subplot(gs[0, i]) for i in range(3)]
    x = np.linspace(0, 10, 35); y = 2.2*x + rng.normal(0, 3, len(x))
    axes[0].scatter(x, y, color=BLUE, s=24); axes[0].plot(x, 2.2*x, color=CORAL, lw=2); axes[0].set_title("Регрессия\nчисло", fontweight="bold")
    Xc, yc = make_moons(n_samples=180, noise=.16, random_state=4)
    axes[1].scatter(Xc[:,0], Xc[:,1], c=np.where(yc, CORAL, BLUE), s=20); axes[1].set_title("Классификация\nкласс", fontweight="bold")
    Xb, _ = make_blobs(n_samples=180, centers=3, random_state=5, cluster_std=.8)
    km = KMeans(n_clusters=3, n_init=10, random_state=5).fit(Xb)
    axes[2].scatter(Xb[:,0], Xb[:,1], c=km.labels_, cmap="Set2", s=20); axes[2].scatter(km.cluster_centers_[:,0], km.cluster_centers_[:,1], marker="X", s=120, c=INK); axes[2].set_title("Кластеризация\nгруппа без готового ответа", fontweight="bold")
    for ax in axes: ax.spines[["top","right"]].set_visible(False); ax.set_xticks([]); ax.set_yticks([])
    save_png(fig, OUT / f"{topic_id}{suffix}.png"); plt.close(fig)


def split_visual(topic_id: str, title: str, suffix: str = ""):
    fig, ax = canvas(title, "Каждый прямоугольник — один объект; цвет обозначает его роль.")
    ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    if topic_id == "cross-validation-search" and suffix:
        scores = np.array([.80, .85, .90, .75, .95])
        bars = ax.bar(np.arange(1, 6), scores, width=.62, color=["#cfe9d0", "#e8f1fb", "#fff1bf", "#fbdad5", "#ded7f7"])
        ax.axhline(scores.mean(), color=GREEN_DARK, linewidth=2.4, label=f"среднее = {scores.mean():.2f}")
        ax.set_xlim(.35, 5.65); ax.set_ylim(0, 1.05); ax.set_xlabel("номер фолда"); ax.set_ylabel("метрика")
        ax.set_xticks(np.arange(1, 6)); ax.legend(frameon=False)
        ax.bar_label(bars, fmt="%.2f", padding=3, color=INK)
    elif topic_id == "cross-validation-search" or suffix:
        colors = ["#cfe9d0", "#e8f1fb", "#fff1bf", "#fbdad5", "#ded7f7"]
        for fold in range(5):
            y = .73 - fold*.135
            for part in range(5):
                ax.add_patch(Rectangle((.12+part*.145, y), .13, .09, facecolor=colors[part] if part==fold else "#e8f6e8", edgecolor="white"))
            ax.text(.03, y+.045, f"шаг {fold+1}", va="center", fontsize=10, color=MUTED)
        ax.text(.5, .09, "каждая часть один раз становится проверочной", ha="center", fontsize=12, color=INK)
    else:
        parts = [("обучение", .62, "#cfe9d0"), ("проверка", .19, "#fff1bf"), ("тест", .19, "#fbdad5")]
        x=.06
        for label, width, color in parts:
            ax.add_patch(Rectangle((x,.38), width*.86,.24,facecolor=color,edgecolor="white"))
            ax.text(x+width*.43,.5,label,ha="center",va="center",fontweight="bold",color=INK)
            x += width*.86
        ax.text(.32,.27,"модель учится",ha="center",color=GREEN_DARK)
        ax.text(.82,.27,"не использовать при выборе",ha="center",color=CORAL)
    finish(fig, ax, topic_id, suffix)


def confusion_visual(topic_id: str, title: str, suffix: str = ""):
    y_true = np.array([0]*70+[1]*30)
    y_pred = np.array([0]*61+[1]*9+[0]*6+[1]*24)
    cm = confusion_matrix(y_true, y_pred)
    fig, ax = canvas(title, "Четыре клетки показывают правильные решения и два вида ошибок.")
    if suffix:
        tp, fp, fn = 24, 9, 6
        values = [tp / (tp + fp), tp / (tp + fn)]
        bars = ax.bar(["precision", "recall"], values, color=[BLUE, GREEN], width=.55)
        ax.set_ylim(0, 1); ax.set_ylabel("значение метрики")
        ax.bar_label(bars, labels=[f"{value:.2f}" for value in values], padding=4, fontsize=14, color=INK)
        ax.text(.5, .16, "Одна матрица ошибок → разные вопросы к модели", transform=ax.transAxes, ha="center", color=MUTED)
        ax.grid(axis="y", alpha=.18)
        finish(fig, ax, topic_id, suffix)
        return
    image = ax.imshow(cm, cmap="Blues")
    for i in range(2):
        for j in range(2): ax.text(j, i, str(cm[i,j]), ha="center", va="center", fontsize=24, fontweight="bold", color="white" if cm[i,j]>35 else INK)
    ax.set_xticks([0,1],["прогноз 0","прогноз 1"]); ax.set_yticks([0,1],["истина 0","истина 1"])
    ax.set_xlabel("прогноз модели"); ax.set_ylabel("правильный ответ")
    ax.text(1,0,"ложная тревога",ha="center",va="bottom",color=CORAL,transform=ax.transData)
    ax.text(0,1,"пропуск",ha="center",va="top",color=CORAL,transform=ax.transData)
    fig.colorbar(image, ax=ax, fraction=.04)
    finish(fig, ax, topic_id, suffix)


def linear_visual(topic_id: str, title: str, suffix: str = ""):
    rng = np.random.default_rng(42)
    X = np.linspace(0, 10, 28)[:, None]
    y = 3 + 2.4*X[:,0] + rng.normal(0, 2.2, len(X))
    model = LinearRegression().fit(X, y)
    pred = model.predict(X)
    if suffix:
        fig, ax = canvas(title, "Чем ближе точка к диагонали, тем точнее прогноз на этом объекте.")
        ax.scatter(y, pred, color=BLUE, s=44, alpha=.82)
        limits = [min(y.min(), pred.min()), max(y.max(), pred.max())]
        ax.plot(limits, limits, color=CORAL, lw=2.5, label="идеальный прогноз")
        ax.set_xlabel("правильный ответ y"); ax.set_ylabel("прогноз модели ŷ")
    else:
        fig, ax = canvas(title, "Модель обучена на синтетических точках; отрезки показывают реальные остатки.")
        ax.scatter(X[:,0], y, color=BLUE, label="наблюдения", zorder=3)
        ax.plot(X[:,0], pred, color=CORAL, lw=2.5, label="прямая модели")
        for x, actual, forecast in zip(X[::3,0], y[::3], pred[::3]): ax.plot([x,x],[forecast,actual],color=GREEN_DARK,alpha=.65,lw=1.5)
        ax.set_xlabel("признак x"); ax.set_ylabel("целевое значение y")
    ax.grid(alpha=.18); ax.legend(frameon=False)
    finish(fig, ax, topic_id, suffix)


def regularization_visual(topic_id: str, title: str, suffix: str = ""):
    X, y, true_coef = make_regression(n_samples=110, n_features=10, n_informative=6, noise=18, coef=True, random_state=2)
    X = StandardScaler().fit_transform(X)
    alphas = np.logspace(-3, 3, 45)
    paths = np.array([Ridge(alpha=a).fit(X,y).coef_ for a in alphas])
    if suffix:
        fig, ax = canvas(title, "Сильный L2-штраф уменьшает модули коэффициентов, но обычно не обнуляет их.")
        order = np.arange(paths.shape[1])
        ax.bar(order - .18, np.abs(paths[4]), width=.36, color=BLUE, label="слабый штраф")
        ax.bar(order + .18, np.abs(paths[-5]), width=.36, color=GREEN, label="сильный штраф")
        ax.set_xlabel("номер признака"); ax.set_ylabel("модуль коэффициента"); ax.legend(frameon=False); ax.grid(axis="y", alpha=.18)
    else:
        fig, ax = canvas(title, "Каждая линия — коэффициент одного признака; справа штраф сильнее.")
        for i in range(paths.shape[1]): ax.plot(alphas, paths[:,i], lw=1.8, alpha=.85)
        ax.set_xscale("log"); ax.axhline(0,color=GRID,lw=1); ax.set_xlabel("сила регуляризации α"); ax.set_ylabel("значение коэффициента"); ax.grid(alpha=.18)
    finish(fig, ax, topic_id, suffix)


def logistic_visual(topic_id: str, title: str, suffix: str = ""):
    rng=np.random.default_rng(5)
    if suffix:
        X, y = make_classification(n_samples=220, n_features=2, n_redundant=0, n_clusters_per_class=1, class_sep=1.15, random_state=5)
        model = LogisticRegression().fit(X, y)
        xx, yy = np.meshgrid(np.linspace(X[:,0].min()-.8, X[:,0].max()+.8, 260), np.linspace(X[:,1].min()-.8, X[:,1].max()+.8, 260))
        probability = model.predict_proba(np.c_[xx.ravel(), yy.ravel()])[:, 1].reshape(xx.shape)
        fig,ax=canvas(title,"Цвет фона — вероятность класса 1; линия соответствует порогу 0.5.")
        image = ax.contourf(xx, yy, probability, levels=np.linspace(0, 1, 11), cmap="RdBu_r", alpha=.68)
        ax.contour(xx, yy, probability, levels=[.5], colors=[INK], linewidths=2)
        ax.scatter(X[:,0], X[:,1], c=np.where(y,CORAL,BLUE), s=25, edgecolor="white", linewidth=.3)
        fig.colorbar(image, ax=ax, fraction=.04, label="вероятность класса 1")
        ax.set_xlabel("признак 1"); ax.set_ylabel("признак 2")
    else:
        x=np.linspace(-5,5,220)[:,None]; p=1/(1+np.exp(-1.25*x[:,0])); y=rng.binomial(1,p)
        model=LogisticRegression().fit(x,y); px=model.predict_proba(x)[:,1]
        fig,ax=canvas(title,"Сигмоида переводит линейный счёт в вероятность от 0 до 1.")
        ax.scatter(x[:,0],y+ rng.normal(0,.025,len(y)),c=np.where(y,CORAL,BLUE),alpha=.38,s=18)
        ax.plot(x[:,0],px,color=GREEN_DARK,lw=3,label="вероятность класса 1"); ax.axhline(.5,color=MUTED,ls="--",label="порог 0.5"); ax.axvline(0,color=GRID,lw=1)
        ax.set_xlabel("линейный счёт z"); ax.set_ylabel("вероятность"); ax.set_ylim(-.08,1.08); ax.grid(alpha=.16); ax.legend(frameon=False)
    finish(fig,ax,topic_id,suffix)


def tree_visual(topic_id: str, title: str, suffix: str = ""):
    X,y=make_moons(n_samples=220,noise=.22,random_state=4); model=DecisionTreeClassifier(max_depth=3,min_samples_leaf=8,random_state=4).fit(X,y)
    if suffix:
        fig,ax=canvas(title,"Каждый узел задаёт вопрос; лист возвращает итоговый класс.")
        plot_tree(model,feature_names=["признак 1","признак 2"],class_names=["синий","коралловый"],filled=True,rounded=True,fontsize=8,ax=ax)
        ax.axis("off")
    else:
        fig,ax=canvas(title,"Цвет фона — решение дерева, точки — обучающие объекты.")
        xx,yy=np.meshgrid(np.linspace(X[:,0].min()-.5,X[:,0].max()+.5,300),np.linspace(X[:,1].min()-.5,X[:,1].max()+.5,300)); zz=model.predict(np.c_[xx.ravel(),yy.ravel()]).reshape(xx.shape)
        ax.contourf(xx,yy,zz,levels=[-.5,.5,1.5],colors=["#dceafb","#fde1dc"],alpha=.9); ax.scatter(X[:,0],X[:,1],c=np.where(y,CORAL,BLUE),s=25,edgecolor="white",linewidth=.3)
    finish(fig,ax,topic_id,suffix)


def ensemble_visual(topic_id: str, title: str, suffix: str = ""):
    X,y=make_moons(n_samples=260,noise=.27,random_state=9)
    if topic_id=="bagging-random-forest":
        if suffix:
            rng = np.random.default_rng(9)
            sample_indices = rng.integers(0, 24, 24)
            counts = np.bincount(sample_indices, minlength=24)
            fig, ax = canvas(title, "Bootstrap повторяет часть объектов; прогнозы деревьев затем агрегируются.")
            ax.bar(np.arange(24), counts, color=np.where(counts == 0, CORAL, BLUE), width=.8)
            ax.axhline(1, color=GREEN_DARK, linewidth=1.8, label="одно появление")
            ax.set_xlabel("номер исходного объекта"); ax.set_ylabel("сколько раз попал в bootstrap")
            ax.set_yticks(range(int(counts.max()) + 1)); ax.legend(frameon=False); ax.grid(axis="y", alpha=.18)
            finish(fig, ax, topic_id, suffix)
            return
        models=[DecisionTreeClassifier(max_depth=None,random_state=i).fit(X[np.random.default_rng(i).integers(0,len(X),len(X))],y[np.random.default_rng(i).integers(0,len(X),len(X))]) for i in range(4)]
        final=RandomForestClassifier(n_estimators=120,max_features="sqrt",random_state=9).fit(X,y)
        fig,axes=plt.subplots(1,5,figsize=(14,4.6),dpi=150,facecolor="white"); fig.suptitle(title,x=.04,y=.98,ha="left",fontsize=20,fontweight="bold",color=INK)
        xx,yy=np.meshgrid(np.linspace(-1.6,2.6,180),np.linspace(-1.2,1.8,180))
        for i,(ax,model) in enumerate(zip(axes,models+[final])):
            z=model.predict(np.c_[xx.ravel(),yy.ravel()]).reshape(xx.shape); ax.contourf(xx,yy,z,levels=[-.5,.5,1.5],colors=["#dceafb","#fde1dc"]); ax.scatter(X[:,0],X[:,1],c=np.where(y,CORAL,BLUE),s=7,alpha=.5); ax.set_xticks([]);ax.set_yticks([]);ax.set_title("дерево "+str(i+1) if i<4 else "усреднение",fontsize=10,fontweight="bold")
        save_png(fig, OUT/f"{topic_id}{suffix}.png");plt.close(fig)
    else:
        Xr=np.linspace(-3,3,150)[:,None]; yr=np.sin(Xr[:,0])+np.random.default_rng(3).normal(0,.18,len(Xr)); model=GradientBoostingRegressor(n_estimators=3,max_depth=2,learning_rate=.7,random_state=3).fit(Xr,yr)
        if suffix:
            staged = list(model.staged_predict(Xr))
            errors = [np.mean((yr - prediction) ** 2) for prediction in staged]
            fig, ax = canvas(title, "Каждое следующее дерево уменьшает ошибку уже собранного ансамбля.")
            ax.plot(np.arange(1, len(errors) + 1), errors, color=GREEN_DARK, marker="o", linewidth=2.5)
            ax.set_xticks(np.arange(1, len(errors) + 1)); ax.set_xlabel("число деревьев"); ax.set_ylabel("средний квадрат ошибки")
            ax.grid(alpha=.18); finish(fig, ax, topic_id, suffix)
            return
        staged=list(model.staged_predict(Xr)); fig,axes=plt.subplots(1,3,figsize=(12,4.7),dpi=150,facecolor="white");fig.suptitle(title,x=.06,y=.98,ha="left",fontsize=20,fontweight="bold",color=INK)
        for i,ax in enumerate(axes): ax.scatter(Xr[:,0],yr,s=12,color=BLUE,alpha=.5);ax.plot(Xr[:,0],staged[i],color=CORAL,lw=2.5);ax.set_title(f"после дерева {i+1}",fontweight="bold");ax.spines[["top","right"]].set_visible(False);ax.set_ylim(-1.6,1.6)
        save_png(fig, OUT/f"{topic_id}{suffix}.png");plt.close(fig)


def svm_visual(topic_id: str, title: str, suffix: str = ""):
    if suffix:
        X, y = make_moons(n_samples=220, noise=.2, random_state=6); model = SVC(kernel="rbf", gamma="scale", C=2).fit(X, y)
        subtitle = "RBF-ядро строит нелинейную границу; обведённые точки остаются опорными."
    else:
        X,y=make_classification(n_samples=180,n_features=2,n_redundant=0,n_clusters_per_class=1,class_sep=1.5,random_state=6); model=SVC(kernel="linear",C=1).fit(X,y)
        subtitle = "Линии по краям показывают зазор; обведённые точки определяют границу."
    fig,ax=canvas(title,subtitle)
    xx,yy=np.meshgrid(np.linspace(X[:,0].min()-1,X[:,0].max()+1,280),np.linspace(X[:,1].min()-1,X[:,1].max()+1,280)); z=model.decision_function(np.c_[xx.ravel(),yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx,yy,z>0,levels=[-.5,.5,1.5],colors=["#e5effb","#fde5e1"],alpha=.7);ax.contour(xx,yy,z,levels=[-1,0,1],colors=[MUTED,INK,MUTED],linestyles=["--","-","--"])
    ax.scatter(X[:,0],X[:,1],c=np.where(y,CORAL,BLUE),s=26);sv=model.support_vectors_;ax.scatter(sv[:,0],sv[:,1],s=95,facecolors="none",edgecolors=GREEN_DARK,lw=1.8,label="опорные векторы");ax.legend(frameon=False);ax.set_xticks([]);ax.set_yticks([])
    finish(fig,ax,topic_id,suffix)


def kmeans_visual(topic_id: str, title: str, suffix: str = ""):
    X,_=make_blobs(n_samples=260,centers=4,cluster_std=[.65,.9,.75,.7],random_state=10)
    if suffix:
        ks = np.arange(1, 9)
        inertias = [KMeans(n_clusters=int(k), n_init=10, random_state=10).fit(X).inertia_ for k in ks]
        fig,ax=canvas(title,"Кривая inertia помогает увидеть компромисс, но K выбирают и по смыслу задачи.")
        ax.plot(ks, inertias, color=GREEN_DARK, marker="o", linewidth=2.5)
        ax.axvline(4, color=CORAL, linestyle="--", label="K = 4 в синтетических данных")
        ax.set_xlabel("число кластеров K"); ax.set_ylabel("inertia"); ax.grid(alpha=.18); ax.legend(frameon=False)
    else:
        model=KMeans(n_clusters=4,n_init=10,random_state=10).fit(X)
        fig,ax=canvas(title,"Алгоритм чередует назначение точек и пересчёт центров.")
        ax.scatter(X[:,0],X[:,1],c=model.labels_,cmap="Set2",s=25,alpha=.8);c=model.cluster_centers_;ax.scatter(c[:,0],c[:,1],marker="X",s=180,c=INK,edgecolor="white",lw=1.2,label="центроиды");ax.legend(frameon=False);ax.set_xticks([]);ax.set_yticks([])
    finish(fig,ax,topic_id,suffix)


def scientific_visual(topic_id: str, title: str):
    stable_seed = sum((index + 1) * byte for index, byte in enumerate(topic_id.encode("utf-8")))
    rng=np.random.default_rng(stable_seed)
    fig,ax=canvas(title,"Визуальная опора для чтения теории и примеров под ней.")
    if "uncertainty" in topic_id or "tests-effects" in topic_id or "design-power" in topic_id:
        x=np.arange(6);means=rng.normal(0,1,6).cumsum()/3+2;errors=rng.uniform(.15,.55,6);ax.errorbar(x,means,yerr=errors,fmt="o",color=BLUE,ecolor=GREEN_DARK,capsize=5,lw=2);ax.axhline(2,color=GRID);ax.set_xticks(x,[f"группа {i+1}" for i in x]);ax.set_ylabel("оценка ± неопределённость");ax.grid(axis="y",alpha=.2)
    elif "multiple-testing" in topic_id:
        p=np.sort(rng.uniform(0,1,70));ax.scatter(np.arange(len(p)),p,c=np.where(p<.08,CORAL,BLUE),s=24);ax.axhline(.08,color=GREEN_DARK,ls="--",label="порог после контроля FDR");ax.set_xlabel("проверки по возрастанию p");ax.set_ylabel("p-value");ax.legend(frameon=False)
    elif "rnaseq" in topic_id:
        mat=rng.normal(size=(18,10));mat[:5,5:]+=2;im=ax.imshow(mat,cmap="RdBu_r",aspect="auto",vmin=-3,vmax=3);ax.set_xlabel("образцы");ax.set_ylabel("гены");fig.colorbar(im,ax=ax,fraction=.035,label="нормированная экспрессия")
    elif "structure-confidence" in topic_id:
        mat=np.exp(-abs(np.subtract.outer(np.arange(40),np.arange(40)))/8)+rng.normal(0,.04,(40,40));im=ax.imshow(mat,cmap="viridis",vmin=0,vmax=1);ax.set_xlabel("остаток белка");ax.set_ylabel("остаток белка");fig.colorbar(im,ax=ax,fraction=.035,label="уверенность")
    elif "tfidf" in topic_id or "embeddings" in topic_id or "attention" in topic_id or "neural-transformers" in topic_id:
        mat=rng.uniform(0,1,(7,9));mat[mat<.62]=0;im=ax.imshow(mat,cmap="Blues",aspect="auto",vmin=0,vmax=1);ax.set_xlabel("признаки / позиции");ax.set_ylabel("документы / токены");fig.colorbar(im,ax=ax,fraction=.035)
    elif "calibration" in topic_id or "biomedical-evaluation" in topic_id:
        x=np.linspace(.05,.95,10);observed=np.clip(x+rng.normal(0,.07,10),0,1);ax.plot([0,1],[0,1],ls="--",color=MUTED,label="идеально");ax.plot(x,observed,marker="o",color=GREEN_DARK,label="модель");ax.set_xlabel("предсказанная вероятность");ax.set_ylabel("наблюдаемая доля");ax.legend(frameon=False);ax.grid(alpha=.2)
    else:
        plt.close(fig);generic_pipeline(topic_id,title);return
    finish(fig,ax,topic_id)


def generate(topic_id: str, title: str):
    if topic_id == "ml-foundations-data-target":
        data_target_visual(topic_id, title)
    elif topic_id == "ml-foundations-model-fit-predict":
        model_fit_predict_visual(topic_id, title)
    elif topic_id.startswith("numpy-"):
        array_visual(topic_id,title)
    elif topic_id.startswith("pandas-"):
        dataframe_visual(topic_id,title)
    elif topic_id.startswith("matplotlib-") or topic_id=="eda-correlation":
        matplotlib_visual(topic_id,title)
    elif topic_id=="ml-problem-types":
        model_problem_types(topic_id,title)
    elif topic_id in {"validation-split","cross-validation-search","ml-foundations-train-test-baseline-metrics"}:
        split_visual(topic_id,title)
    elif topic_id=="metrics-confusion-matrix":
        confusion_visual(topic_id,title)
    elif topic_id=="linear-regression":
        linear_visual(topic_id,title)
    elif topic_id=="regularization-l1-l2":
        regularization_visual(topic_id,title)
    elif topic_id=="logistic-regression":
        logistic_visual(topic_id,title)
    elif topic_id=="decision-trees":
        tree_visual(topic_id,title)
    elif topic_id in {"bagging-random-forest","gradient-boosting"}:
        ensemble_visual(topic_id,title)
    elif topic_id=="support-vector-machines":
        svm_visual(topic_id,title)
    elif topic_id=="kmeans-clustering":
        kmeans_visual(topic_id,title)
    elif topic_id.startswith(("research-","biomedical-","genomics-","proteins-","nlp-","capstone-")) or "calibration" in topic_id:
        scientific_visual(topic_id,title)
    else:
        generic_pipeline(topic_id,title)

    if topic_id in EXTRA_TOPICS:
        if topic_id == "ml-foundations-data-target": data_target_visual(topic_id,title,"-2")
        elif topic_id == "ml-foundations-model-fit-predict": model_fit_predict_visual(topic_id,title,"-2")
        elif topic_id.startswith("matplotlib-") or topic_id=="eda-correlation": matplotlib_visual(topic_id,title,"-2")
        elif topic_id=="ml-problem-types": model_problem_types(topic_id,title,"-2")
        elif topic_id in {"validation-split","cross-validation-search"}: split_visual(topic_id,title,"-2")
        elif topic_id=="metrics-confusion-matrix": confusion_visual(topic_id,title,"-2")
        elif topic_id=="linear-regression": linear_visual(topic_id,title,"-2")
        elif topic_id=="regularization-l1-l2": regularization_visual(topic_id,title,"-2")
        elif topic_id=="logistic-regression": logistic_visual(topic_id,title,"-2")
        elif topic_id=="decision-trees": tree_visual(topic_id,title,"-2")
        elif topic_id in {"bagging-random-forest","gradient-boosting"}: ensemble_visual(topic_id,title,"-2")
        elif topic_id=="support-vector-machines": svm_visual(topic_id,title,"-2")
        elif topic_id=="kmeans-clustering": kmeans_visual(topic_id,title,"-2")


def main():
    for topic_id, title in TOPICS:
        generate(topic_id,title)
    expected = len(TOPICS) + len(EXTRA_TOPICS)
    actual = len(list(OUT.glob("*.png")))
    required_assets = [
        OUT / "ml-foundations-data-target.png",
        OUT / "ml-foundations-data-target-2.png",
        OUT / "ml-foundations-model-fit-predict.png",
        OUT / "ml-foundations-model-fit-predict-2.png",
    ]
    for asset in required_assets:
        if not asset.is_file():
            raise RuntimeError(f"Required generated asset is missing: {asset}")
        image = plt.imread(asset)
        height, width = image.shape[:2]
        if asset.stat().st_size < 10_000 or width < 1_000 or height < 600:
            raise RuntimeError(
                f"Generated asset failed validation: {asset} "
                f"({width}x{height}, {asset.stat().st_size} bytes)"
            )
        print(
            f"Validated {asset.relative_to(ROOT)}: {width}x{height}, "
            f"source=scripts/generate-course-visuals.py"
        )
    if actual < expected:
        raise RuntimeError(f"Generated {actual} PNG files; expected at least {expected}.")
    print(f"Generated and validated {actual} PNG files; expected at least {expected}.")


if __name__ == "__main__":
    main()
