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

  const existingStudents = await (teacher as Teacher).getStudents({
    where: { email: studentEmails },
  });

  const existingEmails = new Set(existingStudents.map((s) => s.email));

  const newStudents = (students as Student[]).filter(
    (s) => !existingEmails.has(s.email)
  );

  if (newStudents.length === 0) {
    throw new Error(
      'All request students are already registered to this teacher !'
    );
  }

  await (teacher as Teacher).addStudents(newStudents as Student[]);

  return true;
};

export default {
  registerStudentstoTeacher,
};
