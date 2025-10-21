import { Sequelize, DataTypes, Model, Association } from 'sequelize';
import { ModelDefinition } from '../types/model.d';
import { Student } from './Student';
import { Teacher } from './Teacher';

export class StudentTeacher extends Model {
  declare id: string;
  declare studentId: string;
  declare teacherId: string;

  // add association fields so TS knows about them
  declare student?: Student;
  declare teacher?: Teacher;

  declare static associations: {
    student: Association<StudentTeacher, Student>;
    teacher: Association<StudentTeacher, Teacher>;
  };
}

const StudentTeacherModel: ModelDefinition = {
  init: (sequelize: Sequelize) => {
    StudentTeacher.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        studentId: {
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
        teacherId: {
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
        indexes: [
          {
            unique: true,
            fields: ['student_uuid', 'teacher_uuid'],
          },
        ],
      }
    );

    return StudentTeacher;
  },

  associate: (models) => {
    StudentTeacher.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
      onDelete: 'CASCADE',
    });
    StudentTeacher.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      as: 'teacher',
      onDelete: 'CASCADE',
    });
  },
};

export default StudentTeacherModel;
