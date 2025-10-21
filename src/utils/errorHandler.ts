import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export const handleErrorResponse = (
  res: Response,
  error: unknown,
  context?: string
): Response => {
  if (context) console.error(`Error in ${context}:`, error);
  else console.error('Unexpected error:', error);

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: error.message });
    }

    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || 'Internal Server Error' });
  }

  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: 'Unexpected error' });
};
