#ifndef VITALS_H
#define VITALS_H
#include <time.h>

#define MAX_PULSE 100
#define MIN_PULSE 60
#define MAX_SUGAR 140.0f
#define ALERT_RED "\033[1;31m"
#define RESET_COLOR "\033[0m"

typedef struct { float x; float y; } Location;

typedef struct {
    const int id;
    const int heart_rate;
    const float sugar_level;
    const Location pos;
    const time_t timestamp;
} Vitals;

void analyze_vitals(Vitals v, void (*alert_plugin)(const char* reason));
Vitals generate_mock_data(int id);
#endif