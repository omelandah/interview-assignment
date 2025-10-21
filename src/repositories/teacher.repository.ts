import sequelize from '../database';
import { Student } from '../database/models/Student';
import { Teacher } from '../database/models/Teacher';

const TeacherModel = sequelize.models.Teacher as typeof Teacher;

const findTeacherByEmail = (email: string): Promise<Teacher | null> => {
  return TeacherModel.findOne({ where: { email } });
};

const findTeachersWithStudent = (
  emails: string[]
): Promise<(Teacher & { students?: Student[] })[]> => {
  return TeacherModel.findAll({
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
