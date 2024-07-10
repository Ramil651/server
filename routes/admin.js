const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');

router.post('/courses', async (req, res) => {
    try {
        const { name, description, lectures, practices } = req.body;
        const newCourse = new Course({ name, description, lectures, practices });
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/courses/:id', async (req, res) => {
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

router.delete('/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Course.findByIdAndDelete(id);
        res.json({ message: 'Course deleted' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/courses/:id', async (req, res) => {
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

module.exports = router;
