var SerialPort = require('serialport').SerialPort;

const configBaudRate = 115200;

var port = new SerialPort({
    path: 'COM0',
    baudRate: configBaudRate,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    autoOpen: false
});
port.on('error', (err) => {
    console.log('[SerialPortAdapter] Error ' + port.path + ': ', err.message);
});

function connect(comPort, openCallback, closeCallback, errorCallback, dataCallback) {
    if (!comPort) {
        console.log('[SerialPortAdapter] [ERROR] comPort is null')
        return
    }
    console.log('[SerialPortAdapter] Try to connect to ' + comPort);
    if (!port.isOpen) {
        connectSerialPort(comPort, openCallback, closeCallback, errorCallback, dataCallback);
    }
    else {
        // close the current port
        port.close((error) => {
            if (error) {
                console.log('[SerialPortAdapter] Error while closing port ' + port.path + ': ' + error);
            } else {
                console.log('[SerialPortAdapter] Closed port ' + port.path);
                connectSerialPort(comPort, openCallback, closeCallback, errorCallback, dataCallback);
            }
        });
    }
}

function connectSerialPort(comPort, openCallback, closeCallback, errorCallback, dataCallback) {
    port = new SerialPort({
        path: comPort,
        baudRate: configBaudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    });
    port.on('open', () => {
        console.log('[SerialPortAdapter] Port ' + port.path + ' is open!');
        openCallback(port.path);
    });

    port.on('close', () => {
        console.log('[SerialPortAdapter] Port ' + port.path + ' is closed!');
        closeCallback(port.path);
    });

    port.on('error', (error) => {
        console.log('[SerialPortAdapter] Error ' + port.path + ': ', error.message);
        errorCallback(port.path, error.message);
    });

    port.on('data', function (data) {
        console.log('[SerialPortAdapter] ' + data.toString());
        dataCallback(port.path, data);
    });
}

function disconnect() {
    if (port.isOpen) {
        port.close((error) => {
            if (error) {
                console.log('[SerialPortAdapter] Error while closing port ' + port.path + ': ' + error);
            }
            else {
                console.log('[SerialPortAdapter] Closed port ' + port.path);
            }
        });
    }
}

function isConnected() {
    return port.isOpen;
}

module.exports = {
    isConnected,
    connect,
    disconnect
};
