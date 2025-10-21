import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import retrieveForNotiService from '../services/retrieveForNoti.service';
import { handleErrorResponse } from '../utils/errorHandler';

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
    return handleErrorResponse(res, error, 'retrieveForNotifications');
  }
};

export default {
  retrieveForNotifications,
};
