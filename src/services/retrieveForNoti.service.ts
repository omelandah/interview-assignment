import studentTeacherRepository from '../repositories/studentTeacher.repository';
import teacherRepository from '../repositories/teacher.repository';
import studentRepository from '../repositories/student.repository';
import { getMentionedEmails } from '../utils/common';

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
  getRecipients,
};
