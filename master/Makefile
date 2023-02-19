CC=gcc
CXX=g++
CFLAGS=-c -Wall

server-thread:
	$(CXX) -o $@ $@.cpp -lpthread

.PHONY: clean
clean:
	rm -rf server-thread