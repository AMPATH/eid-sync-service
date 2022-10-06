const viralLoadService = require("../service/viral-load-service");
const dnaPcrService = require("../service/dna-pcr-service");
const cd4Service = require("../service/cd4-service");
const appointmentService = require('../service/appointments-service');
const moment = require("moment");


const serviceDef = {
  getTodaysAmpathViralLoads: getTodaysAmpathViralLoads,
  getTodaysAlupeViralLoads: getTodaysAlupeViralLoads,
  getTodaysAmpathDnaPcrResults: getTodaysAmpathDnaPcrResults,
  getTodaysAlupeDnaPcrResults: getTodaysAlupeDnaPcrResults,
  getTodaysAmpathCD4Results: getTodaysAmpathCD4Results,
  getTodaysEidLabResults: getTodaysEidLabResults,
  syncScheduledPatients:syncScheduledPatients
};

function getTodaysAmpathViralLoads() {
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    viralLoadService
      .getDispatchedVlResults("ampath", startDate, endDate)
      .then((result) => {
        console.log("GetViralLoads was successfull ..");
        resolve(result);
      })
      .catch((error) => {
        console.log("getViralLoads Error: ", error);
        reject(error);
      });
  });
}

function getTodaysAlupeViralLoads() {
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    viralLoadService
      .getDispatchedVlResults("alupe", startDate, endDate)
      .then((result) => {
        console.log("GetViralLoads was successfull ..");
        resolve(result);
      })
      .catch((error) => {
        console.error("getViralLoads Error: ", error);
        reject(error);
      });
  });
}

function getTodaysAmpathDnaPcrResults() {
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    dnaPcrService
      .getDispatchedDnaPcrResults("ampath", startDate, endDate)
      .then((result) => {
        console.log("GetDNAPCR was successfull ..");
        resolve(result);
      })
      .catch((error) => {
        console.error("getAmpathDnaPcrResults Error: ", error);
        reject(error);
      });
  });
}

function getTodaysAlupeDnaPcrResults() {
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    dnaPcrService
      .getDispatchedDnaPcrResults("alupe", startDate, endDate)
      .then((result) => {
        console.info("getTodaysAlupeDnaPcrResults was successfull ..", result);
        resolve(result);
      })
      .catch((error) => {
        console.log("getTodaysAlupeDnaPcrResults Error: ", error);
        reject(error);
      });
  });
}

function getTodaysAmpathCD4Results() {
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
    cd4Service
      .getDispatchedCD4Results("ampath", startDate, endDate)
      .then((result) => {
        console.log("getTodaysAmpathCD4Results was successfull ..", result);
        resolve(result);
      })
      .catch((error) => {
        console.log("getTodaysAmpathCD4Results Error: ", error);
        reject(error);
      });
  });
}

function syncAmpathScheduledPatients(){
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().add(1, 'day').endOf('day').format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
  appointmentService.syncScheduledPatients(startDate,endDate,'ampath')
  .then((result) => {
      console.log("syncAmpathScheduledPatients was successfull ..", result);
      resolve(result);
  })
  .catch((error) => {
    console.error('Failed to sync ampath scheduled patients...', error);
    resolve(error);
  });

});

}


function syncAlupeScheduledPatients(){
  const startDate = moment().subtract(1,'days').endOf('day').format('YYYY-MM-DD');
  const endDate = moment().add(1, 'day').endOf('day').format("YYYY-MM-DD");
  return new Promise((resolve, reject) => {
  appointmentService.syncScheduledPatients(startDate,endDate,'alupe')
  .then((result) => {
      console.log("syncAlupeScheduledPatients was successfull ..", result);
      resolve(result);
  })
  .catch((error) => {
    console.error('Failed to sync ampath scheduled patients...', error);
    resolve(error);
  });

});

}

function getTodaysEidLabResults() {
  return Promise.allSettled([
    getTodaysAmpathViralLoads(),
    getTodaysAlupeViralLoads(),
    getTodaysAmpathDnaPcrResults(),
    getTodaysAlupeDnaPcrResults(),
    getTodaysAmpathCD4Results()
  ]);
}

function syncScheduledPatients(){
  return Promise.allSettled([
    syncAmpathScheduledPatients(),
    syncAlupeScheduledPatients()
  ]);

}

module.exports = serviceDef;
