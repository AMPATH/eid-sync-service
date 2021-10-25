"use strict";
const qs = require("qs");
const config = require("../conf/config.json");
const moment = require("moment");
const eidService = require("./eid-service");
const eidResultService = require("../api/eid-result-service");

const serviceDef = {
  getAllResultsFromEid: getAllResultsFromEid,
};

function getAllResults(payload) {
  return new Promise((resolve, reject) => {
    console.log(`Getting Page .. ${payload.page}`);
    const lab = payload.lab;
    const labSystem = config.hivLabSystem[lab];
    const url = labSystem.serverUrl + "/api/function?page=" + payload.page;
    const apiKey = labSystem.apiKey;
    const finalpayload = getResultFinalPayload(payload);

    const configObj = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": apiKey,
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    console.log('configObj', configObj);

    console.log("Final Payload", finalpayload);

    eidResultService
      .getEidResults(configObj, finalpayload)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getResultFinalPayload(payload){
  let finalpayload;
  if(payload.test === 3){
    finalpayload = qs.stringify({
      start_date: payload.startDate,
      end_date: payload.endDate,
      test: payload.test,
      dispatched: payload.dispatched
    });

  }else{

    finalpayload = qs.stringify({
      date_dispatched_start: payload.startDate,
      date_dispatched_end: payload.endDate,
      test: payload.test,
      dispatched: payload.dispatched
    });

  }

  return finalpayload;

}

async function getAllResultsFromEid(
  lab,
  testType,
  dispatched,
  startDate,
  endDate
) {
  let pages = 1;
  let patientIdentifiers = [];
  let orderNumbers = [];
  let payload = {
    page: 1,
    lab: lab,
    test: testType,
    dispatched: dispatched,
    startDate: startDate,
    endDate: endDate,
  };
  for (let i = 1; i < pages + 1; i++) {
    payload.page = i;
    const vl = getAllResults(payload)
      .then(async (result) => {
        // console.log('Success', result);
        pages = result.last_page;
        let results = result.data;
        if (results.length > 0) {
          results.forEach((result) => {
           if(testType === 3){
            orderNumbers.push(result.order_number);
           }else{
            patientIdentifiers.push(result.patient);
           }
          });
        }
        console.log("Results length ...", patientIdentifiers.length);
        console.log("Orders length ...", orderNumbers.length);
        console.log("Pages ...", pages);
      })
      .catch((error) => {
        console.log("Error", error);
      });

    await vl;

    console.log(`Page ${i} done ..`);
  }

  return new Promise((resolve, reject) => {
    eidService
      .saveEidQueue(patientIdentifiers,orderNumbers, lab)
      .then((result) => {
        console.info("Successfully saved to sync queue..");
        resolve(true);
      })
      .catch((error) => {
        reject(false);
      });
  });
}

module.exports = serviceDef;
