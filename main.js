const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
// const initializeDatabase = require('./database');
const { initializeDatabase, sql } = require('./database');

// Now you can use sql.VarChar, sql.Int, etc., in your input definitions
// const { SerialPort } = require('serialport');






let mainWindow;

function createWindow() {
 
  
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  // configureSerialPort();
}
ipcMain.on('set-menu', (event, role) => {
    setMenuForRole(role);
  });
  ipcMain.on('navigate', (event, page) => {
      mainWindow.loadFile(page);
    });
  

    function setMenuForRole(role) {
      const template = [
        { 
          label: 'Scan Parts',
          click: () => mainWindow.loadFile('scanPartVarient.html') 
        },
        { 
          label: 'Report',
          click: () => mainWindow.loadFile('report.html') 
        },
        { 
          label: 'About Us',
          click: () => mainWindow.loadFile('aboutUs.html') 
        },
        { 
          label: 'Log Out',
          click: () => {
            mainWindow.loadFile('index.html');
            const template = []; 
            const menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu); // Reset the menu        
          }
        }
      ];

// fetch department
ipcMain.on('fetch-department', async (event, { vcode, id, col }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, vcode)
          .input('id', sql.VarChar, id)
          .input('col', sql.VarChar, col)
          .execute('view_all');
      event.reply('department-fetched', { success: true, departments: result.recordset });
      // console.log(result.recordset);
  } catch (error) {
      console.error('Failed to fetch department:', error);
      event.reply('department-fetched', { success: false, error: error.message });
  }
});




ipcMain.on('fetch-part', async (event, { vcode = 'partDropdown', id, col }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, vcode)
          .input('id', sql.VarChar, id)
          .input('col', sql.VarChar, col)
          .execute('view_all');
      event.reply('part-fetched', { success: true, part: result.recordset });
      // console.log(result.recordset);
  } catch (error) {
      console.error('Failed to fetch part:', error);
      event.reply('part-fetched', { success: false, error: error.message });
  }
});


ipcMain.on('fetch-varient', async (event, { vcode = 'fetchVarient', id ='n', col ='' }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, vcode)
          .input('id', sql.VarChar, id)
          .input('col', sql.VarChar, col)
          .execute('view_all');
      event.reply('varient-fetched', { success: true, varient: result.recordset });
      // console.log('varient-fetched', result.recordset);
  } catch (error) {
      console.error('Failed to fetch varient:', error);
      event.reply('varient-fetched', { success: false, error: error.message });
  }
});

ipcMain.on('fetch-report-data', async (event, data) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, data.vcode)
          .input('id', sql.VarChar, data.id)
          .input('col', sql.VarChar, data.col)
          .execute('view_all');
      
      const reportData = result.recordset;

      // Initialize variables to store aggregated data
      let totalAllOk = 0;
      let totalAllNotOk = 0;
      const statusCounts = [];
      const controlItems = [];
      const contents = [];
      const checkMethods = [];
      const totalScansToday = [];
      const totalScansYesterday = [];
      const totalScansDayBefore = [];

      // Process each record
      reportData.forEach(record => {
          // Split and count status
          const statuses = record.status.split(',').map(s => s.trim());
          statusCounts.push(statuses.length);
      

          // Aggregate scan counts
          totalScansToday.push(record.total_scans_today);
          totalScansYesterday.push(record.total_scans_yesterday);
          totalScansDayBefore.push(record.total_scans_day_before);
        

          // Aggregate total_all_ok and total_not_ok
          totalAllOk += record.total_all_ok;
          totalAllNotOk += record.total_not_ok;
        
      });

      // Send the aggregated data back to the renderer process
      event.reply('report-data-fetched', {
          success: true,
          report: reportData,
          statusCounts,
          controlItems,
          contents,
          checkMethods,
          totalScansToday,
          totalScansYesterday,
          totalScansDayBefore,
          totalAllOk,
          totalAllNotOk
      });

  } catch (error) {
      console.error('Failed to fetch report data:', error);
      event.reply('report-data-fetched', { success: false, error: error.message });
  }
});




ipcMain.on('check-duplicate', async (event, { vcode, id, col }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, vcode)
          .input('id', sql.VarChar, id)
          .input('col', sql.VarChar, col)
          .execute('view_all');
      const isDuplicate = result.recordset[0].isDuplicate === 1;
      event.reply('duplicate-checked', { success: true, isDuplicate });
  } catch (error) {
      console.error('Failed to check duplicate:', error);
      event.reply('duplicate-checked', { success: false, error: error.message });
  }
});


ipcMain.on('fetch-report-data', async (event, data) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, data.vcode)
          .input('id', sql.VarChar, data.id)
          .input('col', sql.VarChar, data.col)
          .execute('view_all');
      event.reply('report-data-fetched', { success: true, report: result.recordset });
      // console.log('report-data-fetched', result.recordset);
  } catch (error) {
      console.error('Failed to fetch report data:', error);
      event.reply('report-data-fetched', { success: false, error: error.message });
  }
});

ipcMain.on('update-status', async (event, { partName, paramName, newStatus, index }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('part_name', sql.VarChar, partName)
          .input('param_name', sql.VarChar, paramName)
          .input('new_status', sql.VarChar, newStatus)
          .input('index', sql.Int, index)
          .execute('UpdateStatusByParameter');
      const updatedStatus = result.recordset[0].updatedStatus;
      event.reply('status-updated', { success: true, updatedStatus });
  } catch (error) {
      console.error('Failed to update status:', error);
      event.reply('status-updated', { success: false, error: error.message });
  }
});

// fetch parametre for given part or part and spring 
ipcMain.on('fetch-parametre', async (event, { vcode, id, col }) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('vcode', sql.VarChar, vcode)
          .input('id', sql.VarChar, id)
          .input('col', sql.VarChar, col)
          .execute('view_all');
      event.reply('parametre-fetched', { 
          success: true, 
          parametre: result.recordset,
          count: result.recordset.length 
      });
      // console.log(result.recordset.length);
  } catch (error) {
      console.error('Failed to fetch department:', error);
      event.reply('parametre-fetched', { success: false, error: error.message });
  }
});


ipcMain.on('fetch-parameter-by-varient', async (event, { vcode, id, col }) => {
  const db = await initializeDatabase();
  try {
    const result = await db.request()
      .input('vcode', sql.VarChar, vcode)
      .input('id', sql.VarChar, id)
      .input('col', sql.VarChar, col)
      .execute('view_all');
      event.reply('parameter-by-varient-fetched', { success: true, parametre: result.recordset });
  } catch (error) {
    console.error('Failed to fetch parameter by varient:', error);
    event.reply('parameter-by-varient-fetched', { success: false, error: error.message });
  }
});



ipcMain.on('fetch-split-status-by-part-id', async (event, partId) => {
  const db = await initializeDatabase();
  try {
    const result = await db.request()
      .input('part_id', sql.Int, parseInt(partId, 10)) // Ensure partId is an integer
      .execute('sp_SplitStatusByPartId');

    // Process the result to group by barcode and aggregate status_item
    const groupedData = result.recordset.reduce((acc, record) => {
      if (!acc[record.barcode]) {
        acc[record.barcode] = {
          ...record,
          status_items: [record.status_item]
        };
      } else {
        acc[record.barcode].status_items.push(record.status_item);
      }
      return acc;
    }, {});

    // Convert the grouped data back to an array
    const processedData = Object.values(groupedData);

    event.reply('split-status-by-part-id-fetched', { success: true, data: processedData });
    console.log(processedData);
  } catch (error) {
    console.error('Failed to split status by part ID:', error);
    event.reply('split-status-by-part-id-fetched', { success: false, message: error.message });
  }
});



ipcMain.on('fetch-split-status-by-date', async (event, date) => {
  const db = await initializeDatabase();
  try {
      const result = await db.request()
          .input('createdOn', sql.Date, date)
          .execute('GetScannedPartQualityCheckByDate');

      // Process the result to group by barcode and aggregate status_item
      const groupedData = result.recordset.reduce((acc, record) => {
          if (!acc[record.barcode]) {
              acc[record.barcode] = {
                  ...record,
                  status_items: [record.status_item]
              };
          } else {
              acc[record.barcode].status_items.push(record.status_item);
          }
          return acc;
      }, {});

      // Convert the grouped data back to an array
      const processedData = Object.values(groupedData);

      event.reply('split-status-by-date-fetched', { success: true, data: processedData });
  } catch (error) {
      console.error('Failed to fetch data by date:', error);
      event.reply('split-status-by-date-fetched', { success: false, error: error.message });
  }
});



ipcMain.on('save-scan-data', async (event, scanData) => {
  const db = await initializeDatabase();
  try {
      for (const scan of scanData.scans) {
          const result = await db.request()
              .input('part_id', sql.Int, scanData.part_id)
              .input('barcode', sql.VarChar, scan.barcode)
              .input('status', sql.VarChar, scan.statuses.join(', ')) // Join statuses with commas
              .input('created_on', sql.DateTime, new Date())
              .input('created_by', sql.VarChar, currentUserName) // Replace with actual user
              .input('remarks', sql.VarChar, scan.remarks) // Add remarks input
              .input('spring', sql.VarChar, scan.spring) // Add spring input
              .execute('save_scan_data');

          if (result.returnValue === -1) {
              // Duplicate part found, handle accordingly
              event.reply('scan-data-saved', { success: false, error: 'Duplicate part found' });
              return;
          }
      }
      // If no duplicates, proceed with the success response
      event.reply('scan-data-saved', { success: true });
  } catch (error) {
      console.error('Failed to save scan data:', error);
      event.reply('scan-data-saved', { success: false, error: error.message });
  }
});



  //  manage user
  ipcMain.on('manage-user', async (event, { vcode, userId, username, password, role }) => {
    const db = await initializeDatabase();
    try {
        const result = await db.request()
            .input('vcode', sql.VarChar, vcode)
            .input('userId', sql.Int, userId)
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('role', sql.VarChar, role)
            
            .execute('ManageUser');
        event.reply('user-managed', { success: true });
    } catch (error) {
        console.error('Failed to manage user:', error);
        event.reply('user-managed', { success: false, error: error.message });
    }
});

// Remove existing handler before registering a new one
ipcMain.removeHandler('manage-parameter');
ipcMain.handle('manage-parameter', async (event, { action, id, part_id, control_item, status, content, check_method, created_by }) => {
  const db = await initializeDatabase();
  console.log(action, id, part_id, control_item, status, content, check_method, created_by);
  try {
    const request = db.request();
    request.input('action', sql.VarChar, action);
    request.input('id', sql.Int, id);
    request.input('part_id', sql.VarChar, part_id);
    request.input('control_item', sql.VarChar, control_item);
    request.input('status', sql.VarChar, status);
    request.input('content', sql.VarChar, content);
    request.input('check_method', sql.VarChar, check_method);
    request.input('created_on', sql.DateTime, new Date());
    request.input('created_by', sql.VarChar, created_by);
    const result = await request.execute('ManageParameter');
    return { success: true, message: 'Operation successful', data: result.recordset };
    
  } catch (error) {
    console.error('Failed to manage parameter:', error);
    throw new Error('Failed to manage parameter: ' + error.message);
  }
});


    ipcMain.on('open-new-item', (event) => {
      mainWindow.loadFile('newItem.html');
    });
    console.log(role );
    if (role === 'Admin' ) {

      // Agar role 'Admin' hai, toh 'New Items' aur 'Manage User' ko menu mein add karenge
      template.unshift(
        { 
          label: 'Master Data Management', 
          click: () => mainWindow.loadFile('masterDataManagement.html') // 'Manage User' pe click karne par users.html load hoga
        },
        { 
          label: 'Manage User', 
          click: () => mainWindow.loadFile('users.html') // 'Manage User' pe click karne par users.html load hoga
        },
        { 
          label: 'Dashboard', 
          click: () => mainWindow.loadFile('dashboard.html') // 'Manage User' pe click karne par users.html load hoga
        },
      );
    }
    
  
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
 
  app.whenReady().then(createWindow);
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


  let currentUserId = null; // Global variable to store the user ID
  let currentUserName = null; // Global variable to store the user ID

  ipcMain.on('login-attempt', async (event, { username, password }) => {
    // Hardcoded credentials for super admin
    const superAdminUsername = 'superadmin';
    const superAdminPassword = 'superadmin';

    if (username === superAdminUsername && password === superAdminPassword) {
      event.reply('login-response', { success: true, role: 'Admin', userId: 0 });
      return;
    }

    const db = await initializeDatabase();
    try {
      const request = db.request();
      request.input('in_username', sql.VarChar, username);
      request.input('in_password', sql.VarChar, password);

      const result = await request.execute('verify_user');
     

      console.log(result.recordset);

      const user = result.recordset[0];
      if (user) {
        currentUserId = user.id; // Store the user ID globally
        currentUserName = user.username; // Store the user ID globally
        console.log(currentUserName);
        event.reply('login-response', { success: true, role: user.roles, userId: user.id });
      } else {
        event.reply('login-response', { success: false, error: 'Invalid credentials' });
      }
    } catch (error) {
      event.reply('login-response', { success: false, error: error.message });
    }
  });


  
  
  
  
  


  ipcMain.handle('manage-varient', async (event, { action, id, varient_name, part, spring, bin_quantity }) => {
    const db = await initializeDatabase();
    const created_on = new Date().toISOString();
    const created_by = "me"; // Replace with actual user ID if available
    // console.log('Received data:', { action, id, varient_name, part, spring });
  
    // Validate the received data
    if (!action) {
      const errorMessage = 'Action is required';
      console.error(errorMessage, { action });
      return { success: false, message: errorMessage };
    }
  
    if (action !== 'delete' && (!varient_name || !part || (varient_name === 'front' && !spring))) {
      const errorMessage = 'Missing required fields';
      console.error(errorMessage, { action, id, varient_name, part, spring });
      return { success: false, message: errorMessage };
    }
  
    if (action === 'update' || action === 'delete') {
      if (!id) {
        const errorMessage = 'ID is required for update and delete actions';
        console.error(errorMessage, { action, id });
        return { success: false, message: errorMessage };
      }
    }
  
    try {
      const request = db.request();
      request.input('action', sql.VarChar, action);
      request.input('id', sql.Int, id || null); // Ensure id is a valid string or null
      request.input('varient_name', sql.VarChar, varient_name);
      request.input('part', sql.VarChar, part);
      request.input('spring', sql.VarChar, spring || null); // Handle spring as null for rear variants
      request.input('created_on', sql.VarChar, created_on);
      request.input('created_by', sql.VarChar, created_by);
      request.input('bin_quantity', sql.Int, bin_quantity);
      const result = await request.execute('ManageVarient');
      // console.log('Database response:', result);
      return { success: true, message: 'Operation successful', data: result.recordset };
    } catch (error) {
      console.error('Failed to manage varient:', error);
      return { success: false, message: 'Failed to manage varient: ' + error.message };
    }
  });



ipcMain.on('fetch-users', async (event) => {
  const db = await initializeDatabase();
  try {
    const request = db.request();
    const result = await request.execute('fetchUser');
    if (result.recordset.length > 0) {
      event.reply('users-fetched', result.recordset);
    } else {
      event.reply('users-fetched', { success: false, message: 'No users found.' });
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
    event.reply('users-fetched', { success: false, error: error.message });
  }
});


ipcMain.on('get-report-data', async (event) => {
  const db = await initializeDatabase();
  try {
    const request = db.request();
    const result = await request.execute('GetReport'); // Ensure 'GetReport' is the correct stored procedure name
    event.reply('get-report-data', result.recordset);
  } catch (error) {
    console.error('Failed to fetch report data:', error);
    event.reply('get-report-data', { error: error.message });
  }
});


//   const db = await initializeDatabase();
//   try {
//     const request = db.request();
//     request.input('productName', sql.VarChar, productName); // Ensure the parameter name matches
//     const result = await request.execute('fetchItems');
//     if (result.recordset.length > 0) {
//       return result.recordset; // Return the full recordset if items are found
//     } else {
//       return { success: false, message: 'No items found for this product.' };
//     }
//   } catch (error) {
//     console.error('Failed to fetch items:', error);
//     throw new Error('Failed to fetch items: ' + error.message);
//   }
// });

// ipcMain.handle('manage-product', async (event, { action, productId, productName }) => {
//   const db = await initializeDatabase();
//   try {
//     const request = db.request();
//     request.input('action', sql.VarChar, action);
//     request.input('productId', sql.Int, productId);
//     request.input('productName', sql.VarChar, productName);
//     const result = await request.execute('ManageProduct');
//     return { success: true, message: 'Operation successful', data: result.recordset };
//   } catch (error) {
//     console.error('Failed to manage product:', error);
//     throw new Error('Failed to manage product: ' + error.message);
//   }
// });
   
// ipcMain.handle('manage-item', async (event, { action, itemId, productId, itemName, barcode }) => {
//   const db = await initializeDatabase();
//   try {
//     const request = db.request();
//     request.input('action', sql.VarChar, action);
//     request.input('itemId', sql.Int, itemId);
//     request.input('productId', sql.Int, productId);
//     request.input('itemName', sql.VarChar, itemName);
//     request.input('barcode', sql.VarChar, barcode);
//     const result = await request.execute('ManageItem');
//     return { success: true, message: 'Operation successful', data: result.recordset };
//   } catch (error) {
//     console.error('Failed to manage item:', error);
//     throw new Error('Failed to manage item: ' + error.message);
//   }
// });




// ipcMain.handle('sequence-completed', async (event, { selectedProductId, scan_status }) => {
//   const db = await initializeDatabase();
//   const userId = currentUserId; // Use the globally stored user ID

//   const scanDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
//   try {
//     const request = db.request();
//     request.input('ProductId', sql.Int, selectedProductId);
//     request.input('UserId', sql.Int, userId);
//     request.input('ScanDate', sql.DateTime, scanDate);
//     request.input('ScanStatus', sql.VarChar, scan_status);
//     const result = await request.execute('InsertScanRecord');
//     return { success: true, message: 'Scan record inserted successfully', data: result.recordset };
//   } catch (error) {
//     console.error('Failed to insert scan record:', error);
//     return { success: false, message: error.message };
//   }
// });


// ipcMain.handle('get-scan-records', async (event, { action, filter }) => {
//   console.log("Received IPC call for get-scan-records with:", action, filter);
//   try {
//     const db = await initializeDatabase();
//     const request = db.request();
//     request.input('Action', sql.VarChar, action);
//     request.input('Filter', sql.VarChar, filter);
//     const result = await request.execute('GetScanRecords');
//     event.reply('get-scan-records-response', { success: true, records: result.recordset });
//   } catch (error) {
//     console.error('Failed to fetch scan records:', error);
//     event.reply('get-scan-records-response', { success: false, message: error.message });
//   }
// });

// ipcMain.handle('get-scan-records', async (event, { action, filter }) => {
//   console.log("Sending request for records");
//   window.electron.send('get-scan-records', { action, filter });

//   window.electron.receive('get-scan-records-response', (response) => {
//       console.log("Received data from main process:", response);
//   });
// });

// ipcMain.handle('get-scan-record', async (event) => {
//   const db = await initializeDatabase();
//   const [records] = await db.query('CALL GetScanRecords()');
//   return records;
// });
// });
// });