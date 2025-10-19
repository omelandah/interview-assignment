import sequelize from '../database';

const { Student } = sequelize.models;

const findStudentByEmails = async (emails: string[]) => {
  return await Student.findAll({ where: { email: emails } });
};

const findStudentByEmail = async (email: string) => {
  return await Student.findOne({ where: { email } });
};

export default {
  findStudentByEmails,
  findStudentByEmail,
};
