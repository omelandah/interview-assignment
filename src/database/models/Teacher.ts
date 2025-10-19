import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { ModelDefinition } from '../types/model.d';
import { Student } from './Student';

export class Teacher extends Model {
  declare id: string;
  declare email: string;

  declare addStudents: BelongsToManyAddAssociationsMixin<Student, string>;
  declare getStudents: BelongsToManyGetAssociationsMixin<Student>;
}

const TeacherModel: ModelDefinition = {
  init: (sequelize: Sequelize) => {
    Teacher.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
          field: 'uuid',
        },
        email: {
          type: DataTypes.STRING(56),
          allowNull: false,
          field: 'email',
        },
      },
      {
        sequelize,
        freezeTableName: true,
        modelName: 'Teacher',
        tableName: 't_teachers',
      }
    );
    return Teacher;
  },
  associate: (models) => {
    Teacher.belongsToMany(models.Student, {
      through: models.StudentTeacher,
      foreignKey: 'teacherUuid',
      otherKey: 'studentUuid',
      as: 'students',
      onDelete: 'CASCADE',
    });
  },
};

export default TeacherModel;
