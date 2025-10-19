import { Sequelize, Model, ModelStatic } from 'sequelize';

export interface ModelDefinition {
  init: (sequelize: Sequelize) => ModelStatic<Model>;
  associate?: (models: Record<string, ModelStatic<Model>>) => void;
}
