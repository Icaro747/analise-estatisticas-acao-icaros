/* eslint-disable no-useless-catch */
import axios from 'axios';

class Api {
  constructor() {
    this.base_url = 'https://localhost:7091'
  }

  /**
   * Método Request GET
   * @param {String} endpoint endPoint API
   * @param {array} params data
   * @param {String} URL A URL é opcional caso queira fazer uma requisição em outra URL.
   * @returns {json} Promise json
   */
  Get(endpoint, params, URL) {
    try {
      let query = "";
      if (params !== undefined) {
        const nameParams = Object.getOwnPropertyNames(params);

        nameParams.forEach((item, i) => {
          if (i === 0) {
            query = `?${item}=${encodeURIComponent(params[item])}`
          } else {
            query += `&${item}=${encodeURIComponent(params[item])}`
          }
        })
      }

      if (URL !== "" && URL !== undefined) {
        if (query !== "")
          return axios.get(`${URL}${endpoint}${query}`);
        return axios.get(`${URL}${endpoint}`);
      }

      if (query !== "")
        return axios.get(`${this.base_url}${endpoint}${query}`);
      return axios.get(`${this.base_url}${endpoint}`);

    } catch (error) {
      throw error;
    }
  }

  /**
  * Método Request POST
  * @param {string} endpoint endPoint API.
  * @param {json} payload headers data.
  * @param {string} URL A URL é opcional caso queira fazer uma requisição em outra URL
  * @returns {json} Promise json.
  */
  Post(endpoint, payload, URL) {
    try {
      if (URL !== "" && URL !== undefined) {
        return axios.post(`${URL}${endpoint}`, payload);
      }
      return axios.post(`${this.base_url}${endpoint}`, payload)
    } catch (error) {
      throw error;
    }
  }

  /**
   * Método Request PUT
   * @param {string} endpoint endPoint API.
   * @param {json} payload headers data.
   * @param {string} URL A URL é opcional caso queira fazer uma requisição em outra URL
   * @returns {json} Promise json.
   */
  Put(endpoint, payload, URL) {
    try {
      if (URL !== "" && URL !== undefined) {
        return axios.put(`${URL}${endpoint}`, payload);
      }
      return axios.put(`${this.base_url}${endpoint}`, payload)
    } catch (error) {
      throw error;
    }
  }

  Delete(endpoint) {
    try {
      return axios.delete(`${this.base_url}${endpoint}`)
    } catch (error) {
      throw error;
    }
  }
}

export default new Api();
