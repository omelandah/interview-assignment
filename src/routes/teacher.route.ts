import express from 'express';
import registerController from '../controllers/register.controller';
import commonStudentsController from '../controllers/commonStudents.controller';

const route = express.Router();

route.post('/register', registerController.registerStudents);

route.get('/commonstudents', commonStudentsController.getCommonStudents);

export default route;
