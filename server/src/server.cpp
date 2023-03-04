


#include <stdbool.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include "TCP-IP.cpp"
#include "UILog.cpp"

#define LOCAL_HOST "127.0.0.1"

void *HandleThreadClient(void *socket_desc);

int servSock;
UILog *mUILog;

int main(int argc, char *argv[])
{
    int clntSock;
    struct sockaddr_in cli_addr;
    pthread_t threadID;            /* Thread ID from pthread_create() */
    struct ThreadArgs *threadArgs; /* Pointer to argument structure for thread */
    unsigned int clntLen;          /* Length of client address data structure */

    mUILog = &UILog::getInstance();
    if (mUILog != (UILog *)NULL)
    {
        mUILog->setUiLogLevel(UILog::ALL);
    }

    clntLen = sizeof(cli_addr);

    servSock = CreateTCPServerSocket(PORT);
    UIPRINT(UILog::SERVER, "Starting server...");

    while (1)
    {
        clntSock = AcceptTCPConnection(servSock);

        getpeername(clntSock, (struct sockaddr *)&cli_addr, &clntLen);

        /* Create separate memory for client argument */
        if ((threadArgs = (struct ThreadArgs *)malloc(sizeof(struct ThreadArgs))) == NULL)
            error("malloc() failed");

        threadArgs->clntSock = clntSock;
        threadArgs->addr = inet_ntoa(cli_addr.sin_addr);

        if (pthread_create(&threadID, NULL, HandleThreadClient, (void *)threadArgs) != 0)
            error("pthread_create() failed");

        UIPRINT(UILog::LOG, "New client[%d] Address[%s]", clntSock, inet_ntoa(cli_addr.sin_addr));
    }

    close(servSock);
    return 0;
}

void *HandleThreadClient(void *threadArgs)
{
    int clntSock;
    int recvMsgSize;
    char data[BUFFSIZE];
    char ipAddress[32];

    clntSock = ((struct ThreadArgs *)threadArgs)->clntSock;

    while (1)
    {
        bzero(data, sizeof(data));
        recvMsgSize = recv(clntSock, data, BUFFSIZE, 0);
        if (recvMsgSize < 0)
        {
            UIPRINT(UILog::ERROR, "ERROR reading from socket");
        }
        else 
        {
            strncpy(ipAddress, ((struct ThreadArgs *)threadArgs)->addr, sizeof(ipAddress));
            if (recvMsgSize > 0)
            {
                UIPRINT(UILog::LOG, "Address[%s] message[%s]", ipAddress, data);
            }
            else
            {
                UIPRINT(UILog::LOG, "Address[%s] disconnected", ipAddress);
                break;
            }
        }
    }
    close(clntSock);
    return (void *) NULL;
}