const syncService = require("./service/sync-service");
const moment = require("moment");

let shouldSync = false;

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

  },10000)

  
}

function sync(){
  // only sync labs at 8pm
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

startEidLabSync();
