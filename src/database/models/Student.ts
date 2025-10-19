import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelDefinition } from '../types/model.d';

export class Student extends Model {
  declare id: string;
  declare email: string;
}

const StudentModel: ModelDefinition = {
  init: (sequelize: Sequelize) => {
    Student.init(
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
        modelName: 'Student',
        tableName: 't_students',
      }
    );

    return Student;
  },

  associate: (models) => {
    Student.belongsToMany(models.Teacher, {
      through: models.StudentTeacher,
      foreignKey: 'studentUuid',
      otherKey: 'teacherUuid',
      as: 'teachers',
      onDelete: 'CASCADE',
    });
  },
};
export default StudentModel;
