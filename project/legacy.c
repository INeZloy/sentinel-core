#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

// ПРИМІТКА ДЛЯ ДОКУМЕНТАЦІЇ: 
// Це перша версія проекту. Тут все звалено в одну купу.
// Немає поділу на логіку та інтерфейс. Важко тестувати.

int main() {
    srand(time(NULL));
    printf("Starting Sentinel-Core (OLD VERSION 0.1)...\n");

    // "Магічні числа" (Bad practice) зашиті прямо в цикл
    for (int i = 0; i < 10; i++) {
        // Симуляція пульсу
        int hr = (rand() % 70) + 50; 
        
        // Симуляція цукру
        float sugar = ((float)rand()/(float)(RAND_MAX)) * 100 + 70;

        printf("Log #%d: HR=%d, Sugar=%.1f ", i, hr, sugar);

        // Жорстко зашита логіка алармів (важко змінити)
        if (hr > 100) {
            printf("!!! ALARM: HEART RATE TOO HIGH !!!\n");
        } else if (hr < 60) {
            printf("!!! ALARM: HEART RATE TOO LOW !!!\n");
        } else if (sugar > 140) {
            printf("!!! ALARM: SUGAR WARNING !!!\n");
        } else {
            printf("[System OK]\n");
        }

        // Затримка (блокує весь потік)
        sleep(1);
    }

    printf("Legacy monitoring finished.\n");
    return 0;
}