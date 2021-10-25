"use strict";
const connection = require("../connection/connnection");
const config = require('../conf/config.json');
const def = {
  saveEidQueue: saveEidQueue,
  getEidQueueTable
}

function saveEidQueue(identifiersArray,orderNumbers,lab) {
  return new Promise((resolve, reject) => {
    if(identifiersArray.length === 0 && orderNumbers.length === 0){
      reject('No patient to syc');
    }else {

    const identifierString = getArrrayString(identifiersArray);
    const ordersString = getArrrayString(orderNumbers);
    const queueTable = getEidQueueTable(lab);
    let sql = '';
    console.log('QueueTable', queueTable);
    if(orderNumbers.length > 0){
      sql = `replace into etl.${queueTable}(SELECT  distinct p.uuid FROM amrs.orders o join amrs.person p on (p.person_id = o.patient_id) where o.order_number in (${ordersString}));`;
    }else{
      sql = `replace into etl.${queueTable}(SELECT distinct p.uuid FROM amrs.patient_identifier id join amrs.person p on (p.person_id = id.patient_id) where id.identifier in (${identifierString}));`;
    }
    
    console.log("sql", sql);
    connection
      .getConnectionPool()
      .then((pool) => {
        pool.query(sql, function (error, results, fields) {
          if (error) {
            console.log("Error", error);
            reject(error);
          } else {
            console.log("EID Queing successfull: ", results);
            resolve(results);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
    }
  });
}

function getArrrayString(data){
  if(data.length > 0){
     return data.map((d)=> {
       return "'" + d + "'";
     }).toString();
  }else{
      return ["12345-67"].toString();
  }

}


function getEidQueueTable(lab){
  const queueTables = config.eidQueueTable;
  const queueTable = queueTables[lab].queueTable;
  return queueTable;

}

module.exports = def;
