CC=gcc
CXX=g++
CFLAGS=-c -Wall

all: clean server-thread

server-thread:
	$(CXX) -o $@ $@.cpp -lpthread

.PHONY: clean
clean:
	rm -rf server-thread