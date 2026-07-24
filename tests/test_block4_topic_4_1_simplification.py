from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
REVISED = ROOT / "src/data/curriculum/ml_revised.ts"


class RevisedIntroSequenceTest(unittest.TestCase):
    def test_topic_4_1_introduces_task_types_before_matrix_notation(self) -> None:
        source = REVISED.read_text(encoding="utf-8")
        topic_4_1 = source.split("const topic41 = topic({", 1)[1].split("const topic42 = topic({", 1)[0]

        self.assertIn("Обучение с учителем: правильные ответы известны", topic_4_1)
        self.assertIn("Обучение без учителя: готовых ответов нет", topic_4_1)
        self.assertIn("Классификация: предсказать категорию", topic_4_1)
        self.assertIn("Регрессия: предсказать число", topic_4_1)
        self.assertIn("Кластеризация: найти группы", topic_4_1)
        self.assertNotIn("матрица признаков X", topic_4_1)
        self.assertNotIn("ответы y", topic_4_1)

    def test_topic_4_2_uses_the_required_feature_target_split_and_visuals(self) -> None:
        source = REVISED.read_text(encoding="utf-8")
        registry = (ROOT / "src/data/courseVisuals.ts").read_text(encoding="utf-8")
        audit = (ROOT / "scripts/audit-curriculum.mjs").read_text(encoding="utf-8")

        self.assertIn('X = df.drop(columns=["ушёл_через_30_дней", "client_id"])', source)
        self.assertIn('y = df["ушёл_через_30_дней"]', source)
        self.assertIn("'ml-foundations-data-target': [", registry)
        self.assertIn("ml-4-2-dataset-terms.svg", registry)
        self.assertIn("ml-4-2-leakage.svg", registry)
        self.assertIn("Every legacy block 4 quiz and practice step must be preserved exactly once.", audit)
        self.assertTrue((ROOT / "public/course-visuals/ml-4-2-dataset-terms.svg").exists())
        self.assertTrue((ROOT / "public/course-visuals/ml-4-2-leakage.svg").exists())


if __name__ == "__main__":
    unittest.main()
