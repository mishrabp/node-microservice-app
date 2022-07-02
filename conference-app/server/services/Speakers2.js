const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require('../lib/CircuitBreaker');
const { resourceLimits } = require('worker_threads');
const cb = new CircuitBreaker();

class SpeakersService {
  constructor({serviceRegistryUrl, serviceVersionIdentifier}) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getNames() {
    const {ip, port} = await this.getService('speakers-service');
    //console.log(`Found service IP: ${ip}: ${port}`)
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`
    });
  }

  async getListShort() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`
    });
  }

  async getList() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`
    });
  }

  async getAllArtwork() {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`
    });
  }

  async getSpeaker(shortname) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortname}`
    });
  }

  async getArtworkForSpeaker(shortname) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`
    });
  }

  async getImage(path) {
    const {ip, port} = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`
    });
  }

  async callService(requestOptions) {
    //const response = await axios(requestOptions);
    //return response.data;
    const servicePath = url.parse(requestOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + servicePath).digest('hex');
    let cacheFile = null;
    if(requestOptions.responseType && requestOptions.responseType === 'stream'){
      cacheFile = `${__dirname}/../../_imagecache/${cacheKey}`
    }

    const result = await cb.callService(requestOptions);

    if(!result){
      if(this.cache[cacheKey]) return this.cache[cacheKey];
      if(cacheFile){
        const exists = await fsexists(cacheFille);
        if(exists) return fs.createReadStream(cacheFile);
      }
      return false;
    }
    if (!cacheFile){
      this.cache[cacheKey] = result;
    }else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }
    
    return result;
  }

  async getService(servicename){
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = SpeakersService;
