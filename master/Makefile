TARGET=server-thread
CC=gcc
CFLAGS=-c -Wall
# LIBOBJ=server.o client.o common.o

# all: server-thread

server-thread:
	$(CC) -o $@ $@.c -lpthread

# msg_server: msg_server.o $(LIBOBJ)
# 	$(CC) $^ -o $@ -pthread

# %.o: %.c
# 	$(CC) $(CFLAGS) $^ -o $@ -pthread

.PHONY: clean
clean:
# rm -rf *.o
	rm -rf server-thread