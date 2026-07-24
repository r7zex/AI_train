from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TOPIC_SOURCE = ROOT / "src/data/curriculum/ml_revised.ts"


class RevisedMetricConsistencyTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        source = TOPIC_SOURCE.read_text(encoding="utf-8")
        cls.topic = source.split("const topic44 = topic({", 1)[1].split("const topic45 = topic({", 1)[0]

    def test_regression_example_uses_one_dataset_for_all_errors(self) -> None:
        self.assertIn(
            "правильные значения четырёх объектов равны [10, 12, 20, 14], "
            "а прогнозы — [11, 10, 16, 15]",
            self.topic,
        )
        self.assertIn("Остатки `y−ŷ` равны [−1, 2, 4, −1]", self.topic)
        self.assertIn("MAE=(1+2+4+1)/4=2", self.topic)
        self.assertIn("mean_squared_error", self.topic)
        self.assertIn("r2_score", self.topic)
        self.assertIn("DummyRegressor", self.topic)

    def test_classification_definitions_and_imbalance_are_consistent(self) -> None:
        for definition in [
            "TP: реально 1, предсказано 1",
            "TN: реально 0, предсказано 0",
            "FP: реально 0, предсказано 1",
            "FN: реально 1, предсказано 0",
        ]:
            self.assertIn(definition, self.topic)
        self.assertIn("99 объектов класса 0 и один объект класса 1", self.topic)
        self.assertIn("Accuracy=99%", self.topic)
        self.assertIn("Recall положительного класса равен 0", self.topic)
        self.assertIn("precision_score", self.topic)
        self.assertIn("recall_score", self.topic)
        self.assertIn("f1_score", self.topic)


if __name__ == "__main__":
    unittest.main()
