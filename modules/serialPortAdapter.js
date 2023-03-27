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
    console.log('Error ' + port.path + ': ', err.message);
});

function connect(comPort) {
    if (!comPort) {
        console.log('[ERROR] comPort is null')
        return
    }
    console.log('Try to connect to ' + comPort);
    console.log('port.ispoen= ' + port.isOpen);
    if (!port.isOpen) {
        connectSerialPort(comPort);
    }
    else {
        // close the current port
        port.close((error) => {
            if (error) {
                console.log('Error while closing port ' + port.path + ': ' + error);
            } else {
                console.log('Closed port ' + port.path);
                connectSerialPort(comPort);
            }
        });
    }
}

function connectSerialPort(comPort) {
    var port = new SerialPort({
        path: comPort,
        baudRate: configBaudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none'
    });
    port.on('open', () => {
        console.log('Port ' + port.path + ' is open!');
    });

    port.on('close', () => {
        console.log('Port ' + port.path + ' is closed!');
    });

    port.on('error', (err) => {
        console.log('Error ' + port.path + ': ', err.message);
    });

    port.on('data', function (data) {
        console.log(data.toString());
    });
}

function disconnect() {
    if (port.isOpen) {
        port.close((error) => {
            if (error) {
                console.log('Error while closing port ' + port.path + ': ' + error);
            }
            else {
                // do something
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
