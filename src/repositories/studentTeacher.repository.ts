import sequelize from '../database';

const { StudentTeacher } = sequelize.models;

const save = async (body: any) => {
  return await StudentTeacher.create(body);
};

export default {
  save,
};
