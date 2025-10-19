import commonStudentsService from '../services/commonStudents.service';
import { Request, Response } from 'express';

const getCommonStudents = async (req: Request, res: Response) => {
  try {
    const teacherEmails = req.query.teacher;

    if (!teacherEmails) {
      return res.status(400).json({ message: 'Teacher email is required' });
    }
    const emailList = Array.isArray(teacherEmails)
      ? teacherEmails
      : [teacherEmails];

    const commonStudents = await commonStudentsService.getCommonStudents(
      emailList as string[]
    );

    return res.status(200).json({ students: commonStudents });
  } catch (err: unknown) {
    console.log('Error:', err);
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default {
  getCommonStudents,
};
