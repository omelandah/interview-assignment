import {
  DataTypes,
  Model,
  Sequelize,
  Optional,
  Association,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import { Student } from './Student';
import { StudentTeacher } from './StudentTeacher';

interface TeacherAttributes {
  id: string;
  email: string;
}

interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id'> {}

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  public id!: string;
  public email!: string;

  public addStudents!: HasManyAddAssociationsMixin<Student, string>;
  public getStudents!: HasManyGetAssociationsMixin<Student>;

  public readonly students?: Student[];
  public suspendedStudents?: Student[];

  public static associations: {
    students: Association<Teacher, Student>;
    suspendedStudents: Association<Teacher, Student>;
  };

  public static associate(models: {
    Student: typeof Student;
    StudentTeacher: typeof StudentTeacher;
  }) {
    Teacher.belongsToMany(models.Student, {
      through: models.StudentTeacher,
      foreignKey: 'teacherUuid',
      otherKey: 'studentUuid',
      as: 'students',
      onDelete: 'CASCADE',
    });
  }
}

export function initTeacher(sequelize: Sequelize): typeof Teacher {
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
}
