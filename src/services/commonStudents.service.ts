import teacherRepository from '../repositories/teacher.repository';
import { Student } from '../database/models/Student';
import { Teacher } from '../database/models/Teacher';

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

  let commonStudents: string[];
  if (studentLists.length === 0) {
    commonStudents = [];
  } else if (studentLists.length === 1) {
    commonStudents = studentLists[0];
  } else {
    commonStudents = studentLists.reduce((acc, list) =>
      acc.filter((email) => list.includes(email))
    );
  }

  return commonStudents;
};

export default {
  getCommonStudents,
};
