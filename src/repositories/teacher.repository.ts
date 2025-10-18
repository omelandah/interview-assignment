import { Teacher } from '../database/models/Teacher';

const findTeacherByEmail = async (email: string) => {
  return await Teacher.findOne({ where: { email } });
};

export default {
  findTeacherByEmail,
};
