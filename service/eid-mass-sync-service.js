'use strict';
const connection = require('../connection/connnection');
const axios = require('axios');

const def = {
   getPatientFromQueue,
   postUuidToEtlUrl,
   deletePatientFromEidLog,
   deletePatientFromEidQueue,
   saveUuidToEidErrorQueue
};

function getPatientFromQueue(){
  return new Promise((resolve,reject) => {
    const sql = `select * from etl.eid_sync_queue limit 1;`;
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log("Get Patient ", results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  
    });
}

function deletePatientFromEidLog(patientUuId){
  console.log('deletePatientFromEidLog... called', patientUuId);
  return new Promise((resolve,reject) => {
    const sql = `delete from etl.eid_sync_log where person_uuid = "${patientUuId}";`;
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log("Deleted patient log eid sync log ", results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  
    });
}

function deletePatientFromEidQueue(patientUuId){
  console.log('deletePatientFromEidLog... called', patientUuId);
  return new Promise((resolve,reject) => {
    const sql = `delete from etl.eid_sync_queue where person_uuid = "${patientUuId}";`;
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log("Deleted patient log eid sync log ", results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  
    });
}

function saveUuidToEidErrorQueue(patientUuId){
  console.log('deletePatientFromEidLog... called', patientUuId);
  return new Promise((resolve,reject) => {
    const sql = `replace into etl.eid_sync_queue_backup values("${patientUuId}");`;
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log("Saved patient to error queue ", results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  
    });
}

function postUuidToEtlUrl(patientUuId){
  return new Promise((resolve,reject) => {
  const payload = {
    'startDate': '2021-01-01',
    'endDate': '2021-05-03',
    'patientUuId': patientUuId,
    'mode': 'batch'
  }
  const url = 'https://ngx.ampath.or.ke/etl-latest/etl/patient-lab-orders';

  var config = {
    method: 'get',
    url: `${url}?startDate=${payload.startDate}&endDate=${payload.endDate}&patientUuId=${patientUuId}&mode=batch`,
    headers: { 
      'Authorization': 'Basic Zm1haWtvOkFrYXRzdWtpNDc='
    }
  };

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  resolve('success..');
})
.catch(function (error) {
  console.log(error);
  reject(error);
});

  });

}

module.exports = def;