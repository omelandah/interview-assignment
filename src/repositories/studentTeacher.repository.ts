import sequelize from '../database';
import { Student } from '../database/models/Student';
import { StudentTeacher } from '../database/models/StudentTeacher';

const StudentTeacherModel = sequelize.models
  .StudentTeacher as typeof StudentTeacher;

const findStudentsByTeacher = (
  teacherId: string
): Promise<(StudentTeacher & { student?: Student })[]> => {
  const registeredStudents = StudentTeacherModel.findAll({
    where: { teacherId },
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
