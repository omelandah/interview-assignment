import { Request, Response } from 'express';
import suspendService from '../services/suspend.service';

const suspendStudent = async (req: Request, res: Response) => {
  try {
    const { student } = req.body as { student: string };

    if (!student) {
      return res.status(400).json({ message: 'Student email is required' });
    }

    await suspendService.suspendStudent(student);

    return res.status(204).send();
  } catch (err: unknown) {
    const error = err as Error;
    return res
      .status(500)
      .json({ message: error.message || 'Internal Server Error' });
  }
};

export default {
  suspendStudent,
};
