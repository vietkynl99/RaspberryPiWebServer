const os = require('os');

function getCPUUsage() {
    // Take the first CPU, considering every CPUs have the same specs
    // and every NodeJS process only uses one at a time.
    const cpus = os.cpus();
    const cpu = cpus[0];

    // Accumulate every CPU times values
    const total = Object.values(cpu.times).reduce(
        (acc, tv) => acc + tv, 0
    );

    // Normalize the one returned by process.cpuUsage() 
    // (microseconds VS miliseconds)
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 100;

    // Find out the percentage used for this specific CPU
    return Math.round(currentCPUUsage / total * 100);
}

function getMemoryUsage() {
    return Math.round((1 - os.freemem() / os.totalmem()) * 100);
}

function getTotalMemoryUsage() {
    return ((os.totalmem() - os.freemem) / Math.pow(2, 30)).toFixed(2);
}

function getTotalMemory() {
    return (os.totalmem() / Math.pow(2, 30)).toFixed(2);
}

function getEthernetIP() {
    const interfaces = os.networkInterfaces();
    let ipList = '';

    for (const interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (const address of interface) {
            if (address.family === 'IPv4') {
                ipList += '\r\n' + interfaceName + ': ' + address.address;
            }
        }
    }

    return ipList.trim();
}

module.exports = {
    getCPUUsage,
    getMemoryUsage,
    getTotalMemoryUsage,
    getTotalMemory,
    getEthernetIP
}