# EID Sync Service
EID Sync service fetches data from EID Labs API i.e AMPATH and Alupe
at defined times and saves the person uuid's to the eid sync queue

## Project set up
1. Fork the project
2. Clone the project
3. Create a conf folder in the root directory with config.json file with the following configuration

```json

{
  "hivLabSystem": {
    "ampath": {
      "serverUrl": "",
      "apiKey": ""
    },
    "alupe": {
      "serverUrl": "",
      "apiKey": ""
    }
  },
  "eidQueueTable": {
    "ampath": {
      "queueTable": ""
    },
    "alupe": {
      "queueTable": ""
    }
  },
  "mysql": {
    "connectionLimit": 5,
    "host": "",
    "port": "",
    "user": "",
    "password": "",
    "database": "",
    "multipleStatements": true
  },
  "syncSettings":{
    "eidSyncHr": 14,
    "syncInterval": 6000,
    "scheduledSyncHour": 22
  }
}

```
`eidSyncHr` is the time the service should fetch the patient labs from the Ampath and Alupe EID service.
`syncInterval` is the interval between each sync attempt. Sync will only proceed if the current time matches the eidSyncHr
`scheduledSyncHour` is the time patients with appointments the next day should be put inn the eid sync queue.


## Requirements
1. Node Version 16+
2. Docker

## Getting started
```npm install```
```npm start```

## Building and deployment
```docker build -f Dockerfile -t ampathke/eid-sync-service:<tag> . ```

```docker run --name eid-sync-service -p <port>:<port> -d --restart unless-stopped --mount type=bind,source="/opt/eid-sync-service",target="/usr/src/eid-sync/conf" ampathke/eid-sync-service:<tag>```

