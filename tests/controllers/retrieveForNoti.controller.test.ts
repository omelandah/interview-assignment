import { Request, Response } from 'express';
import retrieveForNotiController from '../../src/controllers/retrieveForNoti.controller';
import retrieveForNotiService from '../../src/services/retrieveForNoti.service';
import { HTTP_STATUS } from '../../src/constants/httpStatus';
import * as errorHandler from '../../src/utils/errorHandler';

jest.mock('../../src/services/retrieveForNoti.service');
jest.mock('../../src/utils/errorHandler');

describe('retrieveForNotiController.retrieveForNotifications', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {};
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if teacher or notification is missing', async () => {
    req.body = { teacher: 'teacher@gmail.com' }; // missing notification

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Teacher and notification are required.',
    });
  });

  it('should return 200 with recipients on success', async () => {
    (retrieveForNotiService.getRecipients as jest.Mock).mockResolvedValue([
      'student1@gmail.com',
      'student2@gmail.com',
    ]);

    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello @student1@gmail.com',
    };

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(retrieveForNotiService.getRecipients).toHaveBeenCalledWith(
      'teacher@gmail.com',
      'Hello @student1@gmail.com'
    );
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      recipients: ['student1@gmail.com', 'student2@gmail.com'],
    });
  });

  it('should call handleErrorResponse when service throws an error', async () => {
    const mockError = new Error('DB error');
    (retrieveForNotiService.getRecipients as jest.Mock).mockRejectedValue(
      mockError
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello students',
    };

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      mockError,
      'retrieveForNotifications'
    );
  });

  it('should call handleErrorResponse for non-Error thrown types', async () => {
    (retrieveForNotiService.getRecipients as jest.Mock).mockRejectedValue(
      'random error'
    );

    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello students',
    };

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(errorHandler.handleErrorResponse).toHaveBeenCalledWith(
      res,
      'random error',
      'retrieveForNotifications'
    );
  });
});
