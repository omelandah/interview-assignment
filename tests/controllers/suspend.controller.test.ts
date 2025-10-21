import { Request, Response } from 'express';
import suspendController from '../../src/controllers/suspend.controller';
import suspendService from '../../src/services/suspend.service';
import * as errorHandler from '../../src/utils/errorHandler';
import { HTTP_STATUS } from '../../src/constants/httpStatus';

jest.mock('../../src/services/suspend.service');
jest.mock('../../src/utils/errorHandler');

describe('suspendController.suspendStudent', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();

    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if student email is missing', async () => {
    req.body = {};

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Student email is required',
    });
  });

  it('should call service and return 204 on success', async () => {
    req.body = { student: 'student1@gmail.com' };
    (suspendService.suspendStudent as jest.Mock).mockResolvedValue(true);

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(suspendService.suspendStudent).toHaveBeenCalledWith(
      'student1@gmail.com'
    );
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
    expect(sendMock).toHaveBeenCalled();
  });

  it('should call handleErrorResponse when service throws an error', async () => {
    const mockError = new Error('DB error');
    (suspendService.suspendStudent as jest.Mock).mockRejectedValue(mockError);

    req.body = { student: 'student1@gmail.com' };

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      mockError,
      'suspendStudent'
    );
  });

  it('should call handleErrorResponse for non-Error thrown types', async () => {
    (suspendService.suspendStudent as jest.Mock).mockRejectedValue(
      'random error'
    );

    req.body = { student: 'student1@gmail.com' };

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      'random error',
      'suspendStudent'
    );
  });
});
