import { Model, ModelStatic, Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import modelDefinitions from './models';

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

export const sequelize = new Sequelize(DB_DATABASE!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  dialect: 'mysql',
  port: Number(DB_PORT),
  logging: false,
});

export const models = modelDefinitions.reduce(
  (acc, def) => {
    const model = def.init(sequelize);
    acc[model.name] = model;
    return acc;
  },
  {} as Record<string, ModelStatic<Model>>
);

// Setup associations
modelDefinitions.forEach((def) => {
  def.associate?.(models);
});
