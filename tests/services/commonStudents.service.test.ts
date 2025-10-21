import commonStudentsService from '../../src/services/commonStudents.service';
import teacherRepository from '../../src/repositories/teacher.repository';
import { Student } from '../../src/database/models/Student';

// Mock teacherRepository
jest.mock('../../src/repositories/teacher.repository', () => ({
  findTeachersWithStudent: jest.fn(),
}));

describe('commonStudentsService.getCommonStudents', () => {
  const mockFindTeachersWithStudent =
    teacherRepository.findTeachersWithStudent as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if no teachers found', async () => {
    mockFindTeachersWithStudent.mockResolvedValue([]);

    await expect(
      commonStudentsService.getCommonStudents(['teacher1@gmail.com'])
    ).rejects.toThrow('Teachers not found !');
  });

  it('should return students of a single teacher', async () => {
    const students: Student[] = [
      { email: 'student1@gmail.com' } as Student,
      { email: 'student2@gmail.com' } as Student,
    ];

    mockFindTeachersWithStudent.mockResolvedValue([{ students }]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
    ]);

    expect(result).toEqual(['student1@gmail.com', 'student2@gmail.com']);
  });

  it('should return empty array if no teachers have students', async () => {
    mockFindTeachersWithStudent.mockResolvedValue([
      { students: [] },
      { students: [] },
    ]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
      'teacher2@gmail.com',
    ]);

    expect(result).toEqual([]);
  });

  it('should return empty array if studentLists length is 0 (no students at all)', async () => {
    mockFindTeachersWithStudent.mockResolvedValue([{ students: [] }]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
    ]);

    expect(result).toEqual([]);
  });

  it('should return common students of multiple teachers', async () => {
    const teacher1Students: Student[] = [
      { email: 'student1@gmail.com' } as Student,
      { email: 'student2@gmail.com' } as Student,
    ];
    const teacher2Students: Student[] = [
      { email: 'student2@gmail.com' } as Student,
      { email: 'student3@gmail.com' } as Student,
    ];

    mockFindTeachersWithStudent.mockResolvedValue([
      { students: teacher1Students },
      { students: teacher2Students },
    ]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
      'teacher2@gmail.com',
    ]);

    expect(result).toEqual(['student2@gmail.com']);
  });

  it('should return empty array if multiple teachers have no common students', async () => {
    const teacher1Students: Student[] = [
      { email: 'student1@gmail.com' } as Student,
    ];
    const teacher2Students: Student[] = [
      { email: 'student2@gmail.com' } as Student,
    ];

    mockFindTeachersWithStudent.mockResolvedValue([
      { students: teacher1Students },
      { students: teacher2Students },
    ]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
      'teacher2@gmail.com',
    ]);

    expect(result).toEqual([]);
  });

  it('should handle undefined students gracefully', async () => {
    mockFindTeachersWithStudent.mockResolvedValue([
      { students: undefined },
      { students: [{ email: 'student1@gmail.com' }] },
    ]);

    const result = await commonStudentsService.getCommonStudents([
      'teacher1@gmail.com',
      'teacher2@gmail.com',
    ]);

    expect(result).toEqual([]);
  });
});
