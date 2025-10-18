import { DataTypes, Model, Sequelize, Optional, Association } from 'sequelize';
import { Student } from './Student';
import { Teacher } from './Teacher';

export interface StudentTeacherAttributes {
  id: string;
  studentUuid: string;
  teacherUuid: string;
}

export interface StudentTeacherCreationAttributes
  extends Optional<StudentTeacherAttributes, 'id'> {}

export class StudentTeacher
  extends Model<StudentTeacherAttributes, StudentTeacherCreationAttributes>
  implements StudentTeacherAttributes
{
  public id!: string;
  public studentUuid!: string;
  public teacherUuid!: string;

  // association fields
  public student?: Student;
  public teacher?: Teacher;

  public static associations: {
    student: Association<StudentTeacher, Student>;
    teacher: Association<StudentTeacher, Teacher>;
  };

  // ✅ typed associate function
  public static associate(models: {
    Student: typeof Student;
    Teacher: typeof Teacher;
  }) {
    StudentTeacher.belongsTo(models.Student, {
      foreignKey: 'studentUuid',
      as: 'student',
    });
    StudentTeacher.belongsTo(models.Teacher, {
      foreignKey: 'teacherUuid',
      as: 'teacher',
    });
  }
}

export function initStudentTeacher(
  sequelize: Sequelize
): typeof StudentTeacher {
  StudentTeacher.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentUuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 't_students',
          key: 'uuid',
        },
        field: 'student_uuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      teacherUuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 't_teachers',
          key: 'uuid',
        },
        field: 'teacher_uuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      freezeTableName: true,
      modelName: 'StudentTeacher',
      tableName: 't_student_teacher',
    }
  );

  return StudentTeacher;
}
