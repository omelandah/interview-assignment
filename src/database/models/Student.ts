import { Sequelize, DataTypes, Model, Optional, Association } from 'sequelize';
import { ModelDefinition } from '../types/model.d';
import { Teacher } from './Teacher';

interface StudentAttributes {
  id: string;
  email: string;
  isSuspended: boolean;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, 'id'> {}

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  declare id: string;
  declare email: string;
  declare isSuspended: boolean;

  // Association property:
  declare teachers?: Teacher[];

  declare static associations: {
    teachers: Association<Student, Teacher>;
  };
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
        isSuspended: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_suspended',
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
      foreignKey: 'studentId',
      otherKey: 'teacherId',
      as: 'teachers',
      onDelete: 'CASCADE',
    });
  },
};
export default StudentModel;
