import { Response } from 'express';
import { handleErrorResponse } from '../../src/utils/errorHandler';
import { HTTP_STATUS } from '../../src/constants/httpStatus';

describe('handleErrorResponse', () => {
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = { status: statusMock, json: jsonMock };
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log context and return 404 if error message includes "not found"', () => {
    const error = new Error('Teacher not found');
    handleErrorResponse(res as Response, error, 'testContext');

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error in testContext:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Teacher not found' });
  });

  it('should log context and return 500 with error message for other Error instances', () => {
    const error = new Error('DB connection failed');
    handleErrorResponse(res as Response, error, 'dbTest');

    expect(consoleErrorMock).toHaveBeenCalledWith('Error in dbTest:', error);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'DB connection failed' });
  });

  it('should return 500 with default message if Error has no message', () => {
    const error = new Error();
    // @ts-ignore
    delete error.message;

    handleErrorResponse(res as Response, error, 'noMessageTest');

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error in noMessageTest:',
      error
    );
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });

  it('should log unexpected error and return 500 for non-Error types', () => {
    const error = 'Some random string';
    handleErrorResponse(res as Response, error);

    expect(consoleErrorMock).toHaveBeenCalledWith('Unexpected error:', error);
    expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unexpected error' });
  });
});
