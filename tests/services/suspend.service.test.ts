import suspendService from '../../src/services/suspend.service';
import studentRepository from '../../src/repositories/student.repository';
import { Student } from '../../src/database/models/Student';

// Mock studentRepository
jest.mock('../../src/repositories/student.repository', () => ({
  findStudentByEmail: jest.fn(),
}));

describe('suspendStudent service', () => {
  const mockFindStudentByEmail =
    studentRepository.findStudentByEmail as jest.Mock;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if student is not found', async () => {
    mockFindStudentByEmail.mockResolvedValue(null);

    await expect(
      suspendService.suspendStudent('notfound@gmail.com')
    ).rejects.toThrow('Student with email notfound@gmail.com not found');
  });

  it('should suspend a student when found and not suspended', async () => {
    const mockUpdate = jest.fn().mockResolvedValue(true);
    const mockStudent = {
      email: 'student1@gmail.com',
      isSuspended: false,
      update: mockUpdate,
    } as unknown as Student;

    mockFindStudentByEmail.mockResolvedValue(mockStudent);

    await suspendService.suspendStudent('student1@gmail.com');

    expect(mockFindStudentByEmail).toHaveBeenCalledWith('student1@gmail.com');
    expect(mockUpdate).toHaveBeenCalledWith({ isSuspended: true });
  });

  it('should not call update if the student is already suspended', async () => {
    const mockUpdate = jest.fn();
    const mockStudent = {
      email: 'student2@gmail.com',
      isSuspended: true,
      update: mockUpdate,
    } as unknown as Student;

    mockFindStudentByEmail.mockResolvedValue(mockStudent);

    await suspendService.suspendStudent('student2@gmail.com');

    expect(mockFindStudentByEmail).toHaveBeenCalledWith('student2@gmail.com');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
