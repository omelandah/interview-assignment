import teacherController from '../../src/controllers/teacher.controller';
import teacherService from '../../src/services/teacher.service';
import { HTTP_STATUS } from '../../src/constants/httpStatus';
import { handleErrorResponse } from '../../src/utils/errorHandler';

jest.mock('../../src/services/teacher.service');
jest.mock('../../src/utils/errorHandler');

const mockRequest = (body = {}, query = {}) =>
  ({
    body,
    query,
  }) as any;

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('teacherController', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registerStudents', () => {
    it('should return 204 when registration succeeds', async () => {
      const req = mockRequest({
        teacher: 't@example.com',
        students: ['s1@example.com'],
      });
      const res = mockResponse();

      (teacherService.registerStudentsToTeacher as jest.Mock).mockResolvedValue(
        true
      );

      await teacherController.registerStudents(req, res);

      expect(res.sendStatus).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 400 if teacher or students missing', async () => {
      const req = mockRequest({ teacher: 't@example.com' });
      const res = mockResponse();

      await teacherController.registerStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'teacher and students are required',
      });
    });

    it('should call handleErrorResponse on error', async () => {
      const req = mockRequest({
        teacher: 't@example.com',
        students: ['s1@example.com'],
      });
      const res = mockResponse();

      (teacherService.registerStudentsToTeacher as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await teacherController.registerStudents(req, res);

      expect(handleErrorResponse).toHaveBeenCalledWith(
        res,
        expect.any(Error),
        'registerStudents'
      );
    });
  });

  describe('getCommonStudents', () => {
    it('should return 200 with common students', async () => {
      const req = mockRequest(
        {},
        { teacher: ['t1@example.com', 't2@example.com'] }
      );
      const res = mockResponse();

      (teacherService.getCommonStudents as jest.Mock).mockResolvedValue([
        's1@example.com',
      ]);

      await teacherController.getCommonStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ students: ['s1@example.com'] });
    });

    it('should return 400 if teacher query missing', async () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      await teacherController.getCommonStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Teacher email is required',
      });
    });

    it('should call handleErrorResponse on error', async () => {
      const req = mockRequest({}, { teacher: 't1@example.com' });
      const res = mockResponse();

      (teacherService.getCommonStudents as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await teacherController.getCommonStudents(req, res);

      expect(handleErrorResponse).toHaveBeenCalledWith(
        res,
        expect.any(Error),
        'getCommonStudents'
      );
    });
  });

  describe('suspendStudent', () => {
    it('should return 204 when suspension succeeds', async () => {
      const req = mockRequest({ student: 's1@example.com' });
      const res = mockResponse();

      (teacherService.suspendStudent as jest.Mock).mockResolvedValue(undefined);

      await teacherController.suspendStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.NO_CONTENT);
    });

    it('should return 400 if student missing', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await teacherController.suspendStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Student email is required',
      });
    });

    it('should call handleErrorResponse on error', async () => {
      const req = mockRequest({ student: 's1@example.com' });
      const res = mockResponse();

      (teacherService.suspendStudent as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await teacherController.suspendStudent(req, res);

      expect(handleErrorResponse).toHaveBeenCalledWith(
        res,
        expect.any(Error),
        'suspendStudent'
      );
    });
  });

  describe('retrieveForNotifications', () => {
    it('should return 200 with recipients', async () => {
      const req = mockRequest({
        teacher: 't@example.com',
        notification: 'Hello @s1@example.com',
      });
      const res = mockResponse();

      (teacherService.getRecipients as jest.Mock).mockResolvedValue([
        's1@example.com',
      ]);

      await teacherController.retrieveForNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(res.json).toHaveBeenCalledWith({ recipients: ['s1@example.com'] });
    });

    it('should return 400 if teacher or notification missing', async () => {
      const req = mockRequest({ teacher: 't@example.com' });
      const res = mockResponse();

      await teacherController.retrieveForNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Teacher and notification are required.',
      });
    });

    it('should call handleErrorResponse on error', async () => {
      const req = mockRequest({
        teacher: 't@example.com',
        notification: 'Hello',
      });
      const res = mockResponse();

      (teacherService.getRecipients as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      await teacherController.retrieveForNotifications(req, res);

      expect(handleErrorResponse).toHaveBeenCalledWith(
        res,
        expect.any(Error),
        'retrieveForNotifications'
      );
    });
  });
});
