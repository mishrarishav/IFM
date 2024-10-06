

const { contextBridge, ipcRenderer } = require('electron');



contextBridge.exposeInMainWorld(
    'electron',
    {
      send: (channel, data) => {
          console.log(`Sending message on channel: ${channel}`); 
          let validChannels = ['get-report-data','login-attempt', 'set-menu', 'navigate',
           'fetch-users'  ,'fetch-department', 'fetch-parametre', 'fetch-part', 'manage-user',
             'open-and-write-serial-port', 
          
             'insert-scan-record',  'fetch-varient','manage-varient', 'save-scan-data', 
             'fetch-report-data','check-duplicate','update-status','fetch-report-data',
             'fetch-split-status-by-part-id','fetch-split-status-by-date','fetch-parameter-by-varient']; 
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
      },
      receive: (channel, func) => {
          console.log(`Setting up receiver for channel: ${channel}`);
          let validChannels = ['get-report-data','login-response', 'users-fetched', 
          'department-fetched', 'parametre-fetched', 'part-fetched',  'item-managed', 'ports-listed', 'command-sent',
           'sequence-status-updated', 'insert-scan-record', 'get-scan-records-response', 'db-connection-error',
            'varient-fetched','varient-managed','scan-data-saved', 'report-data-fetched','duplicate-checked','status-updated',
            'report-data-fetched','split-status-by-part-id-fetched','split-status-by-date-fetched','parameter-by-varient-fetched']; // Ensure 'db-connection-error' is included
          if (validChannels.includes(channel)) {
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
      },
      invoke: (channel, data) => {
          let validChannels = [  'manage-product',
          'open-and-write-serial-port', 
         'insert-scan-record',
            'get-report-data', 'get-scan-records', 'manage-varient', 'manage-parameter']; // Add 'manage-parameter' here
          if (validChannels.includes(channel)) {
              return ipcRenderer.invoke(channel, data);
          }
      }
    }
  );
  
 