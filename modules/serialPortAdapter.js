var uilog = require('../modules/uiLog')
var SerialPort = require('serialport').SerialPort;
var bindings = require("@serialport/bindings");

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
    uilog.log(uilog.Level.ERROR, 'Error ' + port.path + ': ' + err.message);
});

function getPortList(successCallback) {
    bindings.list()
        .then(function (data) {
            let list = [];
            data.forEach(element => {
                let description = '';
                if (element.locationId) {
                    description += element.locationId + ' ';
                }
                if (element.manufacturer) {
                    description += element.manufacturer;
                }
                list.push({ path: element.path, description: description })
            });
            list.sort(function (a, b) {
                if (a.path < b.path) {
                    return -1;
                }
                else if (a.path > b.path) {
                    return 1;
                }
                else {
                    return 0;
                }
            })
            successCallback(list);
        })
        .catch(function (error) {
            uilog.log(uilog.Level.ERROR, 'Cannot read Port List\n\tError: ' + error);
        })
}

function connect(comPort, openCallback, closeCallback, errorCallback, dataCallback) {
    if (!comPort) {
        uilog.log(uilog.Level.ERROR, 'comPort is null')
        return
    }
    uilog.log(uilog.Level.SERIALPORT, 'Try to connect to ' + comPort);
    if (!port.isOpen) {
        connectSerialPort(comPort, openCallback, closeCallback, errorCallback, dataCallback);
    }
    else {
        // close the current port
        port.close((error) => {
            if (error) {
                uilog.log(uilog.Level.ERROR, 'Error while closing port ' + port.path + ': ' + error);
            } else {
                uilog.log(uilog.Level.SERIALPORT, 'Closed port ' + port.path);
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
        uilog.log(uilog.Level.SERIALPORT, 'Port ' + port.path + ' is open!');
        openCallback(port.path);
    });

    port.on('close', () => {
        uilog.log(uilog.Level.SERIALPORT, 'Port ' + port.path + ' is closed!');
        closeCallback(port.path);
    });

    port.on('error', (error) => {
        uilog.log(uilog.Level.ERROR, 'Error ' + port.path + ': ' + error.message);
        errorCallback(port.path, error.message);
    });

    port.on('data', function (data) {
        uilog.log(uilog.Level.SERIALPORT, data.toString());
        dataCallback(port.path, data);
    });
}

function disconnect() {
    if (port.isOpen) {
        port.close((error) => {
            if (error) {
                uilog.log(uilog.Level.ERROR, 'Error while closing port ' + port.path + ': ' + error);
            }
            else {
                uilog.log(uilog.Level.SERIALPORT, 'Closed port ' + port.path);
            }
        });
    }
}

function isConnected() {
    return port.isOpen;
}

function getPath() {
    return port.isOpen ? port.path : '';
}

module.exports = {
    getPortList,
    connect,
    disconnect,
    isConnected,
    getPath
};
