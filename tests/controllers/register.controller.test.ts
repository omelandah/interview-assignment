import { Request, Response } from 'express';
import registerController from '../../src/controllers/register.controller';
import registerService from '../../src/services/register.service';
import { HTTP_STATUS } from '../../src/constants/httpStatus';

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

  it('should return 400 if teacher or students are missing or invalid', async () => {
    req.body = { teacher: 'teacher@gmail.com' }; // missing students

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'teacher and students are required',
    });
  });

  it('should call service and return 204 on success', async () => {
    (registerService.registerStudentsToTeacher as jest.Mock).mockResolvedValue(
      true
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com', 'student2@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(registerService.registerStudentsToTeacher).toHaveBeenCalledWith(
      'teacher@gmail.com',
      ['student1@gmail.com', 'student2@gmail.com']
    );
    expect(sendStatusMock).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
  });

  it('should return 404 if service throws a "not found" error', async () => {
    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      new Error('Teacher with email "teacher@gmail.com" not found')
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Teacher with email "teacher@gmail.com" not found',
    });
  });

  it('should return 500 with err.message when service throws other error', async () => {
    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      new Error('DB connection failed')
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'DB connection failed',
    });
  });

  it('should return 500 with default message when err.message is undefined', async () => {
    const err = new Error();
    // @ts-ignore
    delete err.message;

    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      err
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Failed to register students',
    });
  });

  it('should return 500 for unexpected non-Error type', async () => {
    // @ts-ignore simulate throwing a random string
    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      'Some random string'
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Unexpected error',
    });
  });
});
