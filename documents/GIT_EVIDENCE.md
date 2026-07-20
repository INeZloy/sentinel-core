# GIT & Time-Travel — Branch/Merge Evidence (Requirement #1)

Реальный сценарий: используем найденный баг (отсутствует проверка bradycardia)
как повод для полноценной ветки — это и осмысленно, и даёт материал для CCD/REF.

## Команды (выполнить в корне репозитория, локально)

```bash
# 1. Убедиться, что main чистый
git checkout main
git pull

# 2. Создать ветку под фичу
git checkout -b feature/bradycardia-check

# 3. Внести правку в core/vitals.c — добавить недостающую проверку
#    (см. блок "После" ниже)

git add core/vitals.c
git commit -m "fix(core): add missing bradycardia threshold check

MIN_PULSE was defined in vitals.h but never checked in analyze_vitals.
Adds the missing branch + BRADYCARDIA_EVENT alert reason.
Closes gap documented in VALIDATION.md."

# 4. Сделать скриншот `git log --oneline --graph --all` ЗДЕСЬ,
#    пока веток две — это и есть требуемый "time-travel" момент

git log --oneline --graph --all

# 5. Вернуться на main и смерджить
git checkout main
git merge feature/bradycardia-check

# 6. Скриншот после мерджа (одна линия истории, коммит фичи внутри main)
git log --oneline --graph --all

# 7. (опционально, но красиво для оценки) удалить смердженную ветку
git branch -d feature/bradycardia-check
```

## Что положить как скриншот (замена/дополнение к images/image-1.png)

1. Скриншот `git branch -a` — видно `main` и `feature/bradycardia-check` одновременно.
2. Скриншот `git log --oneline --graph --all` **до** мерджа (два расходящихся пути).
3. Скриншот `git log --oneline --graph --all` **после** мерджа (пути сошлись).

Если хочется показать ещё и **conflict resolution** (это прямо усиливает
оценку по этому пункту) — можно специально смоделировать конфликт:

```bash
# на main
git checkout main
echo "// main-side comment" >> core/vitals.c
git commit -am "docs(core): add comment on main"

# на feature-ветке правьте ту же строку по-другому, затем при мердже:
git checkout main
git merge feature/bradycardia-check
# CONFLICT (content): Merge conflict in core/vitals.c
# -> открыть файл, вручную разрешить <<<<<<< / ======= / >>>>>>>
git add core/vitals.c
git commit -m "merge: resolve conflict in vitals.c (keep both changes)"
```

Скриншот терминала с текстом `CONFLICT (content): Merge conflict` — это
именно то, что закрывает "no branch/merge" в фидбеке максимально явно.

## "После" — код правки (для коммита выше)

```c
void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
    if (v.heart_rate < MIN_PULSE) alert_plugin("BRADYCARDIA_EVENT");
    if (v.sugar_level > MAX_SUGAR) alert_plugin("HYPERGLYCEMIA_WARNING");
}
```

(Не забудьте добавить `tests.c :: test_bradycardia_triggers_alert` по
аналогии с `test_tachycardia_triggers_alert` — ещё один тест, ещё один
повод для чистого коммита.)
