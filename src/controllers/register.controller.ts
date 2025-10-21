import registerService from '../services/register.service';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { handleErrorResponse } from '../utils/errorHandler';

const registerStudents = async (req: Request, res: Response) => {
  try {
    const { teacher, students } = req.body;

    if (!teacher || !students || !Array.isArray(students)) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'teacher and students are required' });
    }

    await registerService.registerStudentsToTeacher(teacher, students);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    return handleErrorResponse(res, error, 'registerStudents');
  }
};

export default {
  registerStudents,
};
