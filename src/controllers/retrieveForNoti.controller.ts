import { Request, Response } from 'express';
import retrieveForNotiService from '../services/retrieveForNoti.service';

const retrieveForNotifications = async (req: Request, res: Response) => {
  try {
    const { teacher, notification } = req.body;

    if (!teacher || !notification) {
      return res
        .status(400)
        .json({ message: 'Teacher and notification are required.' });
    }

    const recipients = await retrieveForNotiService.getRecipients(
      teacher,
      notification
    );

    res.status(200).json({ recipients });
  } catch (error) {
    if (error instanceof Error && error.message === 'Teacher not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error in retrieveForNotifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  retrieveForNotifications,
};
