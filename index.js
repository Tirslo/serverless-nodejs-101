const { Client } = require('pg');
const pgUser = process.env.PG_USER
const pgPass = process.env.PG_PASS
const pgHost = process.env.PG_HOST
const pgPort = process.env.PG_PORT
module.exports.handler = async (event) => {

  //Periodic Time Delay
  const delayInSeconds = Math.floor(Math.random() * 5);
  console.log(`Delaying processing for ${delayInSeconds} seconds.`);
  await new Promise(resolve => setTimeout(resolve, delayInSeconds * 1000));


  // fail the function randomly 
  if (Math.floor(Math.random() * 5) === 0) {
    const errorMessage = 'Forced Fail'
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const client = new Client({
    user: pgUser,
    password: pgPass,
    host: pgHost,
    port: pgPort, // or the port number of your PostgreSQL RDS instance
    database: 'gaming', // the name of your database
  });

  await client.connect();
  console.log('Connected to PostgreSQL database');
  if (event.httpMethod === 'GET') {
    const result = await client.query('SELECT * FROM Games;');

    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: result.rows,
        },
        null,
        2
      ),
    };
  }

  if (event.httpMethod === 'POST') {
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'posted',
        },
        null,
        2
      ),
    };
  }

  return {
    statusCode: 418,
    body: JSON.stringify({
      message: 'nah fam'
    },null, 2)
  }
};
