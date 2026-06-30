#include <stdio.h>
#include <assert.h>
#include "vitals.h"

int alerts = 0;
void mock_alert(const char* r) { (void)r; alerts++; }

int main() {
    printf("Testing logic... ");
    Vitals high = { .heart_rate = 150, .sugar_level = 80 };
    analyze_vitals(high, mock_alert);
    assert(alerts == 1);
    printf("PASSED\n");
    return 0;
}