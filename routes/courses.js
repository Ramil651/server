const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/auth');

router.get('/list', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCourse = await Course.create(req.body);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, lectures, practices } = req.body;
    try {
        const updatedCourse = await Course.findByIdAndUpdate(id, { name, description, lectures, practices }, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Course.findByIdAndDelete(id);
        res.json({ message: 'Course deleted' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const courses = await Course.find();
        const enrollments = await Enrollment.find({ userId });
        const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId.toString());
        const coursesWithEnrollmentStatus = courses.map(course => {
            return {
                ...course.toObject(),
                enrolled: enrolledCourseIds.includes(course._id.toString())
            };
        });
        res.json(coursesWithEnrollmentStatus);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:courseId/enroll', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { courseId } = req.params;
    try {
        const existingEnrollment = await Enrollment.findOne({ userId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }
        const enrollment = new Enrollment({ userId, courseId, enrollmentDate: new Date() });
        await enrollment.save();
        const course = await Course.findById(courseId);
        const progress = new Progress({
            userId,
            courseId,
            lectureProgress: Array(course.lectures.length).fill(false),
            practiceProgress: Array(course.practices.length).fill(false)
        });
        await progress.save();
        res.json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
