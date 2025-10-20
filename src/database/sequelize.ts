import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import modelDefinitions from './models';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

export const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  dialect: 'mysql',
  port: Number(DB_PORT),
  logging: false,
});

// Initialize models
modelDefinitions.forEach((definition) => {
  definition.init(sequelize);
});

// Setup associations
modelDefinitions.forEach((definition) => {
  definition.associate?.(sequelize.models);
});
