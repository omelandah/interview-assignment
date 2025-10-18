import teacherRepository from '../repositories/teacher.repository';
import studentRepository from '../repositories/student.repository';
import { Teacher } from '../database/models/Teacher';
import { Student } from '../database/models/Student';

const registerStudentstoTeacher = async (
  teacherEmail: string,
  studentEmails: string[]
) => {
  const teacher = await teacherRepository.findTeacherByEmail(teacherEmail);
  if (!teacher) {
    throw new Error(`Teacher with email "${teacherEmail}" not found`);
  }

  const students = await studentRepository.findStudentByEmails(studentEmails);
  if (students.length !== studentEmails.length) {
    throw new Error('One or more students not found');
  }

  await (teacher as Teacher).addStudents(students as Student[]);

  return true;
};

export default {
  registerStudentstoTeacher,
};
