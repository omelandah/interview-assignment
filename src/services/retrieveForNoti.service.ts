import studentTeacherRepository from '../repositories/studentTeacher.repository';
import teacherRepository from '../repositories/teacher.repository';
import studentRepository from '../repositories/student.repository';

const getRecipients = async (teacherEmail: string, notification: string) => {
  const teacher = await teacherRepository.findTeacherByEmail(teacherEmail);

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  // get registered students of this teacher
  const registeredStudents =
    await studentTeacherRepository.findStudentsByTeacher(teacher.id);
  const registeredStudentEmails = registeredStudents
    .filter((rel) => rel.student && !rel.student.isSuspended)
    .map((rel) => rel.student?.email)
    .filter(Boolean);

  // Extract mentioned emails from notification
  const mentionRegex = /@([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const mentionedEmails: string[] = [];
  let match;
  while ((match = mentionRegex.exec(notification)) !== null) {
    mentionedEmails.push(match[1]);
  }

  // Validate mentioned students exist & not suspended
  const mentionedStudents =
    await studentRepository.findNotSuspendedStudentByEmails(mentionedEmails);
  const mentionStudentsEmails = mentionedStudents.map(
    (student) => student.email
  );

  return Array.from(
    new Set([...registeredStudentEmails, ...mentionStudentsEmails])
  );
};

export default {
  getRecipients,
};
