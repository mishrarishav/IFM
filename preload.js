// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld(
//   'electron',
//   {
//     send: (channel, data) => {
//         console.log(`Sending message on channel: ${channel}`); 
//         let validChannels = ['get-report-data','login-attempt', 'set-menu', 'navigate',
//          'fetch-users'  ,'fetch-department', 'fetch-parametre', 'manage-user', 'fetch-products', 'manage-item',
//           'list-serial-ports', 'open-and-write-serial-port', 
//           'send-command-to-serial-port', 'sequence-completed',
//            'insert-scan-record', 'fetch-items']; 
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data);
//         }
//     },
//     receive: (channel, func) => {
//         console.log(`Setting up receiver for channel: ${channel}`);
//         let validChannels = ['get-report-data','login-response', 'users-fetched', 
//         'department-fetched', 'parametre-fetched', 'products-fetched', 'item-managed', 'ports-listed', 'command-sent',
//          'sequence-status-updated', 'insert-scan-record', 'items-fetched', 'get-scan-records-response', 'db-connection-error']; // Ensure 'db-connection-error' is included
//         if (validChannels.includes(channel)) {
//             ipcRenderer.on(channel, (event, ...args) => func(...args));
//         }
//     },
//     invoke: (channel, data) => {
//         let validChannels = ['fetch-products', 'manage-item', 'manage-product',
//          'fetch-items', 'list-serial-ports', 'open-and-write-serial-port', 
//          'send-command-to-serial-port', 'insert-scan-record', 'sequence-completed',
//           'get-report-data', 'get-scan-records']; 
//         if (validChannels.includes(channel)) {
//             return ipcRenderer.invoke(channel, data);
//         }
//     }
//   }
// );
// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld(
//   'electron',
//   {
//     send: (channel, data) => {
//         console.log(`Sending message on channel: ${channel}`); 
//         let validChannels = ['get-report-data','login-attempt', 'set-menu', 'navigate',
//          'fetch-users'  ,'fetch-department', 'fetch-parametre', 'fetch-part', 'manage-user', 'fetch-products', 'manage-item',
//           'list-serial-ports', 'open-and-write-serial-port', 
//           'send-command-to-serial-port', 'sequence-completed',
//            'insert-scan-record', 'fetch-items', 'fetch-varient']; 
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data);
//         }
//     },
//     receive: (channel, func) => {
//         console.log(`Setting up receiver for channel: ${channel}`);
//         let validChannels = ['get-report-data','login-response', 'users-fetched', 
//         'department-fetched', 'parametre-fetched', 'part-fetched', 'products-fetched', 'item-managed', 'ports-listed', 'command-sent',
//          'sequence-status-updated', 'insert-scan-record', 'items-fetched', 'get-scan-records-response', 'db-connection-error', 'varient-fetched']; // Ensure 'db-connection-error' is included
//         if (validChannels.includes(channel)) {
//             ipcRenderer.on(channel, (event, ...args) => func(...args));
//         }
//     },
//     invoke: (channel, data) => {
//         let validChannels = ['fetch-products', 'manage-item', 'manage-product',
//          'fetch-items', 'list-serial-ports', 'open-and-write-serial-port', 
//          'send-command-to-serial-port', 'insert-scan-record', 'sequence-completed',
//           'get-report-data', 'get-scan-records', 'manage-varient', 'manage-parameter']; // Add 'manage-parameter' here
//         if (validChannels.includes(channel)) {
//             return ipcRenderer.invoke(channel, data);
//         }
//     }
//   }
// );




const { contextBridge, ipcRenderer } = require('electron');

// ... existing code ...

contextBridge.exposeInMainWorld(
    'electron',
    {
      send: (channel, data) => {
          console.log(`Sending message on channel: ${channel}`); 
          let validChannels = ['get-report-data','login-attempt', 'set-menu', 'navigate',
           'fetch-users'  ,'fetch-department', 'fetch-parametre', 'fetch-part', 'manage-user', 'fetch-products', 'manage-item',
            'list-serial-ports', 'open-and-write-serial-port', 
            'send-command-to-serial-port', 'sequence-completed',
             'insert-scan-record', 'fetch-items', 'fetch-varient','manage-varient', 'save-scan-data', 'fetch-report-data','check-duplicate','update-status','fetch-report-data','fetch-split-status-by-part-id']; 
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
      },
      receive: (channel, func) => {
          console.log(`Setting up receiver for channel: ${channel}`);
          let validChannels = ['get-report-data','login-response', 'users-fetched', 
          'department-fetched', 'parametre-fetched', 'part-fetched', 'products-fetched', 'item-managed', 'ports-listed', 'command-sent',
           'sequence-status-updated', 'insert-scan-record', 'items-fetched', 'get-scan-records-response', 'db-connection-error', 'varient-fetched','varient-managed','scan-data-saved', 'report-data-fetched','duplicate-checked','status-updated','report-data-fetched','split-status-by-part-id-fetched']; // Ensure 'db-connection-error' is included
          if (validChannels.includes(channel)) {
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
      },
      invoke: (channel, data) => {
          let validChannels = ['fetch-products', 'manage-item', 'manage-product',
           'fetch-items', 'list-serial-ports', 'open-and-write-serial-port', 
           'send-command-to-serial-port', 'insert-scan-record', 'sequence-completed',
            'get-report-data', 'get-scan-records', 'manage-varient', 'manage-parameter']; // Add 'manage-parameter' here
          if (validChannels.includes(channel)) {
              return ipcRenderer.invoke(channel, data);
          }
      }
    }
  );
  
  // ... existing code ...

// contextBridge.exposeInMainWorld(
//   'electron',
//   {
//     send: (channel, data) => {
//         console.log(`Sending message on channel: ${channel}`); 
//         let validChannels = ['get-report-data','login-attempt', 'set-menu', 'navigate',
//          'fetch-users'  ,'fetch-department', 'fetch-parametre', 'fetch-part', 'manage-user', 'fetch-products', 'manage-item',
//           'list-serial-ports', 'open-and-write-serial-port', 
//           'send-command-to-serial-port', 'sequence-completed',
//            'insert-scan-record', 'fetch-items', 'fetch-varient','fetch-parametre','manage-varient']; 
//         if (validChannels.includes(channel)) {
//             ipcRenderer.send(channel, data);
//         }
//     },
//     receive: (channel, func) => {
//         console.log(`Setting up receiver for channel: ${channel}`);
//         let validChannels = ['get-report-data','login-response', 'users-fetched', 
//         'department-fetched', 'parametre-fetched', 'part-fetched', 'products-fetched', 'item-managed', 'ports-listed', 'command-sent',
//          'sequence-status-updated', 'insert-scan-record', 'items-fetched', 'get-scan-records-response', 'db-connection-error', 'varient-fetched','varient-managed','parametre-fetched']; // Ensure 'db-connection-error' is included
//         if (validChannels.includes(channel)) {
//             ipcRenderer.on(channel, (event, ...args) => func(...args));
//         }
//     },
//     invoke: (channel, data) => {
//         let validChannels = ['fetch-products', 'manage-item', 'manage-product',
//          'fetch-items', 'list-serial-ports', 'open-and-write-serial-port', 
//          'send-command-to-serial-port', 'insert-scan-record', 'sequence-completed',
//           'get-report-data', 'get-scan-records', 'manage-varient', 'manage-parameter']; // Add 'manage-parameter' here
//         if (validChannels.includes(channel)) {
//             return ipcRenderer.invoke(channel, data);
//         }
//     }
//   }
// );