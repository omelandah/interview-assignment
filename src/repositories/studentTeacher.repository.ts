import sequelize from '../database';

const { StudentTeacher } = sequelize.models;

const save = async (body: any) => {
  return await StudentTeacher.create(body);
};

const findByStudentId = async (studentUuid: string) => {
  return await StudentTeacher.findByPk(studentUuid);
};

export default {
  save,
  findByStudentId,
};
