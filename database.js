const sql = require('mssql');
const { ipcMain } = require('electron');
async function initializeDatabase() {
      const connectionString = "Data Source=localhost,1433;Initial Catalog=scanning_validation_tnco;User Id=rishav;Password=asdf@123;TrustServerCertificate=true;";
  //  const connectionString = "Data Source=BAWINMS001,1433;Initial Catalog=scanning_validation_tnco;User Id=sa;Password=Baw_sql22;TrustServerCertificate=true;";
  
  try {
    const pool = await sql.connect(connectionString);
    console.log('Connected to database!');
    return pool;
  } catch (error) 
  {
    console.error('An error occurred while connecting to the DB:', error);
    ipcMain.emit('db-connection-error', error.message);
    throw error;
  }
}
module.exports = { initializeDatabase, sql };// module.exports = initializeDatabase;


