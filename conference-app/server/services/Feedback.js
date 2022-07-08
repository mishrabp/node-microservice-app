/* eslint-disable class-methods-use-this */
const url = require('url');
const axios = require('axios');
const crypto = require('crypto');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

class FeedbackService {
  constructor({ serviceRegistry }) {
    this.serviceRegistryUrl = serviceRegistry.url;
    this.serviceVersionIdentifier = serviceRegistry.versionIdentifier;
    this.serviceProtocol = serviceRegistry.serviceProtocol;
    this.serviceRegistryProtocol = serviceRegistry.serviceRegistryProtocol;
    this.cache = {};
  }

  async getList() {
    const { ip, port } = await this.getService('feedback-service');
    //this.serviceProtocol = "https";
    return this.callService({
      method: 'get',
      url: `${this.serviceProtocol}://${ip}:${port}/list`,
    });
  }

  async callService(requestOptions) {
    const parsedUrl = url.parse(requestOptions.url);
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + parsedUrl.path).digest('hex');

    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      return null;
    }

    this.cache[cacheKey] = result;

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = FeedbackService;
