CC=gcc
CXX=g++
CFLAGS=-c -Wall

all: clean server

server:
	$(CXX) -o output/$@.out src/$@.cpp -lpthread

.PHONY: clean
clean:
	rm -rf output/server