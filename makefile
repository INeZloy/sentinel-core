CC = gcc
CFLAGS = -Wall -Wextra -Werror -std=c11
TARGET = sentinel
TEST_BIN = runner_tests

all: $(TARGET)

$(TARGET): main.o vitals.o
	$(CC) $(CFLAGS) main.o vitals.o -o $(TARGET)

test: tests.o vitals.o
	$(CC) $(CFLAGS) tests.o vitals.o -o $(TEST_BIN)
	./$(TEST_BIN)

clean:
	rm -f *.o $(TARGET) $(TEST_BIN)