CC=gcc
CXX=g++
CFLAGS=-c -Wall

all: clean server

server:
	$(CXX) -o $@ $@.cpp -lpthread

.PHONY: clean
clean:
	rm -rf server