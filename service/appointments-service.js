'use strict';
const connection = require("../connection/connnection");
const eidService = require("../service/eid-service");

const service = {
  syncScheduledPatients
}


function syncScheduledPatients(startDate,endDate,lab){

  return new Promise((resolve, reject) => {
  const queueTable = eidService.getEidQueueTable(lab);
  const sql = `replace into etl.${queueTable}(select distinct p.uuid from etl.flat_appointment t1 join amrs.person p on (p.person_id = t1.person_id) where DATE(rtc_date) >= '${startDate}' AND DATE(rtc_date) <= '${endDate}' AND is_clinical = 1 and next_clinical_encounter_datetime IS NULL);`;

  console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log(`Scheduled ${lab} Patients successfully`, results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });

    });

}


module.exports = service;
