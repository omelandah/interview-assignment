import teacherService from '../services/teacher.service';
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

    await teacherService.registerStudentsToTeacher(teacher, students);

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    return handleErrorResponse(res, error, 'registerStudents');
  }
};

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

    const commonStudents = await teacherService.getCommonStudents(
      emailList as string[]
    );

    return res.status(HTTP_STATUS.OK).json({ students: commonStudents });
  } catch (error) {
    return handleErrorResponse(res, error, 'getCommonStudents');
  }
};

const suspendStudent = async (req: Request, res: Response) => {
  try {
    const { student } = req.body as { student: string };

    if (!student) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Student email is required' });
    }

    await teacherService.suspendStudent(student);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    return handleErrorResponse(res, error, 'suspendStudent');
  }
};

const retrieveForNotifications = async (req: Request, res: Response) => {
  try {
    const { teacher, notification } = req.body;

    if (!teacher || !notification) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Teacher and notification are required.' });
    }

    const recipients = await teacherService.getRecipients(
      teacher,
      notification
    );

    res.status(HTTP_STATUS.OK).json({ recipients });
  } catch (error) {
    return handleErrorResponse(res, error, 'retrieveForNotifications');
  }
};

export default {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
};
