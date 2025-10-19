import sequelize from '../database';

const { Student } = sequelize.models;
const findStudentByEmails = async (emails: string[]) => {
  return await Student.findAll({ where: { email: emails } });
};

export default {
  findStudentByEmails,
};
