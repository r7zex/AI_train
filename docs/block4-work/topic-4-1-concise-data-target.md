# Topic 4.1: краткое разделение данных на X и y

## Base и публикация

- Base SHA: `751f51256338c2b6e19220b33b592b97e066e67d`.
- Tested source SHA: `581e49f793ca957123e7cceff3e09f41edb5bc76`.
- Branch: `agent/block4-topic-4-1-concise-data-target`.
- Источник: актуальный `main`, содержащий слитые этапы 01–03.
- Scope: только тема 4.1, её две удалённые PNG, реестр/генератор/точный счётчик визуализаций и scoped regression coverage.

## Выполненный план

1. Оставлена одна таблица из шести клиентов и краткое пояснение ролей столбцов.
2. Ручной список `feature_cols` заменён на извлечение цели через `y = data.pop("churn_after_30d")`.
3. Таблица проверки трёх одинаковых кандидатов и развёрнутая классификация четырёх утечек удалены.
4. Правило доступности данных сведено к одному короткому блоку и контрольному списку.
5. Обе повторяющие визуализации 4.1 удалены из UI, реестра, генератора и каталога PNG.
6. Количество шагов, quiz, практик и тестов сохранено.

## Изменённые файлы

| Файл | Добавления | Удаления |
|---|---:|---:|
| `public/course-visuals/ml-foundations-data-target-2.png` | binary | binary |
| `public/course-visuals/ml-foundations-data-target.png` | binary | binary |
| `scripts/audit-curriculum.mjs` | 14 | 2 |
| `scripts/generate-course-visuals.py` | 3 | 126 |
| `src/data/courseVisuals.ts` | 1 | 18 |
| `src/data/curriculum/ml_foundations/data_target.ts` | 60 | 118 |
| `tests/e2e/block4-step02-consistency.spec.ts` | 11 | 3 |
| `tests/e2e/course.spec.ts` | 20 | 44 |
| `tests/test_block4_topic_4_1_simplification.py` | 36 | 0 |

Source text total: **145 additions / 311 deletions**. Два PNG учитываются как бинарные удаления.

## Protected counts

| Сущность | До | После | Результат |
|---|---:|---:|---|
| Steps 4.1 | 5 | 5 | сохранено |
| Theory steps | 3 | 3 | сохранено |
| Quiz questions | 1 | 1 | сохранено |
| Practices | 1 | 1 | сохранено |
| Sample tests | 2 | 2 | сохранено |
| Hidden tests | 3 | 3 | сохранено |
| Course topics | 84 | 84 | сохранено |
| Course steps | 618 | 618 | сохранено |
| Registered/generated PNG | 103 | 101 | удалены только две иллюстрации 4.1 |

## Acceptance map

| ID | Статус | Изменение | Доказательство | Проверка | Остаточный пробел |
|---|---|---|---|---|---|
| R41-001 | DONE | Одна компактная таблица вместо повторных определений и таблицы ролей | `data_target.ts`, первый theory step | E2E desktop + source regression | Нет |
| R41-002 | DONE | Цель извлекается через `pop`, признаки не перечисляются вручную | `data_target.ts`, `split-same-rows` | pytest + E2E code assertion | Нет |
| R41-003 | DONE | Удалена повторяющая таблица проверки трёх признаков | Старый heading запрещён тестом | pytest + E2E absence assertion | Нет |
| R41-004 | DONE | Утечка сведена к правилу доступности и одному примеру будущего столбца | `cutoff-timeline` | E2E content assertion | Нет |
| R41-005 | DONE | Удалены обе PNG 4.1 и их генерация/регистрация | visual registry, generator, public assets | generator + audit + pytest | Нет |
| R41-006 | DONE | Необязательные `dataset`, `feature`, `target`, `leakage` удалены из терминологического списка; API, имена столбцов и обозначения X/y сохранены | тема 4.1 и нижний словарь | source regression + E2E + desktop/mobile | Нет |
| R41-007 | DONE | Защищённые количества не уменьшены | 3 theory + quiz + practice; прежние test IDs сохранены | curriculum audit + pytest | Нет |
| R41-008 | DONE | Старый ручной и повторяющий вариант запрещён регрессионными тестами | новый pytest и обновлённые Playwright assertions | targeted + full suite | Нет |

## Visual inventory

В теме 4.1 визуализаций больше нет. Учебный материал опирается на HTML-таблицу и выполняемый код. Остальные 101 PNG восстановлены после контрольного запуска генератора и не входят в итоговый diff.

## Команды и exit codes

| Команда | Exit code | Результат |
|---|---:|---|
| `git fetch origin main` | 0 | Актуальный `origin/main` получен до редактирования |
| `python scripts/generate-course-visuals.py` | 0 | Сгенерировано и проверено ровно 101 изображение; затем посторонние PNG восстановлены без изменений |
| `python -m pytest tests/test_block4_topic_4_1_simplification.py` | 0 | Scoped source regressions passed |
| `npm run audit:curriculum` | 0 | 14 блоков, 84 темы, 618 шагов; practice solutions и visual registry проверены |
| `npm run lint` | 0 | Ошибок нет |
| `npm run build` | 0 | Production build завершён |
| targeted Playwright | 0 | Topic 4.1 content/absence/pop и topic 4.2 consistency проверены |
| `npm run test:e2e` | 0 | Полный Playwright suite завершён |
| `git diff --check` | 0 | Ошибок пробелов нет |

## Desktop/mobile review

- Desktop: 1440×900, полная страница первого шага 4.1; повторяющих figure нет.
- Mobile: 390×844, шаг с `pop`; sidebar скрыт, горизонтального переполнения нет.
- Финальные скриншоты сохраняются в artifact `topic-4-1-review` для независимого просмотра.

## Blockers и открытые решения

- Локальная сеть sandbox не разрешила `git clone` (`Could not resolve host: github.com`, exit 128), поэтому воспроизводимый checkout и все проверки выполнены на GitHub Actions runner.
- Сгенерированный pytest bytecode удалён отдельным cleanup-коммитом и отсутствует в итоговом PR diff.
- PR остаётся draft до независимой проверки artifact и фактического GitHub diff.
