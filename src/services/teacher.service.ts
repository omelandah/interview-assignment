import teacherRepository from '../repositories/teacher.repository';
import studentRepository from '../repositories/student.repository';
import studentTeacherRepository from '../repositories/studentTeacher.repository';
import { Teacher } from '../database/models/Teacher';
import { Student } from '../database/models/Student';
import { getMentionedEmails } from '../utils/common';

const registerStudentsToTeacher = async (
  teacherEmail: string,
  studentEmails: string[]
): Promise<boolean> => {
  const teacher = await teacherRepository.findTeacherByEmail(teacherEmail);
  if (!teacher) {
    throw new Error(`Teacher with email "${teacherEmail}" not found`);
  }

  const students = await studentRepository.findStudentByEmails(studentEmails);
  if (students.length !== studentEmails.length) {
    throw new Error('One or more students not found');
  }

  // Check for suspended students
  const suspendedStudents = students.filter((s) => s.isSuspended);
  if (suspendedStudents.length > 0) {
    const suspendedEmails = suspendedStudents.map((s) => s.email).join(', ');
    throw new Error(`Cannot register suspended students: ${suspendedEmails}`);
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

  return studentLists.reduce((acc, list) =>
    acc.filter((email) => list.includes(email))
  );
};

const suspendStudent = async (email: string): Promise<void> => {
  const student = await studentRepository.findStudentByEmail(email);
  if (!student) {
    throw new Error(`Student with email ${email} not found`);
  }

  if (student.isSuspended) {
    return;
  }

  await student.update({ isSuspended: true });
};

const getRecipients = async (
  teacherEmail: string,
  notification: string
): Promise<string[]> => {
  const teacher = await teacherRepository.findTeacherByEmail(teacherEmail);

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  // get registered students of this teacher
  const registeredStudents =
    await studentTeacherRepository.findStudentsByTeacher(teacher.id);
  const registeredStudentEmails = registeredStudents
    .filter((rel) => rel.student && !rel.student.isSuspended)
    .map((rel) => rel.student!.email);

  // Extract mentioned emails from notification
  const normalizedNotification = notification.toLowerCase().trim();
  const mentionedEmails: string[] = getMentionedEmails(normalizedNotification);

  // Validate mentioned students exist & not suspended
  const mentionedStudents =
    await studentRepository.findNotSuspendedStudentByEmails(mentionedEmails);
  const mentionedStudentEmails = mentionedStudents.map(
    (student) => student.email
  );
  const allRecipients = new Set([
    ...registeredStudentEmails,
    ...mentionedStudentEmails,
  ]);

  return Array.from(allRecipients);
};

export default {
  registerStudentsToTeacher,
  getCommonStudents,
  suspendStudent,
  getRecipients,
};
