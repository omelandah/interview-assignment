import sequelize from '../database';
import { Student } from '../database/models/Student';
import { Teacher } from '../database/models/Teacher';

const TeacherModel = sequelize.models.Teacher as typeof Teacher;

const findTeacherByEmail = async (email: string) => {
  return await TeacherModel.findOne({ where: { email } });
};

const findTeachersWithStudent = async (emails: string[]) => {
  return await TeacherModel.findAll({
    where: { email: emails },
    include: [
      {
        model: Student,
        as: 'students',
        attributes: ['email'],
        through: { attributes: [] },
      },
    ],
  });
};

export default {
  findTeacherByEmail,
  findTeachersWithStudent,
};
