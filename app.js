const syncService = require("./service/sync-service");
const eidMassSync = require('./service/eid-mass-sync-service');
const moment = require("moment");

let shouldSync = false;

let syncScheduled = false;
let count = 0;
const syncTime = 20;

function startEidLabSync() {

  console.log("start eid lab sync ######################");

  setInterval(()=> {

    const syncLabs = sync();
  
    if(syncLabs) {
        console.log('should sync labs..', syncLabs);
        syncService.getTodaysEidLabResults().then((results) => {
          return results.forEach((result) => {
            console.table('result',[result,result.status]);
            console.log("end eid lab sync ######################");
          });
        });
  
    }else{
        console.log('should not sync labs..', syncLabs);
    }

    const syncRtcPatients = determineScheduledPatientsSync();

    if(syncRtcPatients){

       console.log('syncRtcPatients', syncRtcPatients);
       syncService.syncScheduledPatients()
       .then((results) => {
        return results.forEach((result) => {
          console.table('result',[result,result.status]);
          console.log("end scheduled patients queueing -------------------");
        });
      });

    }else{
      console.log('syncRtcPatients not true', syncRtcPatients);
    }

  },6000)

  
}

function sync(){
  // only sync labs at 7pm
  const currentHour = moment().format('HH');
  console.log('Current hour..', currentHour);
  console.log('shouldSync', shouldSync);
  if(parseInt(currentHour) == syncTime){
      if(shouldSync === false){
           shouldSync = true;
           console.log('shouldSync2', shouldSync);
           return true;
      }else{
           return false;
      }
  }else {
    shouldSync = false;
    return false;
  }
}

function determineScheduledPatientsSync(){

  const currentHour = moment().format('HH');
  console.log('Current hour..', currentHour);

  if(parseInt(currentHour) === 22){
    if(syncScheduled === false){
         console.log('syncVariable true');
         syncScheduled = true;
         return true;
    }else{
         return false;
    }
}else {
  syncScheduled = false;
  return false;
}

}


function startMassSync(){
  console.log('start mass sync #######################################');
  
   eidMassSync.getPatientFromQueue()
   .then((queueResult) => {
     console.log('getPatientFromQueueResult', queueResult);
     const patientUuid = queueResult[0].person_uuid;
     console.log('PatientUuid check', patientUuid);
          eidMassSync.deletePatientFromEidLog(patientUuid)
          .then((result) => {
            console.log('deletePatientFromEidLogResult', result);
                  eidMassSync.postUuidToEtlUrl(patientUuid)
                  .then((result)=> {
                    console.log('postUuidToEtlUrlResult', result);
                    eidMassSync.deletePatientFromEidQueue(patientUuid)
                    .then((result) => {
                      console.log('deletePatientFromEidQueue result', result);
                      count++;
                      console.log('count', count);
                      console.log('end mass sync #######################################');
                      startMassSync();
                    }).catch((error)=> {
                      console.log('deletePatientFromEidQueuerError', error);
                    });
                  }).catch((error)=> {
                    console.log('postUuidToEtlUrlResultError', error);
                     eidMassSync.saveUuidToEidErrorQueue(patientUuid)
                      .then((success) => {
                         console.error('Saved to error queue',success);
                         eidMassSync.deletePatientFromEidQueue(patientUuid)
                            .then((result) => {
                              console.log('deletePatientFromEidQueue result', result);
                              count++;
                              console.log('count', count);
                              console.log('end mass sync #######################################');
                              startMassSync();
                            }).catch((error)=> {
                              console.log('deletePatientFromEidQueuerError', error);
                            });
                          
                      })
                      .catch((error) => {
                        console.log('saveUuidToEidErrorQueue', error);
                      });
                  });

          }).catch((error) => {
              console.log('deletePatientFromEidLogResultError', error);
          });
     
   }).catch((error)=> {
      console.log('getPatientFromQueueResulterror', error);
   });
}


startEidLabSync();
// startMassSync();
