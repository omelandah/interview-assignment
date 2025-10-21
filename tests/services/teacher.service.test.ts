import teacherService from '../../src/services/teacher.service';
import teacherRepository from '../../src/repositories/teacher.repository';
import studentRepository from '../../src/repositories/student.repository';
import studentTeacherRepository from '../../src/repositories/studentTeacher.repository';
import { getMentionedEmails } from '../../src/utils/common';

jest.mock('../../src/repositories/teacher.repository');
jest.mock('../../src/repositories/student.repository');
jest.mock('../../src/repositories/studentTeacher.repository');
jest.mock('../../src/utils/common');

describe('teacherService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registerStudentsToTeacher', () => {
    it('should register new students to a teacher', async () => {
      const teacher = {
        id: 1,
        getStudents: jest.fn().mockResolvedValue([]),
        addStudents: jest.fn(),
      };
      const students = [
        { id: 1, email: 's1@example.com', isSuspended: false },
        { id: 2, email: 's2@example.com', isSuspended: false },
      ];

      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        teacher
      );
      (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
        students
      );

      const result = await teacherService.registerStudentsToTeacher(
        'teacher@example.com',
        ['s1@example.com', 's2@example.com']
      );

      expect(result).toBe(true);
      expect(teacher.addStudents).toHaveBeenCalledWith(students);
    });

    it('should throw if teacher not found', async () => {
      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        null
      );
      await expect(
        teacherService.registerStudentsToTeacher('teacher@example.com', [
          's1@example.com',
        ])
      ).rejects.toThrow('Teacher with email "teacher@example.com" not found');
    });

    it('should throw if any student not found', async () => {
      const teacher = {
        id: 1,
        getStudents: jest.fn().mockResolvedValue([]),
        addStudents: jest.fn(),
      };
      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        teacher
      );
      (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue([
        { email: 's1@example.com' },
      ]);

      await expect(
        teacherService.registerStudentsToTeacher('teacher@example.com', [
          's1@example.com',
          's2@example.com',
        ])
      ).rejects.toThrow('One or more students not found');
    });

    it('should throw if any student is suspended', async () => {
      const teacher = {
        id: 1,
        getStudents: jest.fn().mockResolvedValue([]),
        addStudents: jest.fn(),
      };
      const students = [{ email: 's1@example.com', isSuspended: true }];
      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        teacher
      );
      (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
        students
      );

      await expect(
        teacherService.registerStudentsToTeacher('teacher@example.com', [
          's1@example.com',
        ])
      ).rejects.toThrow('Cannot register suspended students: s1@example.com');
    });

    it('should throw error if all students are already registered', async () => {
      const teacher = {
        id: 1,
        getStudents: jest
          .fn()
          .mockResolvedValue([
            { email: 's1@example.com' },
            { email: 's2@example.com' },
          ]),
        addStudents: jest.fn(),
      };

      const students = [
        { email: 's1@example.com', isSuspended: false },
        { email: 's2@example.com', isSuspended: false },
      ];

      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        teacher
      );
      (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
        students
      );

      await expect(
        teacherService.registerStudentsToTeacher('teacher@example.com', [
          's1@example.com',
          's2@example.com',
        ])
      ).rejects.toThrow(
        'All request students are already registered to this teacher !'
      );

      expect(teacher.addStudents).not.toHaveBeenCalled();
    });
  });

  describe('getCommonStudents', () => {
    it('should return common student emails', async () => {
      const teachers = [
        { students: [{ email: 'a@example.com' }, { email: 'b@example.com' }] },
        { students: [{ email: 'b@example.com' }, { email: 'c@example.com' }] },
      ];
      (
        teacherRepository.findTeachersWithStudent as jest.Mock
      ).mockResolvedValue(teachers);

      const result = await teacherService.getCommonStudents([
        't1@example.com',
        't2@example.com',
      ]);
      expect(result).toEqual(['b@example.com']);
    });

    it('should throw if teachers not found', async () => {
      (
        teacherRepository.findTeachersWithStudent as jest.Mock
      ).mockResolvedValue([]);
      await expect(
        teacherService.getCommonStudents(['t1@example.com'])
      ).rejects.toThrow('Teachers not found !');
    });

    it('should handle teacher with no students', async () => {
      const teachers = [{ students: undefined }];
      (
        teacherRepository.findTeachersWithStudent as jest.Mock
      ).mockResolvedValue(teachers);

      const result = await teacherService.getCommonStudents(['t1@example.com']);

      expect(result).toEqual([]);
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student', async () => {
      const student = { isSuspended: false, update: jest.fn() };
      (studentRepository.findStudentByEmail as jest.Mock).mockResolvedValue(
        student
      );

      await teacherService.suspendStudent('s1@example.com');
      expect(student.update).toHaveBeenCalledWith({ isSuspended: true });
    });

    it('should do nothing if student already suspended', async () => {
      const student = { isSuspended: true, update: jest.fn() };
      (studentRepository.findStudentByEmail as jest.Mock).mockResolvedValue(
        student
      );

      await teacherService.suspendStudent('s1@example.com');
      expect(student.update).not.toHaveBeenCalled();
    });

    it('should throw if student not found', async () => {
      (studentRepository.findStudentByEmail as jest.Mock).mockResolvedValue(
        null
      );
      await expect(
        teacherService.suspendStudent('s1@example.com')
      ).rejects.toThrow('Student with email s1@example.com not found');
    });
  });

  describe('getRecipients', () => {
    it('should return registered and mentioned student emails', async () => {
      const teacher = { id: 1 };
      const registered = [
        { student: { email: 'a@example.com', isSuspended: false } },
        { student: { email: 'b@example.com', isSuspended: true } },
      ];
      const mentioned = [{ email: 'c@example.com' }];

      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        teacher
      );
      (
        studentTeacherRepository.findStudentsByTeacher as jest.Mock
      ).mockResolvedValue(registered);
      (getMentionedEmails as jest.Mock).mockReturnValue(['c@example.com']);
      (
        studentRepository.findNotSuspendedStudentByEmails as jest.Mock
      ).mockResolvedValue(mentioned);

      const result = await teacherService.getRecipients(
        't@example.com',
        'Hello @c@example.com'
      );

      expect(result.sort()).toEqual(['a@example.com', 'c@example.com'].sort());
    });

    it('should throw if teacher not found', async () => {
      (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
        null
      );
      await expect(
        teacherService.getRecipients('t@example.com', 'Hello')
      ).rejects.toThrow('Teacher not found');
    });
  });
});
