'use strict';
const resultService = require('./result-service');

const serviceDef = {
  getDispatchedDnaPcrResults: getDispatchedDnaPcrResults
};

function getDispatchedDnaPcrResults(lab,startDate,endDate) {

   const dispatched = 1;
   const testType = 1;

  return new Promise((resolve,reject) => {

   

  resultService.getAllResultsFromEid(lab,testType,dispatched,startDate,endDate)
    .then((result) => {
      console.log('getDispatchedDnaPcrResults .. successfull', result);
      resolve('success');

    }).catch((error) => {
      console.log('getDispatchedDnaPcrResults .. failed', error);
      reject(error);
    });

});
}

module.exports = serviceDef;
