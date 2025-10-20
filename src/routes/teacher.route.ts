import express from 'express';
import registerController from '../controllers/register.controller';
import commonStudentsController from '../controllers/commonStudents.controller';
import suspendController from '../controllers/suspend.controller';
import retrieveForNotiController from '../controllers/retrieveForNoti.controller';
import { normalizeEmails } from '../middlewares/normalizeEmails';

const route = express.Router();

route.post(
  '/register',
  normalizeEmails(['teacher', 'students']),
  registerController.registerStudents
);

route.get(
  '/commonstudents',
  normalizeEmails(['teacher']),
  commonStudentsController.getCommonStudents
);

route.post(
  '/suspend',
  normalizeEmails(['student']),
  suspendController.suspendStudent
);

route.post(
  '/retrievefornotifications',
  normalizeEmails(['teacher']),
  retrieveForNotiController.retrieveForNotifications
);

export default route;
