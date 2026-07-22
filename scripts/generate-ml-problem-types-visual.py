from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.lines import Line2D
from matplotlib.ticker import MaxNLocator

OUTPUT = Path(__file__).resolve().parents[1] / "public" / "course-visuals" / "ml-problem-types.svg"
POINTS_PER_PANEL = 100
BLUE = "#1746A2"
GRID = "#D6E3F8"


def main() -> None:
    plt.rcParams.update(
        {
            "font.family": "DejaVu Sans",
            "font.size": 10,
            "axes.titlesize": 14,
            "axes.labelsize": 11,
            "figure.titlesize": 18,
            "svg.fonttype": "none",
        }
    )

    x_rng = np.random.default_rng(42)
    x_linear = np.sort(x_rng.uniform(0, 10, POINTS_PER_PANEL))
    noise_rng = np.random.default_rng(123)
    y_linear = 1.05 * x_linear + 1.0 + noise_rng.normal(0, 1.0, POINTS_PER_PANEL)
    slope, intercept = np.polyfit(x_linear, y_linear, 1)
    line_x = np.linspace(x_linear.min(), x_linear.max(), 200)
    line_y = slope * line_x + intercept
    linear_correlation = float(np.corrcoef(x_linear, y_linear)[0, 1])

    ring_rng = np.random.default_rng(91)
    angle = ring_rng.uniform(0, 2 * np.pi, POINTS_PER_PANEL)
    radius = 3.0 + ring_rng.normal(0, 0.22, POINTS_PER_PANEL)
    x_ring = 5.0 + radius * np.cos(angle)
    y_ring = 5.0 + radius * np.sin(angle)
    ring_correlation = float(np.corrcoef(x_ring, y_ring)[0, 1])

    figure, axes = plt.subplots(1, 2, figsize=(12, 6.4), dpi=120)
    figure.suptitle("Линейная и нелинейная структура данных", fontweight="bold", y=0.97)

    for axis in axes:
        axis.grid(True, color=GRID, linewidth=0.8)
        axis.set_axisbelow(True)
        axis.spines[["top", "right"]].set_visible(False)
        axis.spines[["left", "bottom"]].set_color(BLUE)
        axis.tick_params(colors=BLUE)
        axis.xaxis.set_major_locator(MaxNLocator(5))
        axis.yaxis.set_major_locator(MaxNLocator(5))
        axis.set_xlabel("Признак x", fontweight="bold")
        axis.set_ylabel("Целевая величина y", fontweight="bold")

    axes[0].scatter(x_linear, y_linear, s=22, color=BLUE, zorder=3)
    axes[0].plot(line_x, line_y, color=BLUE, linewidth=2.2, zorder=4)
    axes[0].set_title("Сильная линейная связь", fontweight="bold")
    axes[0].legend(
        handles=[
            Line2D([0], [0], marker="o", linestyle="", color=BLUE, label="Наблюдения"),
            Line2D([0], [0], color=BLUE, linewidth=2.2, label="Линейная модель"),
            Line2D(
                [0],
                [0],
                linestyle="",
                label=f"Коэффициент корреляции: r = {linear_correlation:.2f}",
            ),
        ],
        loc="lower left",
        fontsize=8.5,
        framealpha=1,
        edgecolor=GRID,
    )

    axes[1].scatter(x_ring, y_ring, s=22, color=BLUE, zorder=3)
    axes[1].set_aspect("equal", adjustable="box")
    axes[1].set_title("Кольцевая нелинейная структура", fontweight="bold")
    axes[1].legend(
        handles=[
            Line2D([0], [0], marker="o", linestyle="", color=BLUE, label="Наблюдения"),
            Line2D(
                [0],
                [0],
                linestyle="",
                label=f"Коэффициент корреляции: r ≈ {abs(ring_correlation):.2f}",
            ),
        ],
        loc="lower left",
        fontsize=8.5,
        framealpha=1,
        edgecolor=GRID,
    )

    figure.text(
        0.5,
        0.045,
        "Корреляция и прямая не описывают форму кольца. "
        "Для такой зависимости нужны нелинейные методы машинного обучения.",
        ha="center",
        va="center",
        color="white",
        fontweight="bold",
        fontsize=10.5,
        bbox={"boxstyle": "round,pad=0.65", "facecolor": BLUE, "edgecolor": BLUE},
    )
    figure.subplots_adjust(left=0.08, right=0.985, top=0.86, bottom=0.18, wspace=0.22)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(OUTPUT, format="svg", bbox_inches="tight")
    plt.close(figure)


if __name__ == "__main__":
    main()
