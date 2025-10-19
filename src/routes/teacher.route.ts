import express from 'express';
import registerController from '../controllers/register.controller';
import commonStudentsController from '../controllers/commonStudents.controller';
import suspendController from '../controllers/suspend.controller';
import retrieveForNotiController from '../controllers/retrieveForNoti.controller';

const route = express.Router();

route.post('/register', registerController.registerStudents);

route.get('/commonstudents', commonStudentsController.getCommonStudents);

route.post('/suspend', suspendController.suspendStudent);

route.post(
  '/retrievefornotifications',
  retrieveForNotiController.retrieveForNotifications
);

export default route;
