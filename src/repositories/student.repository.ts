import sequelize from '../database';
import { Student } from '../database/models/Student';

const StudentModel = sequelize.models.Student as typeof Student;

const findStudentByEmails = (emails: string[]): Promise<Student[]> => {
  return StudentModel.findAll({ where: { email: emails } });
};

const findNotSuspendedStudentByEmails = (
  emails: string[]
): Promise<Student[]> => {
  return StudentModel.findAll({
    where: { email: emails, isSuspended: false },
  });
};

const findStudentByEmail = (email: string): Promise<Student | null> => {
  return StudentModel.findOne({ where: { email } });
};

export default {
  findStudentByEmails,
  findStudentByEmail,
  findNotSuspendedStudentByEmails,
};
