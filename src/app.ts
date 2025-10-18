import express from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/api', routes);

dotenv.config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  interface TimeRow extends RowDataPacket {
    now: Date;
  }

  const [rows] = await connection.execute<TimeRow[]>('SELECT NOW() AS now');
  console.log('⏰ Time:', rows[0].now);

  await connection.end();
}

main();

app.listen(PORT, () => {
  console.log('Connected to port ', PORT);
});
