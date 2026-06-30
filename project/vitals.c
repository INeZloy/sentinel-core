#include "vitals.h"
#include <stdlib.h>

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