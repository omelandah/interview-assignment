import sequelize from '../database';

const { Teacher } = sequelize.models;

const findTeacherByEmail = async (email: string) => {
  return await Teacher.findOne({ where: { email } });
};

export default {
  findTeacherByEmail,
};
