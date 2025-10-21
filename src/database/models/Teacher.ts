import {
  Sequelize,
  DataTypes,
  Model,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  Optional,
  Association,
} from 'sequelize';
import { ModelDefinition } from '../types/model.d';
import { Student } from './Student';

interface TeacherAttributes {
  id: string;
  email: string;
}

interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id'> {}

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  declare id: string;
  declare email: string;

  // Association property
  declare students?: Student[];

  // Optional mixins
  declare addStudents: BelongsToManyAddAssociationsMixin<Student, string>;
  declare getStudents: BelongsToManyGetAssociationsMixin<Student>;

  declare static associations: {
    students: Association<Teacher, Student>;
  };
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
      foreignKey: 'teacherId',
      otherKey: 'studentId',
      as: 'students',
      onDelete: 'CASCADE',
    });
  },
};

export default TeacherModel;
