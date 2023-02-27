#include <stdio.h>
#include "UILog.h"

UILog::UILog(void)
{
    mUiLogLevel = 0;
}
unsigned int UILog::getUiLogLevel(void)
{
    return mUiLogLevel;
}
void UILog::setUiLogLevel(unsigned int level)
{
    mUiLogLevel = level;
}
void UILog::uiPrintf(unsigned int level, const char *pFile, int line, const char *pFunc, const char *pFormat, ...)
{
    if (mUiLogLevel & level)
    {
        char strColorCode[32], strTagName[32], strTime[32], strHeader[128], strTemp[128];
#if DISPLAY_TICK
            struct timespec time;
            clock_gettime(CLOCK_REALTIME, &time);
            snprintf(strTime, sizeof(strTime), "%02d:%02d:%02d:%03d", (int)(((time.tv_sec)/3600)%12), (int)(((time.tv_sec)%3600)/60), (int)((time.tv_sec)%60), (int)(time.tv_nsec/1000000));
#else
        time_t clock;
        struct tm *pDate = NULL;
        clock = time(0);
        pDate = localtime(&clock);
        snprintf(strTime, sizeof(strTime), "%02d:%02d:%02d", pDate->tm_hour, pDate->tm_min, pDate->tm_sec);
#endif

        switch (level)
        {
        case UILog::ERROR:
            strncpy(strColorCode, C_CODE_F_RED, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "ERROR");
            break;
        case UILog::SYSTEM:
            strncpy(strColorCode, C_CODE_F_GREEN, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "SYSTEM");
            break;
        case UILog::LOG:
            strncpy(strColorCode, C_CODE_F_WHITE, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "LOG");
            break;
        case UILog::EVENT:
            strncpy(strColorCode, C_CODE_F_MAGENTA, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "EVENT");
            break;
        case UILog::CTRL:
            strncpy(strColorCode, C_CODE_F_YELLOW, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "CTRL");
            break;
        case UILog::SERVER:
            strncpy(strColorCode, C_CODE_F_CYAN, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "SERVER");
            break;
        case UILog::CLIENT:
            strncpy(strColorCode, C_CODE_F_YELLOW, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "CLIENT");
            break;
        default:
            strncpy(strColorCode, C_CODE_F_WHITE, sizeof(strColorCode));
            snprintf(strTagName, sizeof(strTagName), "UNKNOWN");
            break;
        }

        //display time
        snprintf(strHeader, sizeof(strHeader), "[%s-%s, %ld|", strTime, strTagName, syscall(__NR_gettid));

        if (pFunc != NULL)
        {
            snprintf(strTemp, sizeof(strTemp), "%s%s", strHeader, (char *)pFunc);
            snprintf(strHeader, sizeof(strHeader), "%s", strTemp);
        }

        if (pFile != NULL)
        {
            char strLine[10];
            snprintf(strLine, sizeof(strLine), "-%.5d", line);
            snprintf(strTemp, sizeof(strTemp), "%s(%s%s)", strHeader, (char *)pFile, (char *)strLine);
            snprintf(strHeader, sizeof(strHeader), "%s", strTemp);
        }

        va_list pVlist;
        va_start(pVlist, pFormat);
        vsnprintf(mStringBuffer, sizeof(mStringBuffer) - 1, pFormat, pVlist);
        printf("%s%s %s\x1b[0m\r\n", strColorCode, strHeader, mStringBuffer);
        va_end(pVlist);
    }
}