// @ts-nocheck
const request = require("supertest");

const REQUEST_TIMEOUT = {
  response: 2000,
  deadline: 5000,
};

function createApi(app) {
  return {
    get(path) {
      return request(app).get(path).timeout(REQUEST_TIMEOUT);
    },
    post(path) {
      return request(app).post(path).timeout(REQUEST_TIMEOUT);
    },
    put(path) {
      return request(app).put(path).timeout(REQUEST_TIMEOUT);
    },
    delete(path) {
      return request(app).delete(path).timeout(REQUEST_TIMEOUT);
    },
  };
}

module.exports = {
  createApi,
};
