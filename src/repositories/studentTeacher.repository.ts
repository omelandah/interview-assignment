import sequelize from '../database';
import { Student } from '../database/models/Student';
import { StudentTeacher } from '../database/models/StudentTeacher';

const StudentTeacherModel = sequelize.models
  .StudentTeacher as typeof StudentTeacher;

const findStudentsByTeacher = async (teacherUuid: string) => {
  const registeredStudents = await StudentTeacherModel.findAll({
    where: { teacherUuid },
    include: {
      model: Student,
      as: 'student',
      attributes: ['email', 'isSuspended'],
    },
  });

  return registeredStudents;
};

export default {
  findStudentsByTeacher,
};
