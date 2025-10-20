import express from 'express';
import { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import routes from './routes';
import { createDbConnection } from './config/database';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(helmet());

app.use('/api', routes);

dotenv.config();

async function main() {
  const connection = await createDbConnection();

  interface TimeRow extends RowDataPacket {
    now: Date;
  }

  const [rows] = await connection.execute<TimeRow[]>('SELECT NOW() AS now');
  console.log('Connected to db - ⏰ Time:', rows[0].now);

  await connection.end();
}

main();

app.listen(PORT, () => {
  console.log('Connected to port ', PORT);
});
