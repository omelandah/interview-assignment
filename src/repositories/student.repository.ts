import { Student } from '../database/models/Student';

const findStudentByEmails = async (emails: string[]) => {
  return await Student.findAll({ where: { email: emails } });
};

export default {
  findStudentByEmails,
};
