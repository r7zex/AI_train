from __future__ import annotations

from pathlib import Path
from textwrap import wrap

import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Rectangle


OUT = Path(__file__).resolve().parents[1] / "public" / "course-visuals"
plt.rcParams["svg.hashsalt"] = "ai-train-block4-revised"
plt.rcParams["svg.fonttype"] = "none"

INK = "#182431"
MUTED = "#5D6B78"
BLUE = "#0B70E0"
BLUE_DARK = "#0758B4"
BLUE_SOFT = "#EAF4FF"
CYAN_SOFT = "#E8FAFB"
VIOLET = "#7657E8"
VIOLET_SOFT = "#F0ECFF"
GREEN = "#138A57"
GREEN_SOFT = "#E8F7EF"
AMBER = "#B96A00"
AMBER_SOFT = "#FFF4DD"
RED = "#CE3B36"
RED_SOFT = "#FFF0EF"
LINE = "#D9E3EC"
PALE = "#F7FAFD"


def text(ax, x, y, value, *, size=12, weight="normal", color=INK, ha="left", va="top"):
    ax.text(
        x,
        y,
        value,
        fontsize=size,
        fontweight=weight,
        color=color,
        ha=ha,
        va=va,
        family="DejaVu Sans",
    )


def wrapped(ax, x, y, value, width, *, size=11, color=INK, weight="normal", line_height=3.25):
    for index, line in enumerate(wrap(value, width=width)):
        text(ax, x, y + index * line_height, line, size=size, color=color, weight=weight)


def card(ax, x, y, w, h, *, face=PALE, edge=LINE, radius=1.6, linewidth=1.1):
    patch = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle=f"round,pad=0.35,rounding_size={radius}",
        facecolor=face,
        edgecolor=edge,
        linewidth=linewidth,
    )
    ax.add_patch(patch)
    return patch


def pill(ax, x, y, label, *, face=BLUE, color="white", width=None):
    label_width = width or max(12, 1.1 * len(label))
    card(ax, x, y, label_width, 5.3, face=face, edge=face, radius=0.9)
    text(ax, x + label_width / 2, y + 2.65, label, size=10.2, weight="bold", color=color, ha="center", va="center")


def arrow(ax, start, end, *, color=BLUE, linewidth=1.8, style="-|>"):
    ax.add_patch(FancyArrowPatch(start, end, arrowstyle=style, mutation_scale=14, color=color, linewidth=linewidth))


def setup(title, subtitle):
    fig, ax = plt.subplots(figsize=(14.4, 9), dpi=150)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_xlim(0, 100)
    ax.set_ylim(100, 0)
    ax.axis("off")
    text(ax, 4, 4, title, size=24, weight="bold")
    text(ax, 4, 10, subtitle, size=11, color=MUTED)
    ax.plot([4, 96], [15, 15], color=LINE, linewidth=1)
    return fig, ax


def save(fig, filename):
    OUT.mkdir(parents=True, exist_ok=True)
    asset_path = OUT / filename
    fig.savefig(
        asset_path,
        format="svg",
        bbox_inches="tight",
        pad_inches=0.22,
        metadata={"Date": None},
    )
    plt.close(fig)
    svg = asset_path.read_text(encoding="utf-8")
    asset_path.write_text(
        "\n".join(line.rstrip() for line in svg.splitlines()) + "\n",
        encoding="utf-8",
    )


def task_map():
    fig, ax = setup(
        "Виды задач машинного обучения",
        "Сначала наличие правильных ответов, затем формат результата.",
    )
    card(ax, 37, 19, 26, 8, face=BLUE, edge=BLUE)
    text(ax, 50, 23, "МАШИННОЕ ОБУЧЕНИЕ", size=14, weight="bold", color="white", ha="center", va="center")
    arrow(ax, (45, 27), (28, 35))
    arrow(ax, (55, 27), (72, 35))
    card(ax, 14, 35, 28, 8, face=BLUE_SOFT, edge="#9BCBFA")
    card(ax, 58, 35, 28, 8, face=VIOLET_SOFT, edge="#C4B8FA")
    text(ax, 28, 39, "С УЧИТЕЛЕМ", size=13, weight="bold", color=BLUE_DARK, ha="center", va="center")
    text(ax, 72, 39, "БЕЗ УЧИТЕЛЯ", size=13, weight="bold", color=VIOLET, ha="center", va="center")
    text(ax, 28, 45, "для примеров известны ответы", size=10, color=MUTED, ha="center")
    text(ax, 72, 45, "готовых ответов нет", size=10, color=MUTED, ha="center")

    cards = [
        (4, 51, "КЛАССИФИКАЦИЯ", "Категория", "уйдёт / останется", BLUE_SOFT, BLUE),
        (36, 51, "РЕГРЕССИЯ", "Число", "цена квартиры", CYAN_SOFT, GREEN),
        (68, 51, "КЛАСТЕРИЗАЦИЯ", "Группы", "похожие клиенты", VIOLET_SOFT, VIOLET),
    ]
    for x, y, heading, result, example, face, accent in cards:
        card(ax, x, y, 28, 37, face=face, edge=accent)
        text(ax, x + 14, y + 5, heading, size=12.5, weight="bold", color=accent, ha="center")
        pill(ax, x + 8, y + 10, result.upper(), face=accent, width=12)
        if heading == "КЛАССИФИКАЦИЯ":
            ax.plot([x + 4, x + 24], [y + 25, y + 18], color=accent, linewidth=2)
            for px, py, marker in [(8, 20, "o"), (11, 27, "o"), (18, 19, "s"), (22, 24, "s")]:
                ax.scatter(x + px, y + py, s=75, marker=marker, facecolors="white", edgecolors=accent, linewidths=2)
            ax.scatter(x + 20, y + 20, s=115, marker="s", facecolors=accent, edgecolors=INK, linewidths=1.5)
            text(ax, x + 19, y + 16, "новый клиент", size=8.5, color=INK, ha="center")
        elif heading == "РЕГРЕССИЯ":
            ax.plot([x + 5, x + 24], [y + 28, y + 17], color=accent, linewidth=2.2)
            for px, py in [(6, 27), (10, 25), (14, 22), (18, 20), (22, 18)]:
                ax.scatter(x + px, y + py, s=55, color="white", edgecolor=accent, linewidth=1.7)
            ax.scatter(x + 20, y + 19.3, s=100, facecolors="white", edgecolors=INK, linewidths=2)
            ax.plot([x + 20, x + 20], [y + 19.3, y + 31], color=MUTED, linestyle="--", linewidth=1)
        else:
            centers = [(x + 10, y + 22, BLUE), (x + 20, y + 25, VIOLET)]
            for cx, cy, color in centers:
                for dx, dy in [(-3, -2), (-1, 2), (2, -1), (3, 2), (0, 0)]:
                    ax.scatter(cx + dx, cy + dy, s=50, color=color, alpha=0.85)
                ax.add_patch(Circle((cx, cy), 5.5, fill=False, edgecolor=color, linewidth=1.6, linestyle="--"))
        text(ax, x + 14, y + 33, example, size=10.5, color=INK, ha="center")
    text(ax, 50, 94, "Числовой код класса не превращает классификацию в регрессию.", size=11, color=RED, weight="bold", ha="center")
    save(fig, "ml-4-1-task-map.svg")


def dataset_terms():
    fig, ax = setup(
        "Объекты, признаки и целевая переменная",
        "Один и тот же табличный пример связывает определения, X, y и момент прогноза.",
    )
    pill(ax, 4, 19, "ОПРЕДЕЛЕНИЕ", width=18)
    definitions = [
        ("Объект", "один клиент в момент решения"),
        ("Признак", "доступная характеристика клиента"),
        ("Цель", "ответ, который нужно предсказать"),
        ("Разметка", "известные ответы исторических объектов"),
    ]
    for index, (term, meaning) in enumerate(definitions):
        y = 19 + index * 7
        text(ax, 26, y + 1, term, size=11, weight="bold", color=INK)
        text(ax, 36, y + 1, "— " + meaning, size=11, color=MUTED)

    columns = [
        ("client_id", 11),
        ("возраст", 10),
        ("тариф", 14),
        ("дней_с_регистрации", 18),
        ("обращений_за_месяц", 20),
        ("ушёл_через_30_дней", 20),
    ]
    x0, y0 = 4, 53
    widths = [item[1] for item in columns]
    total = sum(widths)
    card(ax, x0, y0 - 5, total, 38, face="white", edge=LINE, radius=1.2)
    current = x0
    for index, ((label, width), col_width) in enumerate(zip(columns, widths)):
        face = "#EEF3F7" if index == 0 else (BLUE if index == len(columns) - 1 else BLUE_SOFT)
        color = MUTED if index == 0 else ("white" if index == len(columns) - 1 else BLUE_DARK)
        ax.add_patch(Rectangle((current, y0), col_width, 7, facecolor=face, edgecolor="white", linewidth=1))
        text(ax, current + col_width / 2, y0 + 3.5, label, size=8.6, weight="bold", color=color, ha="center", va="center")
        current += col_width
    rows = [
        ["C101", "24", "базовый", "31", "0", "нет"],
        ["C102", "41", "расширенный", "420", "3", "да"],
        ["C103", "35", "базовый", "125", "1", "нет"],
        ["C104", "29", "базовый", "58", "4", "да"],
    ]
    for row_index, row in enumerate(rows):
        current = x0
        y = y0 + 7 + row_index * 6
        for value, col_width in zip(row, widths):
            ax.add_patch(Rectangle((current, y), col_width, 6, facecolor="white", edgecolor=LINE, linewidth=0.7))
            text(ax, current + col_width / 2, y + 3, value, size=9.5, color=INK, ha="center", va="center")
            current += col_width
    ax.annotate("", xy=(15, y0 - 1.2), xytext=(87, y0 - 1.2), arrowprops=dict(arrowstyle="|-|", color=VIOLET, lw=1.8))
    text(ax, 51, y0 - 3, "ПРИЗНАКИ  X", size=10.5, weight="bold", color=VIOLET, ha="center")
    ax.annotate("", xy=(94, y0 - 1.2), xytext=(87, y0 - 1.2), arrowprops=dict(arrowstyle="|-|", color=BLUE, lw=1.8))
    text(ax, 90.5, y0 - 3, "ЦЕЛЬ  y", size=10.5, weight="bold", color=BLUE, ha="center")
    text(ax, 9.5, y0 - 3, "ID", size=10.5, weight="bold", color=MUTED, ha="center")
    ax.annotate("", xy=(98, y0 + 7), xytext=(98, y0 + 31), arrowprops=dict(arrowstyle="|-|", color=VIOLET, lw=1.8))
    text(ax, 97, y0 + 19, "ОБЪЕКТЫ", size=10.5, weight="bold", color=VIOLET, ha="right", va="center",)
    card(ax, 4, 88, 92, 7, face=AMBER_SOFT, edge="#F2C36F")
    text(ax, 7, 91.5, "Служебный идентификатор помогает связать записи, но сам по себе не описывает переносимую закономерность.", size=10.5, color=AMBER, weight="bold", va="center")
    save(fig, "ml-4-2-dataset-terms.svg")


def leakage():
    fig, ax = setup(
        "Момент прогноза и утечка данных",
        "Допустим только тот признак, который существовал к моменту решения.",
    )
    ax.plot([9, 91], [45, 45], color=INK, linewidth=2)
    points = [(14, "регистрация", GREEN), (36, "данные сегодня", BLUE), (53, "ПРОГНОЗ", VIOLET), (76, "исход", RED)]
    for x, label, color in points:
        ax.add_patch(Circle((x, 45), 1.7, facecolor=color, edgecolor="white", linewidth=1.5))
        text(ax, x, 49, label, size=10, weight="bold", color=color, ha="center")
    arrow(ax, (38, 34), (51, 42), color=BLUE)
    card(ax, 7, 20, 37, 13, face=GREEN_SOFT, edge="#8BD0AA")
    text(ax, 10, 23, "МОЖНО В X", size=11, weight="bold", color=GREEN)
    wrapped(ax, 10, 27, "Возраст, тариф, обращения — если они уже известны в момент решения.", 46, size=10.2, color=INK)
    card(ax, 56, 20, 37, 13, face=RED_SOFT, edge="#EFA19D")
    text(ax, 59, 23, "НЕЛЬЗЯ В X", size=11, weight="bold", color=RED)
    wrapped(ax, 59, 27, "Финальный статус, дата закрытия, сумма возврата — они появляются после прогноза.", 45, size=10.2, color=INK)
    card(ax, 5, 59, 43, 27, face=RED_SOFT, edge="#EFA19D")
    pill(ax, 8, 62, "ПРЯМАЯ УТЕЧКА", face=RED, width=19)
    wrapped(ax, 8, 71, "Признак прямо или почти прямо содержит ответ.", 42, size=11, weight="bold")
    text(ax, 8, 81, "Пример: сумма возврата → «будет возврат?»", size=10, color=MUTED)
    card(ax, 52, 59, 43, 27, face=AMBER_SOFT, edge="#F2C36F")
    pill(ax, 55, 62, "ВРЕМЕННАЯ УТЕЧКА", face=AMBER, width=22)
    wrapped(ax, 55, 71, "Признак появился позже момента прогноза.", 42, size=11, weight="bold")
    text(ax, 55, 81, "Пример: финальный статус заказа → «отменят?»", size=10, color=MUTED)
    text(ax, 50, 93, "Высокая метрика с будущими данными — не успех модели.", size=12, color=RED, weight="bold", ha="center")
    save(fig, "ml-4-2-leakage.svg")


def linear_prediction():
    fig, ax = setup(
        "Линейная регрессия: fit → параметры → predict",
        "Обученная прямая превращает новый x в числовой прогноз.",
    )
    plot_x0, plot_y0, plot_w, plot_h = 7, 24, 55, 58
    ax.plot([plot_x0, plot_x0], [plot_y0, plot_y0 + plot_h], color=INK, linewidth=1.4)
    ax.plot([plot_x0, plot_x0 + plot_w], [plot_y0 + plot_h, plot_y0 + plot_h], color=INK, linewidth=1.4)
    text(ax, plot_x0 + plot_w / 2, 88, "Площадь, м²", size=10.5, ha="center")
    text(ax, 2.5, plot_y0 + plot_h / 2, "Цена, млн ₽", size=10.5, ha="center", va="center")
    xs = [6, 12, 18, 23, 28, 34, 40, 45]
    ys = [48, 44, 41, 37, 36, 31, 28, 24]
    for px, py in zip(xs, ys):
        ax.scatter(plot_x0 + px, plot_y0 + py, s=60, facecolor=BLUE_SOFT, edgecolor=BLUE, linewidth=1.8)
    ax.plot([plot_x0 + 3, plot_x0 + 50], [plot_y0 + 50, plot_y0 + 20], color=INK, linewidth=2.1)
    new_x, new_y = plot_x0 + 42, plot_y0 + 25
    ax.plot([new_x, new_x], [new_y, plot_y0 + plot_h], color=VIOLET, linestyle="--", linewidth=1.5)
    ax.plot([plot_x0, new_x], [new_y, new_y], color=VIOLET, linestyle="--", linewidth=1.5)
    ax.scatter(new_x, new_y, s=150, facecolor="white", edgecolor=VIOLET, linewidth=2.6, zorder=5)
    text(ax, new_x + 1.5, new_y - 5, "новый объект", size=9.5, weight="bold", color=VIOLET)

    steps = [
        (68, 24, "1", "SPLIT 80/20", "Отделить test до обучения"),
        (68, 42, "2", "FIT НА TRAIN", "Найти w и b"),
        (68, 60, "3", "PREDICT", "Применить к X_test и новому объекту"),
    ]
    for x, y, number, heading, body in steps:
        card(ax, x, y, 27, 13, face=BLUE_SOFT if number != "2" else VIOLET_SOFT, edge=BLUE if number != "2" else VIOLET)
        ax.add_patch(Circle((x + 4, y + 6.5), 2.2, facecolor=BLUE if number != "2" else VIOLET, edgecolor="none"))
        text(ax, x + 4, y + 6.5, number, size=10, weight="bold", color="white", ha="center", va="center")
        text(ax, x + 8, y + 3, heading, size=10.5, weight="bold")
        text(ax, x + 8, y + 8, body, size=8.8, color=MUTED)
    text(ax, 68, 80, "model.coef_  →  w", size=10.5, color=BLUE_DARK, weight="bold")
    text(ax, 68, 85, "model.intercept_  →  b", size=10.5, color=BLUE_DARK, weight="bold")
    save(fig, "ml-4-3-linear-prediction.svg")


def outlier_extrapolation():
    fig, ax = setup(
        "Два ограничения линейной модели",
        "Выброс меняет прямую, а экстраполяция продолжает её без подтверждающих данных.",
    )
    panels = [(4, "ВЫБРОС", RED_SOFT, RED), (52, "ЭКСТРАПОЛЯЦИЯ", AMBER_SOFT, AMBER)]
    for x, heading, face, accent in panels:
        card(ax, x, 21, 44, 66, face=face, edge=accent)
        pill(ax, x + 3, 24, heading, face=accent, width=21)
        px0, py0 = x + 6, 39
        ax.plot([px0, px0], [py0, py0 + 35], color=INK, linewidth=1.2)
        ax.plot([px0, px0 + 32], [py0 + 35, py0 + 35], color=INK, linewidth=1.2)
        for dx, dy in [(4, 29), (9, 25), (14, 22), (19, 18), (24, 15)]:
            ax.scatter(px0 + dx, py0 + dy, s=48, facecolor="white", edgecolor=BLUE, linewidth=1.5)
        if heading == "ВЫБРОС":
            ax.plot([px0 + 3, px0 + 29], [py0 + 31, py0 + 12], color=BLUE, linewidth=1.7, label="без выброса")
            ax.scatter(px0 + 28, py0 + 32, s=110, color=RED, marker="x", linewidth=2.5)
            ax.plot([px0 + 3, px0 + 29], [py0 + 27, py0 + 23], color=RED, linewidth=2, label="с выбросом")
            text(ax, x + 22, 80, "Одна точка заметно", size=10, color=RED, weight="bold", ha="center")
            text(ax, x + 22, 84, "повернула прямую", size=10, color=RED, weight="bold", ha="center")
        else:
            ax.plot([px0 + 3, px0 + 23], [py0 + 31, py0 + 14], color=BLUE, linewidth=2)
            ax.plot([px0 + 23, px0 + 34], [py0 + 14, py0 + 5], color=AMBER, linewidth=2, linestyle="--")
            ax.axvspan(px0 + 23, px0 + 34, ymin=0.18, ymax=0.70, facecolor=AMBER, alpha=0.08)
            text(ax, px0 + 28.5, py0 + 2, "нет train-точек", size=8.5, color=AMBER, ha="center")
            text(ax, x + 22, 80, "Линия продолжается,", size=10, color=AMBER, weight="bold", ha="center")
            text(ax, x + 22, 84, "но данных уже нет", size=10, color=AMBER, weight="bold", ha="center")
    save(fig, "ml-4-3-outlier-extrapolation.svg")


def regression_metrics():
    fig, ax = setup(
        "Остаток, MAE и сравнение с baseline",
        "Один набор чисел связывает истинные значения, прогнозы и итоговую ошибку.",
    )
    headers = ["Объект", "Истина y", "Прогноз ŷ", "Остаток y−ŷ", "|ошибка|"]
    rows = [
        ["1", "10", "11", "−1", "1"],
        ["2", "12", "10", "2", "2"],
        ["3", "20", "16", "4", "4"],
        ["4", "14", "15", "−1", "1"],
    ]
    x0, y0, col_w = 5, 23, 13
    for index, header in enumerate(headers):
        ax.add_patch(Rectangle((x0 + index * col_w, y0), col_w, 7, facecolor=BLUE if index in (1, 2) else BLUE_SOFT, edgecolor="white"))
        text(ax, x0 + index * col_w + col_w / 2, y0 + 3.5, header, size=9.2, weight="bold", color="white" if index in (1, 2) else BLUE_DARK, ha="center", va="center")
    for row_index, row in enumerate(rows):
        for col_index, value in enumerate(row):
            ax.add_patch(Rectangle((x0 + col_index * col_w, y0 + 7 + row_index * 7), col_w, 7, facecolor="white", edgecolor=LINE))
            text(ax, x0 + col_index * col_w + col_w / 2, y0 + 10.5 + row_index * 7, value, size=10.5, ha="center", va="center")
    card(ax, 5, 62, 65, 18, face=BLUE_SOFT, edge="#9BCBFA")
    text(ax, 9, 66, "MAE = (1 + 2 + 4 + 1) / 4 = 2", size=15, weight="bold", color=BLUE_DARK)
    text(ax, 9, 73, "Средняя абсолютная ошибка — 2 единицы цели", size=10.5, color=MUTED)

    card(ax, 74, 23, 22, 57, face=GREEN_SOFT, edge="#8BD0AA")
    pill(ax, 77, 26, "BASELINE", face=GREEN, width=16)
    text(ax, 85, 37, "Среднее y_train", size=11, weight="bold", ha="center")
    text(ax, 85, 44, "MAE = 4,00", size=16, weight="bold", color=MUTED, ha="center")
    arrow(ax, (85, 50), (85, 57), color=GREEN)
    text(ax, 85, 59, "Линейная модель", size=11, weight="bold", ha="center")
    text(ax, 85, 66, "MAE = 2,33", size=16, weight="bold", color=GREEN, ha="center")
    text(ax, 85, 73, "ниже на 1,67", size=10, color=GREEN, weight="bold", ha="center")
    text(ax, 50, 90, "Обе модели оцениваются на одном и том же test.", size=11, color=INK, weight="bold", ha="center")
    save(fig, "ml-4-4-regression-metrics.svg")


def confusion_imbalance():
    fig, ax = setup(
        "Матрица ошибок и ловушка 99% Accuracy",
        "FP и FN различаются реальным классом; редкий класс проверяется отдельно.",
    )
    text(ax, 27, 20, "ПРОГНОЗ", size=11, weight="bold", color=BLUE_DARK, ha="center")
    text(ax, 4, 48, "ИСТИНА", size=11, weight="bold", color=BLUE_DARK, va="center")
    matrix = [
        (13, 27, "TN", "реально 0\nпрогноз 0", GREEN_SOFT, GREEN),
        (34, 27, "FP", "реально 0\nпрогноз 1", RED_SOFT, RED),
        (13, 47, "FN", "реально 1\nпрогноз 0", RED_SOFT, RED),
        (34, 47, "TP", "реально 1\nпрогноз 1", GREEN_SOFT, GREEN),
    ]
    for x, y, label, body, face, accent in matrix:
        card(ax, x, y, 19, 17, face=face, edge=accent)
        text(ax, x + 9.5, y + 4, label, size=17, weight="bold", color=accent, ha="center")
        text(ax, x + 9.5, y + 10, body, size=9.5, color=INK, ha="center", va="center")
    text(ax, 22.5, 68, "0", size=11, weight="bold", color=MUTED, ha="center")
    text(ax, 43.5, 68, "1", size=11, weight="bold", color=MUTED, ha="center")
    text(ax, 9, 35.5, "0", size=11, weight="bold", color=MUTED, ha="center")
    text(ax, 9, 55.5, "1", size=11, weight="bold", color=MUTED, ha="center")

    card(ax, 60, 22, 35, 52, face=AMBER_SOFT, edge="#F2C36F")
    pill(ax, 63, 25, "ДИСБАЛАНС", face=AMBER, width=17)
    for index in range(100):
        row, col = divmod(index, 20)
        color = RED if index == 99 else "#AAB7C2"
        ax.add_patch(Circle((64 + col * 1.35, 38 + row * 3), 0.45, facecolor=color, edgecolor="none"))
    text(ax, 77.5, 56, "99 объектов класса 0", size=10, ha="center")
    text(ax, 77.5, 61, "1 объект класса 1", size=10, ha="center", color=RED, weight="bold")
    text(ax, 77.5, 68, "всегда прогнозируем 0", size=10, ha="center", color=MUTED)
    card(ax, 60, 78, 35, 13, face=RED_SOFT, edge="#EFA19D")
    text(ax, 77.5, 81, "Accuracy = 99%", size=14, weight="bold", color=INK, ha="center")
    text(ax, 77.5, 87, "Recall класса 1 = 0%", size=14, weight="bold", color=RED, ha="center")
    save(fig, "ml-4-4-confusion-imbalance.svg")


def project_cycle():
    fig, ax = setup(
        "Цикл ML-проекта",
        "Проект начинается с действия и продолжается после внедрения.",
    )
    items = [
        ("1", "Вопрос\nи действие", BLUE),
        ("2", "Объект\nи момент", VIOLET),
        ("3", "Данные\nи цель", GREEN),
        ("4", "Разбиение", BLUE),
        ("5", "Baseline\nи модель", VIOLET),
        ("6", "Проверка", GREEN),
        ("7", "Внедрение", BLUE),
        ("8", "Мониторинг", AMBER),
        ("9", "Повторное\nобучение", RED),
    ]
    positions = [(8 + index * 11, 29) for index in range(8)] + [(85, 60)]
    for index, ((number, label, accent), (x, y)) in enumerate(zip(items, positions)):
        card(ax, x, y, 9, 16, face="white", edge=accent, radius=1.2, linewidth=1.8)
        ax.add_patch(Circle((x + 4.5, y + 4), 2, facecolor=accent, edgecolor="none"))
        text(ax, x + 4.5, y + 4, number, size=9.5, weight="bold", color="white", ha="center", va="center")
        text(ax, x + 4.5, y + 10, label, size=8.8, weight="bold", color=INK, ha="center", va="center")
        if index < 7:
            arrow(ax, (x + 9.5, y + 8), (positions[index + 1][0] - 0.5, y + 8), color=LINE, linewidth=1.5)
    arrow(ax, (91, 45), (89.5, 59), color=AMBER)
    arrow(ax, (84.5, 68), (20, 47), color=RED, linewidth=2.2)
    text(ax, 49, 63, "изменились данные, качество или условия?", size=10.5, color=RED, weight="bold", ha="center")
    card(ax, 14, 78, 72, 11, face=BLUE_SOFT, edge="#9BCBFA")
    text(ax, 50, 83.5, "Мониторинг замыкает цикл: метрика после запуска — не финальная точка.", size=11.5, weight="bold", color=BLUE_DARK, ha="center", va="center")
    save(fig, "ml-4-4-project-cycle.svg")


def split_strategies():
    fig, ax = setup(
        "Четыре стратегии разделения",
        "Граница должна учитывать классы, группы, источники и время.",
    )
    panels = [
        (4, "СЛУЧАЙНОЕ", "независимые объекты", BLUE),
        (28, "СТРАТИФИЦИРОВАННОЕ", "сохраняет доли классов", VIOLET),
        (52, "ГРУППОВОЕ", "пациент целиком", GREEN),
        (76, "ВРЕМЕННОЕ", "прошлое → будущее", AMBER),
    ]
    for x, heading, subtitle, accent in panels:
        card(ax, x, 22, 20, 62, face="white", edge=accent)
        text(ax, x + 10, 27, heading, size=9.5, weight="bold", color=accent, ha="center")
        text(ax, x + 10, 32, subtitle, size=8.8, color=MUTED, ha="center")
        if heading == "СЛУЧАЙНОЕ":
            for index in range(18):
                col, row = index % 6, index // 6
                face = BLUE if index in {1, 4, 8, 13} else "#B9C6D0"
                ax.add_patch(Circle((x + 3 + col * 2.8, 43 + row * 6), 0.9, facecolor=face, edgecolor="none"))
            ax.plot([x + 13.5, x + 13.5], [39, 63], color=RED, linestyle="--", linewidth=1.7)
        elif heading == "СТРАТИФИЦИРОВАННОЕ":
            for row in range(3):
                for col in range(5):
                    color = VIOLET if col == 4 else "#B9C6D0"
                    ax.add_patch(Circle((x + 3 + col * 3, 43 + row * 7), 0.9, facecolor=color, edgecolor="none"))
            text(ax, x + 10, 68, "20% редкого класса\nв каждой части", size=8.8, color=VIOLET, weight="bold", ha="center", va="center")
        elif heading == "ГРУППОВОЕ":
            groups = [("P1", BLUE), ("P2", GREEN), ("P3", VIOLET)]
            for row, (label, color) in enumerate(groups):
                text(ax, x + 3, 43 + row * 10, label, size=9, weight="bold", color=color)
                for col in range(4):
                    ax.add_patch(Rectangle((x + 7 + col * 2.8, 40 + row * 10), 2, 5, facecolor=color, alpha=0.75, edgecolor="none"))
            ax.plot([x + 13.5, x + 13.5], [38, 67], color=RED, linestyle="--", linewidth=1.7)
            text(ax, x + 10, 72, "группа не пересекает границу", size=8.5, color=GREEN, weight="bold", ha="center")
        else:
            years = [2019, 2020, 2021, 2022, 2023]
            for index, year in enumerate(years):
                color = BLUE if year < 2023 else AMBER
                ax.add_patch(Rectangle((x + 2 + index * 3.5, 42), 2.6, 17, facecolor=color, alpha=0.8, edgecolor="none"))
                text(ax, x + 3.3 + index * 3.5, 62, str(year)[-2:], size=8, ha="center")
            text(ax, x + 6, 69, "train", size=9, weight="bold", color=BLUE, ha="center")
            text(ax, x + 17, 69, "test", size=9, weight="bold", color=AMBER, ha="center")
    card(ax, 12, 88, 76, 7, face=RED_SOFT, edge="#EFA19D")
    text(ax, 50, 91.5, "ОШИБКА: визиты одного пациента оказались по обе стороны разделения.", size=10.5, color=RED, weight="bold", ha="center", va="center")
    save(fig, "ml-4-5-split-strategies.svg")


def cross_validation():
    fig, ax = setup(
        "5-fold cross-validation и внефолдовые прогнозы",
        "Каждый фолд один раз служит validation, а остальные — обучением.",
    )
    start_x, start_y = 16, 25
    text(ax, 9, 21, "СТРОКИ — ИТЕРАЦИИ", size=9.5, weight="bold", color=MUTED)
    text(ax, 48, 21, "СТОЛБЦЫ — ФОЛДЫ", size=9.5, weight="bold", color=MUTED, ha="center")
    for col in range(5):
        text(ax, start_x + col * 13 + 5.5, start_y - 4, f"Фолд {col + 1}", size=9.5, weight="bold", color=INK, ha="center")
    for row in range(5):
        text(ax, 12, start_y + row * 10 + 3.5, f"Итерация {row + 1}", size=9.2, color=INK, ha="right", va="center")
        for col in range(5):
            validation = row == col
            face = VIOLET if validation else BLUE_SOFT
            edge = VIOLET if validation else "#9BCBFA"
            ax.add_patch(Rectangle((start_x + col * 13, start_y + row * 10), 11, 7, facecolor=face, edgecolor=edge))
            text(
                ax,
                start_x + col * 13 + 5.5,
                start_y + row * 10 + 3.5,
                "валидация" if validation else "обучение",
                size=8,
                weight="bold" if validation else "normal",
                color="white" if validation else BLUE_DARK,
                ha="center",
                va="center",
            )
    card(ax, 16, 80, 64, 10, face=VIOLET_SOFT, edge="#C4B8FA")
    text(ax, 48, 85, "OOF: прогноз объекта получен моделью, которая на нём не обучалась.", size=10.5, color=VIOLET, weight="bold", ha="center", va="center")
    card(ax, 83, 25, 13, 45, face=PALE, edge=LINE)
    text(ax, 89.5, 30, "МЕТРИКА", size=10, weight="bold", color=INK, ha="center")
    values = [0.80, 0.85, 0.90, 0.75, 0.95]
    for index, value in enumerate(values):
        text(ax, 86, 39 + index * 6, f"{index + 1}", size=9, color=MUTED)
        ax.add_patch(Rectangle((88, 37 + index * 6), value * 7, 3, facecolor=BLUE, alpha=0.75, edgecolor="none"))
        text(ax, 94.5, 38.5 + index * 6, f"{value:.2f}", size=8.5, ha="right", va="center")
    text(ax, 89.5, 65, "среднее 0,85", size=9.3, weight="bold", color=BLUE_DARK, ha="center")
    text(ax, 89.5, 69, "разброс важен", size=8.8, color=RED, weight="bold", ha="center")
    save(fig, "ml-4-5-cross-validation.svg")


def nested_search():
    fig, ax = setup(
        "Подбор гиперпараметров без использования test",
        "Внутренний цикл выбирает конфигурацию, внешний оценивает процедуру выбора.",
    )
    card(ax, 5, 20, 64, 66, face=BLUE_SOFT, edge=BLUE)
    pill(ax, 9, 24, "ВНЕШНИЙ ЦИКЛ", width=19)
    text(ax, 9, 33, "Оценивает всю процедуру подбора", size=11.5, weight="bold", color=BLUE_DARK)
    for outer in range(3):
        y = 40 + outer * 13
        text(ax, 10, y + 4, f"Внешний фолд {outer + 1}", size=9.5, weight="bold", color=INK)
        card(ax, 25, y, 39, 9, face="white", edge="#9BCBFA")
        text(ax, 28, y + 2, "ВНУТРИ:", size=8.5, weight="bold", color=VIOLET)
        text(ax, 28, y + 6, "Grid / Random search → лучшая конфигурация", size=9.2, color=INK)
    arrow(ax, (69, 54), (77, 54), color=BLUE)
    card(ax, 77, 38, 18, 31, face=VIOLET_SOFT, edge=VIOLET)
    text(ax, 86, 43, "ВНЕШНЯЯ", size=10, weight="bold", color=VIOLET, ha="center")
    text(ax, 86, 48, "ОЦЕНКА", size=10, weight="bold", color=VIOLET, ha="center")
    text(ax, 86, 56, "Q₁  Q₂  Q₃", size=12, weight="bold", color=INK, ha="center")
    text(ax, 86, 63, "среднее + разброс", size=8.8, color=MUTED, ha="center")
    card(ax, 77, 74, 18, 12, face=RED_SOFT, edge=RED)
    text(ax, 86, 78, "TEST", size=12, weight="bold", color=RED, ha="center")
    text(ax, 86, 83, "один раз в конце", size=8.7, color=RED, ha="center")
    card(ax, 14, 90, 72, 6, face=AMBER_SOFT, edge="#F2C36F")
    text(ax, 50, 93, "Больше комбинаций ≠ более честная оценка.", size=10.5, color=AMBER, weight="bold", ha="center", va="center")
    save(fig, "ml-4-6-nested-search.svg")


def pipeline():
    fig, ax = setup(
        "Безопасный ColumnTransformer и Pipeline",
        "Обучаемые преобразования оценивают параметры только по train-фолду.",
    )
    card(ax, 4, 22, 18, 48, face=PALE, edge=LINE)
    pill(ax, 7, 25, "ТАБЛИЦА", width=12)
    for index, (label, color) in enumerate([
        ("возраст", BLUE),
        ("дни", BLUE),
        ("тариф", VIOLET),
        ("город", VIOLET),
    ]):
        ax.add_patch(Rectangle((8, 36 + index * 7), 10, 4.5, facecolor=color, alpha=0.16, edgecolor=color))
        text(ax, 13, 38.2 + index * 7, label, size=8.8, color=color, weight="bold", ha="center", va="center")
    arrow(ax, (22, 46), (29, 37), color=BLUE)
    arrow(ax, (22, 53), (29, 62), color=VIOLET)
    card(ax, 29, 24, 29, 24, face=BLUE_SOFT, edge=BLUE)
    text(ax, 43.5, 28, "ЧИСЛОВАЯ ВЕТКА", size=10.5, weight="bold", color=BLUE_DARK, ha="center")
    text(ax, 43.5, 35, "медиана → масштабирование", size=9.5, color=INK, ha="center")
    text(ax, 43.5, 42, "fit только по train", size=9, weight="bold", color=BLUE, ha="center")
    card(ax, 29, 53, 29, 24, face=VIOLET_SOFT, edge=VIOLET)
    text(ax, 43.5, 57, "КАТЕГОРИАЛЬНАЯ ВЕТКА", size=10.2, weight="bold", color=VIOLET, ha="center")
    text(ax, 43.5, 64, "частое → one-hot", size=9.5, color=INK, ha="center")
    text(ax, 43.5, 71, "unknown → ignore", size=9, weight="bold", color=VIOLET, ha="center")
    arrow(ax, (58, 36), (66, 48), color=BLUE)
    arrow(ax, (58, 65), (66, 52), color=VIOLET)
    card(ax, 66, 39, 13, 23, face=CYAN_SOFT, edge=GREEN)
    text(ax, 72.5, 45, "ОБЪЕДИНЕНИЕ", size=9.5, weight="bold", color=GREEN, ha="center")
    text(ax, 72.5, 54, "готовые\nпризнаки", size=9.2, color=INK, ha="center", va="center")
    arrow(ax, (79, 50), (85, 50), color=GREEN)
    card(ax, 85, 39, 11, 23, face=GREEN_SOFT, edge=GREEN)
    text(ax, 90.5, 45, "МОДЕЛЬ", size=10, weight="bold", color=GREEN, ha="center")
    text(ax, 90.5, 54, "fit / predict", size=9, color=INK, ha="center")
    card(ax, 12, 82, 76, 10, face=RED_SOFT, edge="#EFA19D")
    text(ax, 50, 87, "Неправильно: fit_transform(X) → split.  Правильно: split/CV → Pipeline.fit(train).", size=10.5, color=RED, weight="bold", ha="center", va="center")
    save(fig, "ml-4-7-pipeline.svg")


def learning_rates():
    fig, ax = setup(
        "Скорость обучения и траектория градиентного спуска",
        "Один знак минус, три разных размера шага.",
    )
    panels = [
        (4, "СЛИШКОМ МАЛЕНЬКИЙ", BLUE, "медленно"),
        (36, "ПОДХОДЯЩИЙ", GREEN, "сходится"),
        (68, "СЛИШКОМ БОЛЬШОЙ", RED, "перескакивает"),
    ]
    for x, heading, accent, note in panels:
        card(ax, x, 22, 28, 60, face="white", edge=accent)
        text(ax, x + 14, 27, heading, size=9.7, weight="bold", color=accent, ha="center")
        xs = [i / 10 for i in range(-25, 26)]
        ys = [0.18 * value * value + 42 for value in xs]
        ax.plot([x + 14 + value * 4 for value in xs], ys, color=LINE, linewidth=2)
        if note == "медленно":
            points = [(x + 6 + i * 1.2, 58 - i * 1.8) for i in range(8)]
        elif note == "сходится":
            points = [(x + 6, 58), (x + 19, 50), (x + 10, 46), (x + 15, 43.5), (x + 14, 42.5)]
        else:
            points = [(x + 6, 58), (x + 24, 58), (x + 4, 66), (x + 26, 69)]
        for index, point in enumerate(points):
            ax.scatter(*point, s=50, facecolor=accent, edgecolor="white", linewidth=1)
            if index < len(points) - 1:
                arrow(ax, point, points[index + 1], color=accent, linewidth=1.3)
        text(ax, x + 14, 74, note, size=11, weight="bold", color=accent, ha="center")
    card(ax, 20, 87, 60, 8, face=VIOLET_SOFT, edge="#C4B8FA")
    text(ax, 50, 91, "θₜ₊₁ = θₜ − η∇L(θₜ)  •  градиент указывает к росту", size=11, weight="bold", color=VIOLET, ha="center", va="center")
    save(fig, "ml-4-8-learning-rates.svg")


def batches_dot_product():
    fig, ax = setup(
        "Скалярное произведение и три режима шага",
        "Математика прогноза слева, размер выборки для одного шага справа.",
    )
    card(ax, 4, 22, 40, 62, face=BLUE_SOFT, edge=BLUE)
    pill(ax, 8, 25, "ПРОГНОЗ", width=13)
    text(ax, 8, 36, "x = [2, 3]", size=13, weight="bold", color=INK)
    text(ax, 8, 43, "w = [0,8; −0,4]", size=13, weight="bold", color=INK)
    text(ax, 8, 53, "xᵀw = 2·0,8 + 3·(−0,4)", size=11.5, color=MUTED)
    text(ax, 8, 61, "= 1,6 − 1,2 = 0,4", size=16, weight="bold", color=BLUE_DARK)
    text(ax, 8, 72, "одна строка X × веса → одно число", size=10.5, color=BLUE_DARK, weight="bold")

    modes = [
        (50, 22, "BATCH", "вся выборка", BLUE),
        (50, 44, "SGD", "один объект", RED),
        (50, 66, "MINI-BATCH", "небольшая группа", VIOLET),
    ]
    for x, y, heading, body, accent in modes:
        card(ax, x, y, 45, 16, face="white", edge=accent)
        text(ax, x + 4, y + 4, heading, size=10.5, weight="bold", color=accent)
        text(ax, x + 4, y + 10, body, size=9.5, color=MUTED)
        count = 12 if heading == "BATCH" else (1 if heading == "SGD" else 4)
        for index in range(12):
            color = accent if index < count else "#D5DDE4"
            ax.add_patch(Circle((x + 23 + (index % 6) * 3.2, y + 5 + (index // 6) * 5.5), 0.8, facecolor=color, edgecolor="none"))
    text(ax, 72.5, 89, "Разные масштабы признаков меняют геометрию и скорость оптимизации.", size=10.5, color=AMBER, weight="bold", ha="center")
    save(fig, "ml-4-8-batches-dot-product.svg")


def threshold_calibration():
    fig, ax = setup(
        "Порог и калибровка вероятностей",
        "Порог меняет решение; калибровка сравнивает вероятность с частотой.",
    )
    card(ax, 4, 22, 44, 61, face=BLUE_SOFT, edge=BLUE)
    pill(ax, 8, 25, "ПОРОГ", width=12)
    ax.plot([9, 42], [47, 47], color=INK, linewidth=2)
    for value in [0.12, 0.34, 0.56, 0.72, 0.87]:
        x = 9 + value * 33
        ax.scatter(x, 47, s=80, facecolor=BLUE, edgecolor="white", linewidth=1.2)
        text(ax, x, 51, f"{value:.2f}".replace(".", ","), size=8.5, ha="center")
    for threshold, y, color in [(0.5, 61, VIOLET), (0.8, 72, RED)]:
        x = 9 + threshold * 33
        ax.plot([x, x], [39, y - 3], color=color, linestyle="--", linewidth=2)
        text(ax, x, y, f"порог {threshold:.1f}".replace(".", ","), size=10, weight="bold", color=color, ha="center")
    text(ax, 26, 79, "выше порог → меньше тревог,\nно больше возможных FN", size=9.5, color=MUTED, ha="center", va="center")

    card(ax, 52, 22, 44, 61, face=VIOLET_SOFT, edge=VIOLET)
    pill(ax, 56, 25, "КАЛИБРОВКА", face=VIOLET, width=17)
    x0, y0 = 60, 71
    ax.plot([x0, x0], [38, y0], color=INK, linewidth=1.2)
    ax.plot([x0, 91], [y0, y0], color=INK, linewidth=1.2)
    ax.plot([x0, 91], [y0, 40], color=MUTED, linestyle="--", linewidth=1.5)
    good = [(0.1, 0.12), (0.3, 0.28), (0.5, 0.52), (0.7, 0.69), (0.9, 0.88)]
    bad = [(0.1, 0.06), (0.3, 0.14), (0.5, 0.32), (0.7, 0.46), (0.9, 0.62)]
    for predicted, observed in good:
        ax.scatter(x0 + predicted * 31, y0 - observed * 31, s=55, color=GREEN)
    for predicted, observed in bad:
        ax.scatter(x0 + predicted * 31, y0 - observed * 31, s=55, marker="x", color=RED, linewidth=2)
    text(ax, 75.5, 75, "предсказанная вероятность", size=9, ha="center")
    text(ax, 55, 55, "наблюдаемая\nчастота", size=8.5, ha="center", va="center")
    text(ax, 74, 34, "● хорошо   × плохо", size=9.5, color=INK, ha="center")
    card(ax, 15, 87, 70, 8, face=GREEN_SOFT, edge="#8BD0AA")
    text(ax, 50, 91, "Прогноз около 0,8 → примерно 80% исходов среди сопоставимых объектов.", size=10.5, color=GREEN, weight="bold", ha="center", va="center")
    save(fig, "ml-4-9-threshold-calibration.svg")


def bootstrap():
    fig, ax = setup(
        "Bootstrap-оценка интервала метрики",
        "Повторные выборки строятся с возвращением и уважают единицу независимости.",
    )
    stages = [
        (5, "1", "ИСХОДНАЯ\nВЫБОРКА", BLUE),
        (28, "2", "ВЫБОРКИ С\nВОЗВРАЩЕНИЕМ", VIOLET),
        (54, "3", "МЕТРИКА\nКАЖДОЙ ВЫБОРКИ", GREEN),
        (79, "4", "РАСПРЕДЕЛЕНИЕ\nИ ИНТЕРВАЛ", AMBER),
    ]
    for index, (x, number, label, accent) in enumerate(stages):
        card(ax, x, 26, 17, 48, face="white", edge=accent)
        ax.add_patch(Circle((x + 8.5, 32), 2.6, facecolor=accent, edgecolor="none"))
        text(ax, x + 8.5, 32, number, size=10, weight="bold", color="white", ha="center", va="center")
        text(ax, x + 8.5, 39, label, size=9.2, weight="bold", color=accent, ha="center", va="center")
        if number == "1":
            for dot in range(8):
                ax.add_patch(Circle((x + 4 + (dot % 4) * 3, 55 + (dot // 4) * 6), 0.9, facecolor=BLUE, alpha=0.75, edgecolor="none"))
        elif number == "2":
            sequences = ["A C C D", "B B C A", "D A D C"]
            for row, sequence in enumerate(sequences):
                text(ax, x + 8.5, 52 + row * 6, sequence, size=8.8, color=INK, ha="center")
        elif number == "3":
            for row, value in enumerate([0.74, 0.81, 0.77, 0.85]):
                text(ax, x + 8.5, 51 + row * 5, f"F1 = {value:.2f}".replace(".", ","), size=8.8, color=INK, ha="center")
        else:
            values = [2, 5, 9, 13, 10, 6, 3]
            for col, value in enumerate(values):
                ax.add_patch(Rectangle((x + 2 + col * 1.8, 66 - value), 1.5, value, facecolor=AMBER, alpha=0.75, edgecolor="none"))
            text(ax, x + 8.5, 69, "2,5%      97,5%", size=8, color=AMBER, weight="bold", ha="center")
        if index < len(stages) - 1:
            arrow(ax, (x + 17.5, 50), (stages[index + 1][0] - 0.5, 50), color=LINE)
    card(ax, 10, 81, 80, 11, face=RED_SOFT, edge="#EFA19D")
    text(ax, 50, 84, "Групповые данные: ресэмплировать пациентов целиком.", size=10.5, weight="bold", color=RED, ha="center")
    text(ax, 50, 89, "Простой bootstrap строк может разрушить зависимость и дать неверный интервал.", size=9.5, color=RED, ha="center")
    save(fig, "ml-4-9-bootstrap.svg")


def complexity_curves():
    fig, ax = setup(
        "Сложность модели: underfit → баланс → overfit",
        "Train и validation отвечают на разные вопросы.",
    )
    panels = [
        (4, "НЕДООБУЧЕНИЕ", BLUE, "обе ошибки высоки"),
        (36, "ПОДХОДЯЩАЯ", GREEN, "ошибки низки и близки"),
        (68, "ПЕРЕОБУЧЕНИЕ", RED, "train хорошо, validation хуже"),
    ]
    for x, heading, accent, note in panels:
        card(ax, x, 21, 28, 44, face="white", edge=accent)
        text(ax, x + 14, 26, heading, size=10, weight="bold", color=accent, ha="center")
        px = [x + 3 + i * 3 for i in range(8)]
        py = [48, 43, 47, 36, 41, 31, 37, 29]
        ax.scatter(px, py, s=36, color="#AEBBC5")
        if heading == "НЕДООБУЧЕНИЕ":
            ax.plot([x + 3, x + 24], [43, 37], color=accent, linewidth=2)
        elif heading == "ПОДХОДЯЩАЯ":
            ax.plot([x + 3, x + 7, x + 11, x + 15, x + 19, x + 24], [48, 44, 43, 38, 35, 30], color=accent, linewidth=2)
        else:
            ax.plot(px, [49, 42, 48, 35, 42, 30, 38, 28], color=accent, linewidth=2.2)
        text(ax, x + 14, 59, note, size=8.8, color=accent, weight="bold", ha="center")
    card(ax, 10, 72, 80, 19, face=BLUE_SOFT, edge="#9BCBFA")
    xs = [17, 28, 39, 50, 61, 72, 83]
    train = [82, 70, 60, 51, 45, 40, 37]
    valid = [88, 75, 62, 53, 50, 57, 69]
    ax.plot(xs, train, color=BLUE, linewidth=2.3, marker="o")
    ax.plot(xs, valid, color=RED, linewidth=2.3, marker="s")
    text(ax, 16, 75, "ошибка", size=8.5, color=MUTED)
    text(ax, 50, 92, "сложность модели", size=9, color=MUTED, ha="center")
    text(ax, 78, 76, "train", size=9, color=BLUE, weight="bold")
    text(ax, 78, 81, "validation", size=9, color=RED, weight="bold")
    save(fig, "ml-4-10-complexity-curves.svg")


def regularization_coefficients():
    fig, ax = setup(
        "Коэффициенты без регуляризации, с L2 и с L1",
        "Штраф ограничивает величину весов; L1 может обнулить часть коэффициентов.",
    )
    groups = [
        (6, "БЕЗ ШТРАФА", [8, -6, 5, -4, 3], BLUE),
        (37, "L2", [5, -4, 3, -2.5, 2], GREEN),
        (68, "L1", [6, 0, 3, 0, 1.5], VIOLET),
    ]
    for x, heading, values, accent in groups:
        card(ax, x, 22, 26, 56, face="white", edge=accent)
        text(ax, x + 13, 27, heading, size=11, weight="bold", color=accent, ha="center")
        baseline = 52
        ax.plot([x + 4, x + 22], [baseline, baseline], color=INK, linewidth=1)
        for index, value in enumerate(values):
            bx = x + 4 + index * 4
            height = abs(value) * 2.2
            y = baseline - height if value >= 0 else baseline
            color = accent if value != 0 else LINE
            ax.add_patch(Rectangle((bx, y), 2.5, max(0.8, height), facecolor=color, alpha=0.8, edgecolor="none"))
            text(ax, bx + 1.25, 68, f"w{index + 1}", size=8.2, color=MUTED, ha="center")
        note = "крупные веса" if heading == "БЕЗ ШТРАФА" else ("сжаты к нулю" if heading == "L2" else "часть равна нулю")
        text(ax, x + 13, 73, note, size=9, weight="bold", color=accent, ha="center")
    card(ax, 12, 84, 76, 10, face=AMBER_SOFT, edge="#F2C36F")
    text(ax, 50, 87, "Слишком большая λ → недообучение.", size=11, weight="bold", color=AMBER, ha="center")
    text(ax, 50, 91, "Без сопоставимого масштаба штраф действует на признаки неравномерно.", size=9.5, color=AMBER, ha="center")
    save(fig, "ml-4-10-regularization-coefficients.svg")


def subgroup_metrics():
    fig, ax = setup(
        "Общая метрика может скрывать проблему в подгруппе",
        "Рядом с метрикой всегда показываются размер группы и неопределённость.",
    )
    groups = [
        ("Все объекты", 820, 0.84, 0.02, BLUE),
        ("Клиника A", 410, 0.88, 0.03, GREEN),
        ("Клиника B", 330, 0.85, 0.04, VIOLET),
        ("Клиника C", 80, 0.61, 0.11, RED),
    ]
    card(ax, 7, 22, 86, 59, face="white", edge=LINE)
    for index, (label, n, score, uncertainty, accent) in enumerate(groups):
        y = 31 + index * 12
        text(ax, 11, y, label, size=10.5, weight="bold", color=INK)
        text(ax, 30, y, f"n = {n}", size=9.5, color=MUTED)
        x0 = 42
        ax.plot([x0, 86], [y + 2, y + 2], color=LINE, linewidth=5, solid_capstyle="round")
        point_x = x0 + score * 44
        left = x0 + max(0, score - uncertainty) * 44
        right = x0 + min(1, score + uncertainty) * 44
        ax.plot([left, right], [y + 2, y + 2], color=accent, linewidth=2.2)
        ax.scatter(point_x, y + 2, s=90, color=accent, edgecolor="white", linewidth=1)
        text(ax, 90, y, f"{score:.2f}".replace(".", ","), size=11, weight="bold", color=accent, ha="right")
    card(ax, 17, 86, 66, 8, face=RED_SOFT, edge="#EFA19D")
    text(ax, 50, 90, "Общая F1 = 0,84 не показывает F1 = 0,61 в клинике C.", size=10.5, color=RED, weight="bold", ha="center", va="center")
    save(fig, "ml-4-11-subgroup-metrics.svg")


def interpretability():
    fig, ax = setup(
        "Три инструмента интерпретации — три разных вопроса",
        "Важность описывает модель и данные, а не причинный эффект.",
    )
    tools = [
        (4, "КОЭФФИЦИЕНТ", "Как меняется линейный результат при росте признака?", BLUE, "зависит от масштаба\nи корреляций"),
        (36, "PERMUTATION", "Насколько упадёт выбранная метрика после перемешивания?", GREEN, "зависит от метрики\nи test-данных"),
        (68, "SHAP", "Как признак сдвинул прогноз относительно выбранного фона?", VIOLET, "зависит от модели,\nфона и зависимостей"),
    ]
    for x, heading, question, accent, limit in tools:
        card(ax, x, 22, 28, 52, face="white", edge=accent)
        pill(ax, x + 4, 26, heading, face=accent, width=20)
        wrapped(ax, x + 4, 37, question, 34, size=10.2, weight="bold")
        ax.plot([x + 4, x + 24], [55, 55], color=LINE, linewidth=1)
        text(ax, x + 4, 59, "ОГРАНИЧЕНИЕ", size=8.8, weight="bold", color=RED)
        text(ax, x + 14, 66, limit, size=9.2, color=MUTED, ha="center", va="center")
    arrow(ax, (18, 77), (18, 84), color=RED)
    arrow(ax, (50, 77), (50, 84), color=RED)
    arrow(ax, (82, 77), (82, 84), color=RED)
    card(ax, 10, 84, 80, 11, face=RED_SOFT, edge=RED)
    text(ax, 50, 88, "СВЯЗЬ ≠ ПРИЧИННОСТЬ", size=13, weight="bold", color=RED, ha="center")
    text(ax, 50, 93, "Ни коэффициент, ни permutation importance, ни SHAP не доказывают причинный эффект.", size=9.7, color=RED, ha="center")
    save(fig, "ml-4-11-interpretability.svg")


def main():
    task_map()
    dataset_terms()
    leakage()
    linear_prediction()
    outlier_extrapolation()
    regression_metrics()
    confusion_imbalance()
    project_cycle()
    split_strategies()
    cross_validation()
    nested_search()
    pipeline()
    learning_rates()
    batches_dot_product()
    threshold_calibration()
    bootstrap()
    complexity_curves()
    regularization_coefficients()
    subgroup_metrics()
    interpretability()
    print("Generated 20 revised block 4 SVG visuals.")


if __name__ == "__main__":
    main()
