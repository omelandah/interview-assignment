import { Request, Response } from 'express';
import retrieveForNotiController from '../../src/controllers/retrieveForNoti.controller';
import retrieveForNotiService from '../../src/services/retrieveForNoti.service';
import { HTTP_STATUS } from '../../src/constants/httpStatus';

jest.mock('../../src/services/retrieveForNoti.service');

describe('retrieveForNotiController.retrieveForNotifications', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  const mockGetRecipients = retrieveForNotiService.getRecipients as jest.Mock;

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
    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello @student1@gmail.com',
    };
    mockGetRecipients.mockResolvedValue([
      'student1@gmail.com',
      'student2@gmail.com',
    ]);

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(mockGetRecipients).toHaveBeenCalledWith(
      'teacher@gmail.com',
      'Hello @student1@gmail.com'
    );
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      recipients: ['student1@gmail.com', 'student2@gmail.com'],
    });
  });

  it('should return 404 if teacher not found', async () => {
    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello students',
    };
    mockGetRecipients.mockRejectedValue(new Error('Teacher not found'));

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Teacher not found' });
  });

  it('should return 500 for other service errors', async () => {
    req.body = {
      teacher: 'teacher@gmail.com',
      notification: 'Hello students',
    };
    mockGetRecipients.mockRejectedValue(new Error('DB error'));

    await retrieveForNotiController.retrieveForNotifications(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
