const viralLoadService = require("../service/viral-load-service");
const dnaPcrService = require("../service/dna-pcr-service");
const cd4Service = require("../service/cd4-service");
const moment = require("moment");

const serviceDef = {
  getTodaysAmpathViralLoads: getTodaysAmpathViralLoads,
  getTodaysAlupeViralLoads: getTodaysAlupeViralLoads,
  getTodaysAmpathDnaPcrResults: getTodaysAmpathDnaPcrResults,
  getTodaysAlupeDnaPcrResults: getTodaysAlupeDnaPcrResults,
  getTodaysAmpathCD4Results: getTodaysAmpathCD4Results,
  getTodaysEidLabResults: getTodaysEidLabResults,
};

function getTodaysAmpathViralLoads() {
  return new Promise((resolve, reject) => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
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
  return new Promise((resolve, reject) => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
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
  return new Promise((resolve, reject) => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
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
  return new Promise((resolve, reject) => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
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
  return new Promise((resolve, reject) => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().format("YYYY-MM-DD");
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

function getTodaysEidLabResults() {
  return Promise.allSettled([
    getTodaysAmpathViralLoads(),
    getTodaysAlupeViralLoads(),
    getTodaysAmpathDnaPcrResults(),
    getTodaysAlupeDnaPcrResults(),
    getTodaysAmpathCD4Results(),
  ]);
}

module.exports = serviceDef;
