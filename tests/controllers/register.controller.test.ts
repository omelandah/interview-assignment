import { Request, Response } from 'express';
import registerController from '../../src/controllers/register.controller';
import registerService from '../../src/services/register.service';

// Mock the service
jest.mock('../../src/services/register.service');

describe('registerController.registerStudents', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendStatusMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    sendStatusMock = jest.fn();

    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
      sendStatus: sendStatusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if teacher or students are missing', async () => {
    req.body = { teacher: 'teacher@gmail.com' }; // missing students

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'teacher and students are required',
    });
  });

  it('should call service and return 204 on success', async () => {
    (registerService.registerStudentstoTeacher as jest.Mock).mockResolvedValue(
      true
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com', 'student2@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(registerService.registerStudentstoTeacher).toHaveBeenCalledWith(
      'teacher@gmail.com',
      ['student1@gmail.com', 'student2@gmail.com']
    );
    expect(sendStatusMock).toHaveBeenCalledWith(204);
  });

  it('should return 404 if service throws not found error', async () => {
    (registerService.registerStudentstoTeacher as jest.Mock).mockRejectedValue(
      new Error('Teacher with email "teacher@gmail.com" not found')
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Teacher with email "teacher@gmail.com" not found',
    });
  });

  it('should return 500 if service throws other error', async () => {
    (registerService.registerStudentstoTeacher as jest.Mock).mockRejectedValue(
      new Error('DB connection failed')
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Failed to register students',
    });
  });

  it('should return 500 with unexpected error type', async () => {
    // @ts-ignore simulate a weird throw (not Error instance)
    (registerService.registerStudentstoTeacher as jest.Mock).mockRejectedValue(
      'Some random string'
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Unexpected error',
    });
  });
});
