import express from 'express';
import registerController from '../controllers/register.controller';

const route = express.Router();
route.get('/register', registerController.registerStudents);

export default route;
