import { DataTypes, Model, Sequelize, Optional, Association } from 'sequelize';
import { Teacher } from './Teacher';
import { StudentTeacher } from './StudentTeacher';

export interface StudentAttributes {
  id: string;
  email: string;
  isSuspended?: boolean;
}

export interface StudentCreationAttributes
  extends Optional<StudentAttributes, 'id'> {}

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: string;
  public email!: string;
  public isSuspended?: boolean;

  // association fields
  public teachers?: Teacher[];
  public suspendedByTeachers?: Teacher[];

  // Sequelize metadata
  public static associations: {
    teachers: Association<Student, Teacher>;
    suspendedByTeachers: Association<Student, Teacher>;
  };

  public static associate(models: {
    Teacher: typeof Teacher;
    StudentTeacher: typeof StudentTeacher;
  }) {
    Student.belongsToMany(models.Teacher, {
      through: models.StudentTeacher,
      foreignKey: 'studentUuid',
      otherKey: 'teacherUuid',
      as: 'teachers',
      onDelete: 'CASCADE',
    });
  }
}

export function initStudent(sequelize: Sequelize): typeof Student {
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
        allowNull: true,
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
}
