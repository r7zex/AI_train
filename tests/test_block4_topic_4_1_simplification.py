from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_topic_4_1_uses_pop_and_drops_repeated_theory() -> None:
    source = (ROOT / "src/data/curriculum/ml_foundations/data_target.ts").read_text(encoding="utf-8")
    assert 'y = data.pop("churn_after_30d")' in source
    assert "feature_cols =" not in source
    assert "Роль каждого столбца" not in source
    assert "Проверить каждый кандидат в признаки" not in source
    assert "Четыре разных источника утечки" not in source
    assert "явно синтетический набор данных" not in source
    assert source.count("theoryStep(") == 3
    assert source.count("quizStep(") == 1
    assert source.count("practiceStep(") == 1


def test_topic_4_1_visuals_are_removed_without_weakening_registry_checks() -> None:
    registry = (ROOT / "src/data/courseVisuals.ts").read_text(encoding="utf-8")
    generator = (ROOT / "scripts/generate-course-visuals.py").read_text(encoding="utf-8")
    audit = (ROOT / "scripts/audit-curriculum.mjs").read_text(encoding="utf-8")
    assert "'ml-foundations-data-target': []," in registry
    assert 'ml-foundations-data-target.png' not in generator
    assert 'ml-foundations-data-target-2.png' not in generator
    assert "Expected exactly 101 course PNG files" in audit
    assert "Course PNG files missing from registry" in audit
    assert "concise table-only design must not register PNG illustrations" in audit
    assert "structured data table must contain six columns" in audit
    assert "structured data table must contain six rows" in audit
    assert not (ROOT / "public/course-visuals/ml-foundations-data-target.png").exists()
    assert not (ROOT / "public/course-visuals/ml-foundations-data-target-2.png").exists()
