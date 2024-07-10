const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const enrollments = await Enrollment.find({ userId });
        const courses = await Course.find({ _id: { $in: enrollments.map(enrollment => enrollment.courseId) } });
        res.json(courses);
    } catch (error) {
        console.error('Ошибка при получении курсов пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/progress', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const progress = await Progress.find({ userId });
        res.json(progress);
    } catch (error) {
        console.error('Ошибка при получении прогресса пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
