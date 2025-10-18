import express from 'express';
import teacherRoute from './teacher.route';

const route = express.Router();

route.use('/', teacherRoute);

export default route;
