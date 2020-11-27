'use strict';
const resultService = require('./result-service');

const serviceDef = {
  getDispatchedVlResults: getDispatchedVlResults
};

function getDispatchedVlResults(lab,startDate,endDate) {

   const dispatched = 1;
   const testType = 2;

  return new Promise((resolve,reject) => {

   

  resultService.getAllResultsFromEid(lab,testType,dispatched,startDate,endDate)
    .then((result) => {
      console.log('getDispatchedVlResults .. successfull', result);
      resolve('success');

    }).catch((error) => {
      console.log('getDispatchedVlResults .. failed', error);
      reject('error');
    });

});
}

module.exports = serviceDef;
