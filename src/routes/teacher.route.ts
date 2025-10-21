import express from 'express';
import teacherController from '../controllers/teacher.controller';
import { normalizeEmails } from '../middlewares/normalizeEmails';

const route = express.Router();

/**
 * @openapi
 * /register:
 *  post:
 *    summary: Register students to a teacher
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              teacher:
 *                type: string
 *                example: teacherken@gmail.com
 *              students:
 *                type: array
 *                items:
 *                  type: string
 *                example: ["studentjon@example.com", "studenthon@example.com"]
 *    responses:
 *      204:
 *        description: Students successfully registered
 */
route.post(
  '/register',
  normalizeEmails(['teacher', 'students']),
  teacherController.registerStudents
);

/**
 * @openapi
 * /commonstudents:
 *   get:
 *     summary: Retrieve common students for one or more teachers
 *     parameters:
 *       - in: query
 *         name: teacher
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: List of teacher emails
 *         example: teacherken@gmail.com&teacherjoe@gmail.com
 *     responses:
 *       200:
 *         description: List of students common to the given teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
 */
route.get(
  '/commonstudents',
  normalizeEmails(['teacher']),
  teacherController.getCommonStudents
);

/**
 * @openapi
 * /suspend:
 *   post:
 *     summary: Suspend a student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student:
 *                 type: string
 *                 example: studentmary@example.com
 *     responses:
 *       204:
 *         description: Student successfully suspended
 */
route.post(
  '/suspend',
  normalizeEmails(['student']),
  teacherController.suspendStudent
);

/**
 * @openapi
 * /retrievefornotifications:
 *   post:
 *     summary: Retrieve students eligible for notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher:
 *                 type: string
 *                 example: teacherken@gmail.com
 *               notification:
 *                 type: string
 *                 example: "Hello students! @studentagnes@example.com"
 *     responses:
 *       200:
 *         description: List of students who should receive the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipients:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["studentjon@example.com", "studentagnes@example.com"]
 */
route.post(
  '/retrievefornotifications',
  normalizeEmails(['teacher']),
  teacherController.retrieveForNotifications
);

export default route;
