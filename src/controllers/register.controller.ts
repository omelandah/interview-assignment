import registerService from '../services/register.service';
import { Request, Response } from 'express';

const registerStudents = async (req: Request, res: Response) => {
  try {
    const { teacher, students } = req.body;

    if (!teacher || !students || !Array.isArray(students)) {
      return res
        .status(400)
        .json({ error: 'teacher and students are required' });
    }

    await registerService.registerStudentstoTeacher(teacher, students);

    return res.sendStatus(204);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('Error in registerStudents: ', err);
      if (err.message.includes('not found')) {
        return res.status(404).json({ error: err.message });
      }

      return res.status(500).json({ error: 'Failed to register students' });
    }

    console.error('Unexpected error in registerStudents:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
};

export default {
  registerStudents,
};
