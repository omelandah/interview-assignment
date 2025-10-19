import { Sequelize, DataTypes, Model } from 'sequelize';
import { ModelDefinition } from '../types/model.d';

export class StudentTeacher extends Model {
  declare studentId: string;
  declare teacherId: string;
  declare isSuspended?: boolean;
}

const StudentTeacherModel: ModelDefinition = {
  init: (sequelize: Sequelize) => {
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
        isSuspended: {
          type: DataTypes.BOOLEAN,
          field: 'is_suspended',
          allowNull: true,
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
  },

  associate: (models) => {
    StudentTeacher.belongsTo(models.Student, {
      foreignKey: 'studentUuid',
      as: 'student',
      onDelete: 'CASCADE',
    });
    StudentTeacher.belongsTo(models.Teacher, {
      foreignKey: 'teacherUuid',
      as: 'teacher',
      onDelete: 'CASCADE',
    });
  },
};

export default StudentTeacherModel;
