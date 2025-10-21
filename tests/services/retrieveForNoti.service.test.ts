import notificationService from '../../src/services/retrieveForNoti.service';
import teacherRepository from '../../src/repositories/teacher.repository';
import studentTeacherRepository from '../../src/repositories/studentTeacher.repository';
import studentRepository from '../../src/repositories/student.repository';
import { Student } from '../../src/database/models/Student';
import * as emailUtils from '../../src/utils/common';

// Mock repositories and utils
jest.mock('../../src/repositories/teacher.repository', () => ({
  findTeacherByEmail: jest.fn(),
}));

jest.mock('../../src/repositories/studentTeacher.repository', () => ({
  findStudentsByTeacher: jest.fn(),
}));

jest.mock('../../src/repositories/student.repository', () => ({
  findNotSuspendedStudentByEmails: jest.fn(),
}));

jest.mock('../../src/utils/common', () => ({
  getMentionedEmails: jest.fn(),
}));

describe('notificationService.getRecipients', () => {
  const mockFindTeacherByEmail =
    teacherRepository.findTeacherByEmail as jest.Mock;
  const mockFindStudentsByTeacher =
    studentTeacherRepository.findStudentsByTeacher as jest.Mock;
  const mockFindNotSuspendedStudentByEmails =
    studentRepository.findNotSuspendedStudentByEmails as jest.Mock;
  const mockGetMentionedEmails = emailUtils.getMentionedEmails as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if teacher not found', async () => {
    mockFindTeacherByEmail.mockResolvedValue(null);

    await expect(
      notificationService.getRecipients('teacher1@gmail.com', 'Hello class!')
    ).rejects.toThrow('Teacher not found');
  });

  it('should return only registered (non-suspended) students if no mentions', async () => {
    const mockTeacher = { id: 't1', email: 'teacher1@gmail.com' };
    mockFindTeacherByEmail.mockResolvedValue(mockTeacher);

    mockFindStudentsByTeacher.mockResolvedValue([
      { student: { email: 'student1@gmail.com', isSuspended: false } },
      { student: { email: 'student2@gmail.com', isSuspended: true } }, // suspended → filtered out
      { student: null }, // invalid → filtered out
    ]);

    mockGetMentionedEmails.mockReturnValue([]); // no mentions
    mockFindNotSuspendedStudentByEmails.mockResolvedValue([]);

    const recipients = await notificationService.getRecipients(
      'teacher1@gmail.com',
      'Announcement: class tomorrow!'
    );

    expect(mockFindTeacherByEmail).toHaveBeenCalledWith('teacher1@gmail.com');
    expect(mockGetMentionedEmails).toHaveBeenCalledWith(
      'announcement: class tomorrow!'
    );
    expect(recipients).toEqual(['student1@gmail.com']);
  });

  it('should include mentioned students if valid and not suspended', async () => {
    const mockTeacher = { id: 't1', email: 'teacher1@gmail.com' };
    mockFindTeacherByEmail.mockResolvedValue(mockTeacher);

    mockFindStudentsByTeacher.mockResolvedValue([
      { student: { email: 'student1@gmail.com', isSuspended: false } },
    ]);

    mockGetMentionedEmails.mockReturnValue(['@student3@gmail.com']);
    mockFindNotSuspendedStudentByEmails.mockResolvedValue([
      { email: 'student3@gmail.com' } as Student,
    ]);

    const recipients = await notificationService.getRecipients(
      'teacher1@gmail.com',
      'Reminder: project due! @student3@gmail.com'
    );

    expect(mockGetMentionedEmails).toHaveBeenCalledWith(
      'reminder: project due! @student3@gmail.com'
    );
    expect(recipients.sort()).toEqual([
      'student1@gmail.com',
      'student3@gmail.com',
    ]);
  });

  it('should remove duplicates between registered and mentioned students', async () => {
    const mockTeacher = { id: 't1', email: 'teacher1@gmail.com' };
    mockFindTeacherByEmail.mockResolvedValue(mockTeacher);

    mockFindStudentsByTeacher.mockResolvedValue([
      { student: { email: 'student1@gmail.com', isSuspended: false } },
    ]);

    mockGetMentionedEmails.mockReturnValue(['@student1@gmail.com']);
    mockFindNotSuspendedStudentByEmails.mockResolvedValue([
      { email: 'student1@gmail.com' } as Student, // duplicate
    ]);

    const recipients = await notificationService.getRecipients(
      'teacher1@gmail.com',
      'Ping @student1@gmail.com'
    );

    expect(mockGetMentionedEmails).toHaveBeenCalledWith(
      'ping @student1@gmail.com'
    );
    expect(recipients).toEqual(['student1@gmail.com']);
  });

  it('should return empty array if all students suspended or invalid', async () => {
    const mockTeacher = { id: 't1', email: 'teacher1@gmail.com' };
    mockFindTeacherByEmail.mockResolvedValue(mockTeacher);

    mockFindStudentsByTeacher.mockResolvedValue([
      { student: { email: 'student1@gmail.com', isSuspended: true } },
    ]);

    mockGetMentionedEmails.mockReturnValue(['@student2@gmail.com']);
    mockFindNotSuspendedStudentByEmails.mockResolvedValue([]); // all mentioned suspended or not found

    const recipients = await notificationService.getRecipients(
      'teacher1@gmail.com',
      'Hi @student2@gmail.com'
    );

    expect(recipients).toEqual([]);
  });
});
