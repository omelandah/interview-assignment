import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import retrieveForNotiService from '../services/retrieveForNoti.service';

const retrieveForNotifications = async (req: Request, res: Response) => {
  try {
    const { teacher, notification } = req.body;

    if (!teacher || !notification) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Teacher and notification are required.' });
    }

    const recipients = await retrieveForNotiService.getRecipients(
      teacher,
      notification
    );

    res.status(HTTP_STATUS.OK).json({ recipients });
  } catch (error) {
    if (error instanceof Error && error.message === 'Teacher not found') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: error.message });
    }
    console.error('Error in retrieveForNotifications:', error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

export default {
  retrieveForNotifications,
};
