import sequelize from '../database';
import { Student } from '../database/models/Student';

const StudentModel = sequelize.models.Student as typeof Student;

const findStudentByEmails = async (emails: string[]) => {
  return await StudentModel.findAll({ where: { email: emails } });
};

const findNotSuspendedStudentByEmails = async (emails: string[]) => {
  return await StudentModel.findAll({
    where: { email: emails, isSuspended: false },
  });
};

const findStudentByEmail = async (email: string) => {
  return await StudentModel.findOne({ where: { email } });
};

export default {
  findStudentByEmails,
  findStudentByEmail,
  findNotSuspendedStudentByEmails,
};
