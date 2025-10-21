import commonStudentsService from '../services/commonStudents.service';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { handleErrorResponse } from '../utils/errorHandler';

const getCommonStudents = async (req: Request, res: Response) => {
  try {
    const teacherEmails = req.query.teacher;

    if (!teacherEmails) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Teacher email is required' });
    }
    const emailList = Array.isArray(teacherEmails)
      ? teacherEmails
      : [teacherEmails];

    const commonStudents = await commonStudentsService.getCommonStudents(
      emailList as string[]
    );

    return res.status(HTTP_STATUS.OK).json({ students: commonStudents });
  } catch (error) {
    return handleErrorResponse(res, error, 'getCommonStudents');
  }
};

export default {
  getCommonStudents,
};
