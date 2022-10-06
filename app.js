const syncService = require("./service/sync-service");
const eidMassSync = require("./service/eid-mass-sync-service");
const moment = require("moment");
const config = require("./conf/config");

let shouldSync = false;

let syncScheduled = false;
const syncTime = config.syncSettings.eidSyncHr;
const syncInterval = config.syncSettings.syncInterval;
const scheduledPatientsSyncHr = config.syncSettings.scheduledSyncHour;
function startEidLabSync() {
  console.log("start eid lab sync ######################");

  setInterval(() => {
    const syncLabs = sync();

    if (syncLabs) {
      syncService.getTodaysEidLabResults().then((results) => {
        return results.forEach((result) => {
          console.table("result", [result, result.status]);
          console.log("end eid lab sync ######################");
        });
      });
    } else {
      console.log("should not sync labs..", syncLabs);
    }

    const syncRtcPatients = determineScheduledPatientsSync();

    if (syncRtcPatients) {
      syncService.syncScheduledPatients().then((results) => {
        return results.forEach((result) => {
          console.table("result", [result, result.status]);
          console.log("end scheduled patients queueing -------------------");
        });
      });
    } else {
      console.log("syncRtcPatients not true", syncRtcPatients);
    }
  }, syncInterval);
}

function sync() {
  // only sync labs at 7pm
  const currentHour = moment().format("HH");
  console.log("Current hour..", currentHour);
  console.log("shouldSync", shouldSync);
  if (parseInt(currentHour) == syncTime) {
    if (shouldSync === false) {
      shouldSync = true;
      console.log("shouldSync2", shouldSync);
      return true;
    } else {
      return false;
    }
  } else {
    shouldSync = false;
    return false;
  }
}

function determineScheduledPatientsSync() {
  /*
   Gets patients who have appointmennts the next day
   and adds them to the eid sync queue
  */
  const currentHour = moment().format("HH");
  if (parseInt(currentHour) === scheduledPatientsSyncHr) {
    if (syncScheduled === false) {
      syncScheduled = true;
      return true;
    } else {
      return false;
    }
  } else {
    syncScheduled = false;
    return false;
  }
}

startEidLabSync();
