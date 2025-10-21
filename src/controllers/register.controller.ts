import registerService from '../services/register.service';
import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('Error in registerStudents: ', err);
      if (err.message.includes('not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: err.message });
      }

      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || 'Failed to register students' });
    }

    console.error('Unexpected error in registerStudents:', err);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: 'Unexpected error' });
  }
};

export default {
  registerStudents,
};
