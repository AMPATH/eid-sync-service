const syncService = require("./service/sync-service");
const moment = require("moment");

let shouldSync = false;

let syncScheduled = false;

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
  if(parseInt(currentHour) === 20){
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

  if(parseInt(currentHour) === 21){
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


startEidLabSync();
