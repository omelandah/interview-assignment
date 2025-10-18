import {
  StudentTeacher,
  StudentTeacherCreationAttributes,
} from '../database/models/StudentTeacher';

const save = async (body: StudentTeacherCreationAttributes) => {
  return await StudentTeacher.create(body);
};

export default {
  save,
};
