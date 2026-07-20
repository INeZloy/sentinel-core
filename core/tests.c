/*
 * Unit tests for Sentinel Core, using the CMocka testing framework
 * (https://cmocka.org/). Build/CI needs: libcmocka-dev
 *
 *   gcc -std=c11 -D_DEFAULT_SOURCE tests.c vitals.c -lcmocka \
 *       -Wl,--wrap=fopen -o tests
 *   ./tests
 */

#include <stdarg.h>
#include <stddef.h>
#include <setjmp.h>
#include <cmocka.h>
#include <string.h>
#include "vitals.h"

/* ---------------------------------------------------------------------
 * Mock alert plugin: a real test double. Instead of just counting calls,
 * it records the reason string it was called with, so tests can assert
 * on *which* alert fired, not just that "something" fired.
 * ------------------------------------------------------------------- */
static char last_alert_reason[64];
static int  alert_call_count;

static void mock_alert_plugin(const char *reason) {
    alert_call_count++;
    strncpy(last_alert_reason, reason, sizeof(last_alert_reason) - 1);
    last_alert_reason[sizeof(last_alert_reason) - 1] = '\0';
}

static void reset_mock(void) {
    alert_call_count = 0;
    last_alert_reason[0] = '\0';
}

/* ---------------------------------------------------------------------
 * Test 1: high heart rate must trigger exactly one TACHYCARDIA alert.
 * ------------------------------------------------------------------- */
static void test_tachycardia_triggers_alert(void **state) {
    (void)state;
    reset_mock();

    Vitals high_hr = { .heart_rate = 150, .sugar_level = 80.0f };
    analyze_vitals(high_hr, mock_alert_plugin);

    assert_int_equal(alert_call_count, 1);
    assert_string_equal(last_alert_reason, "TACHYCARDIA_EVENT");
}

/* ---------------------------------------------------------------------
 * Test 2: high sugar must trigger exactly one HYPERGLYCEMIA alert.
 * ------------------------------------------------------------------- */
static void test_hyperglycemia_triggers_alert(void **state) {
    (void)state;
    reset_mock();

    Vitals high_sugar = { .heart_rate = 70, .sugar_level = 200.0f };
    analyze_vitals(high_sugar, mock_alert_plugin);

    assert_int_equal(alert_call_count, 1);
    assert_string_equal(last_alert_reason, "HYPERGLYCEMIA_WARNING");
}

/* ---------------------------------------------------------------------
 * Test 3: normal vitals must NOT trigger any alert.
 * This is the negative case the previous single-assert "test" never
 * covered — without it, a bug that fires an alert on every input would
 * still pass.
 * ------------------------------------------------------------------- */
static void test_normal_vitals_no_alert(void **state) {
    (void)state;
    reset_mock();

    Vitals normal = { .heart_rate = 75, .sugar_level = 90.0f };
    analyze_vitals(normal, mock_alert_plugin);

    assert_int_equal(alert_call_count, 0);
}

/* ---------------------------------------------------------------------
 * Test 4: both thresholds breached at once -> two separate alerts.
 * ------------------------------------------------------------------- */
static void test_both_thresholds_trigger_two_alerts(void **state) {
    (void)state;
    reset_mock();

    Vitals critical = { .heart_rate = 160, .sugar_level = 200.0f };
    analyze_vitals(critical, mock_alert_plugin);

    assert_int_equal(alert_call_count, 2);
}

/* ---------------------------------------------------------------------
 * Test 5 (exception / error-path test): export_to_json must handle a
 * failing fopen() gracefully instead of crashing or writing garbage.
 * We use CMocka's linker wrapping to mock fopen() itself and force the
 * error path that is otherwise never exercised.
 * ------------------------------------------------------------------- */
extern FILE *__real_fopen(const char *path, const char *mode);
FILE *__wrap_fopen(const char *path, const char *mode) {
    check_expected_ptr(path);
    (void)mode;
    return NULL; /* simulate: disk full / permission denied / bad path */
}

void export_to_json(Vitals v); /* declared in vitals.c, not yet in vitals.h */

static void test_export_json_handles_fopen_failure(void **state) {
    (void)state;

    expect_string(__wrap_fopen, path, "../dashboard/public/data.json");

    Vitals v = { .heart_rate = 80, .sugar_level = 100.0f };
    /* Must not crash / abort when fopen fails. */
    export_to_json(v);
}

int main(void) {
    const struct CMUnitTest tests[] = {
        cmocka_unit_test(test_tachycardia_triggers_alert),
        cmocka_unit_test(test_hyperglycemia_triggers_alert),
        cmocka_unit_test(test_normal_vitals_no_alert),
        cmocka_unit_test(test_both_thresholds_trigger_two_alerts),
        cmocka_unit_test(test_export_json_handles_fopen_failure),
    };
    return cmocka_run_group_tests(tests, NULL, NULL);
}