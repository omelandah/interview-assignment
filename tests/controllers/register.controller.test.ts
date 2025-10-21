import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../src/constants/httpStatus';
import registerController from '../../src/controllers/register.controller';
import registerService from '../../src/services/register.service';
import * as errorHandler from '../../src/utils/errorHandler';

jest.mock('../../src/services/register.service');
jest.mock('../../src/utils/errorHandler');

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

  it('should delegate error handling to handleErrorResponse when service throws', async () => {
    const mockError = new Error('DB connection failed');
    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      mockError
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      mockError,
      'registerStudents'
    );
  });

  it('should handle unexpected non-Error types', async () => {
    (registerService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
      'some string'
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      students: ['student1@gmail.com'],
    };

    await registerController.registerStudents(req as Request, res as Response);

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      'some string',
      'registerStudents'
    );
  });
});
