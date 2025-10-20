import { Request, Response } from 'express';
import suspendController from '../../src/controllers/suspend.controller';
import suspendService from '../../src/services/suspend.service';

jest.mock('../../src/services/suspend.service');

describe('suspendController.suspendStudent', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  const mockSuspendStudent = suspendService.suspendStudent as jest.Mock;

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

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Student email is required',
    });
  });

  it('should call service and return 204 on success', async () => {
    req.body = { student: 'student1@gmail.com' };
    mockSuspendStudent.mockResolvedValue(true);

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(mockSuspendStudent).toHaveBeenCalledWith('student1@gmail.com');
    expect(statusMock).toHaveBeenCalledWith(204);
    expect(sendMock).toHaveBeenCalled();
  });

  it('should return 500 if service throws an error', async () => {
    req.body = { student: 'student1@gmail.com' };
    mockSuspendStudent.mockRejectedValue(new Error('DB error'));

    await suspendController.suspendStudent(req as Request, res as Response);

    expect(mockSuspendStudent).toHaveBeenCalledWith('student1@gmail.com');
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'DB error' });
  });
});
