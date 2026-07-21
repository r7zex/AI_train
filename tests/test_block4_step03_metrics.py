from __future__ import annotations

import re
import unittest
from pathlib import Path

import numpy as np
from sklearn.metrics import f1_score, mean_absolute_error, mean_squared_error, r2_score


ROOT = Path(__file__).resolve().parents[1]
TOPIC_SOURCE = ROOT / "src/data/curriculum/ml_foundations/train_test_baseline_metrics.ts"


def numeric_arrays(source: str, variable: str) -> list[list[int]]:
    pattern = rf"{variable} = np\.array\(\[([^\]]+)]\)"
    return [
        [int(value.strip()) for value in match.split(",")]
        for match in re.findall(pattern, source)
    ]


class Step03MetricConsistencyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = TOPIC_SOURCE.read_text(encoding="utf-8")

    def test_regression_text_formula_code_and_output_use_one_dataset(self) -> None:
        expected_true = [10, 12, 20]
        expected_pred = [11, 10, 16]
        true_arrays = numeric_arrays(self.source, "y_true")
        pred_arrays = numeric_arrays(self.source, "y_pred")

        self.assertGreaterEqual(len(true_arrays), 2)
        self.assertGreaterEqual(len(pred_arrays), 2)
        self.assertTrue(all(values == expected_true for values in true_arrays))
        self.assertTrue(all(values == expected_pred for values in pred_arrays))
        self.assertNotIn("Ответы: 10, 20, 30", self.source)
        self.assertNotIn("MSE ≈ 5.67", self.source)

        y_true = np.array(expected_true)
        y_pred = np.array(expected_pred)
        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_true, y_pred)

        self.assertAlmostEqual(mae, 7 / 3)
        self.assertAlmostEqual(mse, 7)
        self.assertAlmostEqual(rmse, np.sqrt(7))
        self.assertAlmostEqual(r2, 0.625)
        self.assertIn("MAE=2.333; MSE=7.000; RMSE=2.646; R²=0.625", self.source)
        self.assertIn("(1+2+4)/3 = 7/3 ≈ 2.333", self.source)
        self.assertIn("(1+4+16)/3 = 7.000", self.source)
        self.assertIn("R² = 1−21/56 = 0.625", self.source)

    def test_f1_uses_counts_without_double_rounding(self) -> None:
        y_true = np.array([1] * 10 + [0] * 90)
        y_pred = np.array([1] * 8 + [0] * 2 + [1] * 18 + [0] * 72)
        sklearn_f1 = f1_score(y_true, y_pred)
        direct_f1 = 2 * 8 / (2 * 8 + 18 + 2)

        self.assertEqual(direct_f1, 16 / 36)
        self.assertAlmostEqual(sklearn_f1, direct_f1)
        self.assertEqual(f"{sklearn_f1:.3f}", "0.444")
        self.assertIn("F1=16/36=4/9≈0.444", self.source)
        self.assertIn("precision=0.308; recall=0.800; F1=0.444", self.source)
        self.assertNotIn("F1≈0.45", self.source)
        self.assertNotIn("0.496/1.11", self.source)


if __name__ == "__main__":
    unittest.main()
