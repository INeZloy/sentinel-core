#define _DEFAULT_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "vitals.h"

void emergency_handler(const char* reason) {
    printf(ALERT_RED "<< [!] CRITICAL ALERT: %s" RESET_COLOR, reason);
}

int main() {
    srand(time(NULL));
    printf("--- Sentinel-Core v1.0 [Embedded Mode] ---\n\n");
    for(int i = 0; i < 15; i++) {
        Vitals data = generate_mock_data(i);
        printf("Log [%-10lld] | HR: %3d bpm | Sugar: %5.1f mg/dL | GPS: (%4.1f, %4.1f) ", 
               (long long)data.timestamp, 
               data.heart_rate, 
               data.sugar_level, 
               data.pos.x, 
               data.pos.y);

        analyze_vitals(data, emergency_handler);

        printf("\n");
        usleep(400000);
    }
    printf("\n\nDone.\n");
    return 0;
}