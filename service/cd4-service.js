'use strict';
const resultService = require('./result-service');

const serviceDef = {
  getDispatchedCD4Results: getDispatchedCD4Results
};

function getDispatchedCD4Results(lab,startDate,endDate) {

   const dispatched = 1;
   const testType = 3;

  return new Promise((resolve,reject) => {

   

  resultService.getAllResultsFromEid(lab,testType,dispatched,startDate,endDate)
    .then((result) => {
      console.log('getDispatchedCD4Results .. successfull', result);
      resolve('success');

    }).catch((error) => {
      console.log('getDispatchedCD4Results .. failed', error);
      reject(error);
    });

});
}

module.exports = serviceDef;
