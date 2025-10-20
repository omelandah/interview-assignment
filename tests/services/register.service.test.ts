import registerService from '../../src/services/register.service';
import teacherRepository from '../../src/repositories/teacher.repository';
import studentRepository from '../../src/repositories/student.repository';
import { Teacher } from '../../src/database/models/Teacher';
import { Student } from '../../src/database/models/Student';

jest.mock('../../src/repositories/teacher.repository');
jest.mock('../../src/repositories/student.repository');

describe('registerStudentstoTeacher', () => {
  const mockTeacher = {
    addStudents: jest.fn(),
    getStudents: jest.fn(),
  } as unknown as Teacher;

  const mockStudents: Student[] = [
    { email: 'student1@test.com' } as Student,
    { email: 'student2@test.com' } as Student,
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if teacher not found', async () => {
    (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      registerService.registerStudentstoTeacher('notfound@test.com', [
        'student1@test.com',
      ])
    ).rejects.toThrow('Teacher with email "notfound@test.com" not found');
  });

  it('should throw error if one or more students not found', async () => {
    (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
      mockTeacher
    );
    (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue([
      mockStudents[0],
    ]); // only 1 student returned

    await expect(
      registerService.registerStudentstoTeacher('teacher@test.com', [
        'student1@test.com',
        'student2@test.com',
      ])
    ).rejects.toThrow('One or more students not found');
  });

  it('should throw error if all students are already registered', async () => {
    (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
      mockTeacher
    );
    (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
      mockStudents
    );

    // all students already registered
    (mockTeacher.getStudents as jest.Mock).mockResolvedValue(mockStudents);

    await expect(
      registerService.registerStudentstoTeacher('teacher@test.com', [
        'student1@test.com',
        'student2@test.com',
      ])
    ).rejects.toThrow(
      'All request students are already registered to this teacher !'
    );
  });

  it('should only add new students if some are already registered', async () => {
    (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
      mockTeacher
    );
    (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
      mockStudents
    );

    // only student1 already registered
    (mockTeacher.getStudents as jest.Mock).mockResolvedValue([mockStudents[0]]);

    const result = await registerService.registerStudentstoTeacher(
      'teacher@test.com',
      ['student1@test.com', 'student2@test.com']
    );

    expect(result).toBe(true);
    expect(mockTeacher.addStudents).toHaveBeenCalledWith([mockStudents[1]]);
  });

  it('should register all students if none are already registered', async () => {
    (teacherRepository.findTeacherByEmail as jest.Mock).mockResolvedValue(
      mockTeacher
    );
    (studentRepository.findStudentByEmails as jest.Mock).mockResolvedValue(
      mockStudents
    );

    // no students registered yet
    (mockTeacher.getStudents as jest.Mock).mockResolvedValue([]);

    const result = await registerService.registerStudentstoTeacher(
      'teacher@test.com',
      ['student1@test.com', 'student2@test.com']
    );

    expect(result).toBe(true);
    expect(mockTeacher.addStudents).toHaveBeenCalledWith(mockStudents);
  });
});
