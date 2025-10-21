import teacherRepository from '../repositories/teacher.repository';
import { Student } from '../database/models/Student';

const getCommonStudents = async (
  teacherEmails: string[]
): Promise<string[]> => {
  const teachers =
    await teacherRepository.findTeachersWithStudent(teacherEmails);

  if (teachers.length === 0) {
    throw new Error('Teachers not found !');
  }

  // Extract student emails per teacher
  const studentLists = teachers.map(
    (t) => t.students?.map((student: Student) => student.email) ?? []
  );

  if (studentLists.length === 0) return [];

  return studentLists.reduce((acc, list) =>
    acc.filter((email) => list.includes(email))
  );
};

export default {
  getCommonStudents,
};
