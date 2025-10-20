import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { createDbConnection } from './config/database';
import { swaggerSpec } from './config/swagger.config';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(helmet());

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

dotenv.config();

async function main() {
  const connection = await createDbConnection();

  console.log('Connected to database successfully !');

  await connection.end();
}

main();

app.listen(PORT, () => {
  console.log('Connected to port ', PORT);
});
