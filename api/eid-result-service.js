const axios = require("axios");

const serviceDef = {
  getEidResults: getEidResults
};

function getEidResults(config,payload) {
 
  return new Promise((resolve,reject) => {

    axios({
      method: config.method,
      url: config.url,
      data: payload,
      headers: config.headers,
    })
      .then(function (response) {
        // console.log(response.data);
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });

  });
}

module.exports = serviceDef;