require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollment');
const adminRoutes = require('./routes/admin');
const app = express();

const PORT = process.env.SERVER_PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/enrollment', enrollmentRoutes);
app.use('/admin', adminRoutes);

const start = async () => {
    try {
        await mongoose.connect(process.env.BD_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
        });
    } catch (e) {
        console.error('Ошибка при запуске сервера:', e.message);
        process.exit(1);
    }
};

start();
