#if !defined(UILOG_H)
#define UILOG_H

#include <stdarg.h>
#include <string.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/syscall.h>
#include <asm/unistd.h>

#define USE_ASD_UILOG 1

/* ANSI code
    0:off, 1:bold, 4:underscore, 5:blink, 7:reverse, 8:concealed
    Foreground Color ==> 30:black, 31:red, 32:green, 33:yellow, 34:blue, 35:magenta, 36:cyan, 37:white
    Background Color ==> 40:black, 41:red, 42:green, 43:yellow, 44:blue, 45:magenta, 46:cyan, 47:white
*/
#define C_CODE_RESET                "\033[0m"
#define C_CODE_F_BLACK              "\033[30m"      // Fg:Black
#define C_CODE_F_RED                "\033[31m"      // Fg:Red
#define C_CODE_F_GREEN              "\033[32m"      // Fg:Green
#define C_CODE_F_YELLOW             "\033[33m"      // Fg:Yellow
#define C_CODE_F_BLUE               "\033[34m"      // Fg:Blue
#define C_CODE_F_BRIGHT_BLUE        "\033[94m"      // Fg:Bright Blue
#define C_CODE_F_MAGENTA            "\033[35m"      // Fg:Magenta
#define C_CODE_F_CYAN               "\033[36m"      // Fg:Cyan
#define C_CODE_F_WHITE              "\033[37m"      // Fg:White
#define C_CODE_F_LIGHT_GREEN        "\033[01;32m"   // Fg:Light Green

#define C_CODE_F_WHITE_B_RED        "\033[37;41m"   // Fg:White,    Bg:Red
#define C_CODE_F_BLACK_B_GREEN      "\033[30;42m"   // Fg:Black,    Bg:Green
#define C_CODE_F_BLACK_B_YELLOW     "\033[30;43m"   // Fg:black,    Bg:Yellow
#define C_CODE_F_MAGENTA_B_BLUE     "\033[35;44m"   // Fg:Magenta,  Bg:Blue
#define C_CODE_F_WHITE_B_BLUE       "\033[37;44m"   // Fg:White,    Bg:Blue
#define C_CODE_F_WHITE_B_MAGENTA    "\033[37;45m"   // Fg:White,    Bg:Magenta
#define C_CODE_F_YELLOW_B_MAGENTA   "\033[33;45m"   // Fg:Yellow,   Bg:Magenta
#define C_CODE_F_BLACK_B_CYAN       "\033[30;46m"   // Fg:Black,    Bg:Cyan

#define UIPRINT(LEVEL, ...)	    {UILog::getInstance().uiPrintf(LEVEL, __FILE__, __LINE__, __FUNCTION__, __VA_ARGS__);}
#define DISPLAY_TICK    (0)


class UILog
{
private:
    unsigned int mUiLogLevel;
    char mStringBuffer[512];

public:
    enum LOGLEV
    {
        ERROR   = 0x00000001,
        SYSTEM  = 0x00000002,
        LOG     = 0x00000004,
        EVENT   = 0x00000008,
        CTRL    = 0x00000010,
        SERVER  = 0x00000020,
        CLIENT  = 0x00000040,
        // EMPTY = 0x00000080,
        // EMPTY = 0x00000100,
        // EMPTY = 0x00000200,
        // EMPTY = 0x00000400,
        // EMPTY = 0x00000800,
        // EMPTY = 0x00001000,
        // EMPTY = 0x00002000,
        // EMPTY = 0x00004000,
        // EMPTY = 0x00008000,
        // EMPTY = 0x00010000,
        // EMPTY = 0x00020000,
        // EMPTY = 0x00040000,
        // EMPTY = 0x00080000,
        // EMPTY = 0x00100000,
        // EMPTY = 0x00200000,
        // EMPTY = 0x00400000,
        // EMPTY = 0x00800000,
        // EMPTY = 0x01000000,
        // EMPTY = 0x02000000,
        // EMPTY = 0x04000000,
        // EMPTY = 0x08000000,
        // EMPTY = 0x10000000,
        // EMPTY = 0x20000000,
        // EMPTY = 0x40000000,
        // EMPTY = 0x80000000,
        ALL     = 0xffffffff
    };

private:
    UILog(void);

public:
    static UILog &getInstance(void)
    {
        static UILog inst;
        return inst;
    }
    unsigned int getUiLogLevel(void);
    void setUiLogLevel(unsigned int level);
    void uiPrintf(unsigned int level, const char *pFile, int line, const char *pFunc, const char *pFormat, ...);
};
#endif /*UILOG_H*/
