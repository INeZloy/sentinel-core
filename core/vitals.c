#include "vitals.h"
#include <stdlib.h>
#include <stdio.h>

Vitals generate_mock_data(int id) {
    Location current_pos = { (float)rand()/(float)(RAND_MAX/10), (float)rand()/(float)(RAND_MAX/10) };
    Vitals new_data = {
        .id = id,
        .heart_rate = (rand() % 70) + 50,
        .sugar_level = ((float)rand()/(float)(RAND_MAX)) * 100 + 70,
        .pos = current_pos,
        .timestamp = time(NULL)
    };
    return new_data;
}

void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason)) {
    if (v.heart_rate > MAX_PULSE) alert_plugin("TACHYCARDIA_EVENT");
    if (v.sugar_level > MAX_SUGAR) alert_plugin("HYPERGLYCEMIA_WARNING");
}
int export_to_json(Vitals v) {
    const char *path = getenv("SENTINEL_JSON_PATH");
    if (path == NULL) path = "../dashboard/public/data.json";

    FILE *f = fopen(path, "w");
    if (f == NULL) {
        fprintf(stderr, "export_to_json: could not open '%s' for writing\n", path);
        return -1;
    }
    fprintf(f, "{\"heart_rate\": %d, \"sugar\": %.1f, \"timestamp\": %lld}",
            v.heart_rate, v.sugar_level, (long long)v.timestamp);
    fclose(f);
    return 0;
}