import { Request, Response } from 'express';
import commonStudentsController from '../../src/controllers/commonStudents.controller';
import commonStudentsService from '../../src/services/commonStudents.service';
import { HTTP_STATUS } from '../../src/constants/httpStatus';

jest.mock('../../src/services/commonStudents.service');

describe('commonStudentsController.getCommonStudents', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockGetCommonStudents =
    commonStudentsService.getCommonStudents as jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    req = {};
    res = { status: statusMock, json: jsonMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if teacher query param is missing', async () => {
    req.query = {};

    await commonStudentsController.getCommonStudents(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Teacher email is required',
    });
  });

  it('should call service and return 200 with students for single teacher', async () => {
    req.query = { teacher: 'teacher1@gmail.com' };
    mockGetCommonStudents.mockResolvedValue(['student1@gmail.com']);

    await commonStudentsController.getCommonStudents(
      req as Request,
      res as Response
    );

    expect(mockGetCommonStudents).toHaveBeenCalledWith(['teacher1@gmail.com']);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      students: ['student1@gmail.com'],
    });
  });

  it('should call service and return 200 with students for multiple teachers', async () => {
    req.query = { teacher: ['teacher1@gmail.com', 'teacher2@gmail.com'] };
    mockGetCommonStudents.mockResolvedValue(['commonstudent@gmail.com']);

    await commonStudentsController.getCommonStudents(
      req as Request,
      res as Response
    );

    expect(mockGetCommonStudents).toHaveBeenCalledWith([
      'teacher1@gmail.com',
      'teacher2@gmail.com',
    ]);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      students: ['commonstudent@gmail.com'],
    });
  });

  it('should return 500 if service throws an error', async () => {
    req.query = { teacher: 'teacher1@gmail.com' };
    mockGetCommonStudents.mockRejectedValue(new Error('DB failure'));

    await commonStudentsController.getCommonStudents(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'DB failure' });
  });
});
