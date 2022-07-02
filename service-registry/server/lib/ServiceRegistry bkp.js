const { json } = require('express');
const semver = require('semver');

class ServiceRegistry {
    constructor(log){
        this.log = log;
        this.services = {};
        this.timeout = 30;
    }
    register(name, version, ip, port){
        this.cleanup();
        const key = name+version+ip+port;
        if(!this.services[key]){
            this.services[key] = {};
            this.services[key].timestamp = Math.floor(new Date()/1000);
            this.services[key].ip = ip;
            this.services[key].port = port;
            this.services[key].version = version;
            this.services[key].name = name;
            this.log.debug(`Added service ${name}, version ${version} at ${ip}:${port}`)
            return key;
        }
        this.services[key].timestamp = Math.floor(new Date()/1000);
        this.log.debug(`Updated service ${name}, version ${version} at ${ip}:${port}`)
        return key;
    }

    get(name, version) {
        this.cleanup();
        const candidates = Object.values(this.services)
            .filter(service => service.name === name && semver.satisfies(service.version, version))
        console.log(candidates);
        console.log(candidates[Math.floor(Math.random() * candidates.length)]);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    list() {
        return this.services;
    }

    unregister(name, version, ip, port){
        const key = name+version+ip+port;
        if(this.services[key]){
            delete this.services[key];
            this.log.debug(`Updated service ${name}, version ${version} at ${ip}:${port}`)
        }
        return key;
    }

    cleanup(){
        const now = Math.floor(new Date() / 1000);
        Object.keys(this.services).forEach((key) => {
            if(this.serices[key].timestamp + this.timeout < now){
                this.log.debug(`Removed service ${key}`)
                delete this.services[key];
            }
        })
    }
}

module.exports = ServiceRegistry;