# GIT & Time-Travel — Branch/Merge Evidence (Requirement #1)

Real scenario: using the bradycardia-check bug found during this project
(missing `MIN_PULSE` check in `analyze_vitals`) as the basis for a proper
feature branch — meaningful on its own, and it also feeds the CCD/REF
requirements.

## Commands (run from the repository root, locally)

```bash
# 1. Make sure main is clean
git checkout main
git pull

# 2. Create a feature branch
git checkout -b feature/bradycardia-check

# 3. Edit core/vitals.c to add the missing check (see "After" below)

git add core/vitals.c
git commit -m "fix(core): add missing bradycardia threshold check

MIN_PULSE was defined in vitals.h but never checked in analyze_vitals.
Adds the missing branch + BRADYCARDIA_EVENT alert reason.
Closes the gap documented in VALIDATION.md."

# 4. Screenshot `git log --oneline --graph --all` HERE, while there are
#    two branches — this is the required "time-travel" evidence moment

git log --oneline --graph --all

# 5. Switch back to main and merge
git checkout main
git merge feature/bradycardia-check

# 6. Screenshot after the merge (single history line, feature commit now
#    inside main)
git log --oneline --graph --all

# 7. (optional, but clean) delete the merged branch
git branch -d feature/bradycardia-check
```

## What to include as screenshots (replacing/supplementing images/image-1.png)

1. `git branch -a` — showing both `main` and `feature/bradycardia-check` at once.
2. `git log --oneline --graph --all` **before** the merge (two diverging paths).
3. `git log --oneline --graph --all` **after** the merge (paths converged).

To go further and demonstrate **conflict resolution** (this strengthens
this section considerably), you can deliberately create a conflict:

```bash
# on main
git checkout main
echo "// main-side comment" >> core/vitals.c
git commit -am "docs(core): add comment on main"

# edit the same line differently on the feature branch, then on merge:
git checkout main
git merge feature/bradycardia-check
# CONFLICT (content): Merge conflict in core/vitals.c
# -> open the file, manually resolve the <<<<<<< / ======= / >>>>>>> markers
git add core/vitals.c
git commit -m "merge: resolve conflict in vitals.c (keep both changes)"
```

A terminal screenshot showing `CONFLICT (content): Merge conflict` is
exactly the kind of evidence that closes the "no branch/merge" feedback
unambiguously.

## "After" — the actual code change (for the commit above)

```c
void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
    if (v.heart_rate < MIN_PULSE) alert_plugin("BRADYCARDIA_EVENT");
    if (v.sugar_level > MAX_SUGAR) alert_plugin("HYPERGLYCEMIA_WARNING");
}
```

(Don't forget to add `tests.c :: test_bradycardia_triggers_alert`,
mirroring `test_tachycardia_triggers_alert` — another clean, focused
commit.)