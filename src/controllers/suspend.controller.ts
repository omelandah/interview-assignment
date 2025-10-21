import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import suspendService from '../services/suspend.service';
import { handleErrorResponse } from '../utils/errorHandler';

const suspendStudent = async (req: Request, res: Response) => {
  try {
    const { student } = req.body as { student: string };

    if (!student) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Student email is required' });
    }

    await suspendService.suspendStudent(student);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    return handleErrorResponse(res, error, 'suspendStudent');
  }
};

export default {
  suspendStudent,
};
