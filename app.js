const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
});

const Students = sequelize.define('Student', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gpa: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
});

const Courses = sequelize.define('Course', {
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grade: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

Students.hasMany(Courses);
Courses.belongsTo(Students);

const PORT = process.env.PORT || 3000;

// Sync the database and start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});

// POST endpoint to create a new student
//curl -X POST -H "Content-Type: application/json" -d '{"firstName": "Doom", "lastName": "Doe"}' http://localhost:3000/students

app.post('/students', async(req, res) => {
    try {
        const { firstName, lastName, gpa } = req.body;

        // Create a new student
        const newStudent = await Students.create({
            firstName,
            lastName,
            gpa,
        });

        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// POST endpoint to create a new course for a student
//curl -X POST -H "Content-Type: application/json" -d '{"courseName": "CSE", "grade": 65}' http://localhost:3000/students/3/courses

app.post('/students/:studentId/courses', async(req, res) => {
    try {
        const studentId = req.params.studentId;
        const { courseName, grade } = req.body;

        // Find the student by ID
        const student = await Students.findByPk(studentId);

        // If the student doesn't exist, return a 404 Not Found
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create a new course associated with the student
        const newCourse = await Courses.create({
            courseName,
            grade,
            StudentId: student.id,
        });

        // Update the student's GPA based on the new course grade
        const newGPA = calculateNewGPA(student.gpa, grade);
        await student.update({ gpa: newGPA });

        res.status(201).json({ course: newCourse, updatedStudent: student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function to calculate the new GPA based on the course grade
function calculateNewGPA(currentGPA, courseGrade) {
    // Your GPA calculation logic here
    // For simplicity, let's assume a linear relationship between grade and GPA
    // You might want to customize this based on your actual GPA calculation formula
    const gradeToGPA = (grade) => grade / 20; // Example conversion, adjust as needed
    const newGPA = currentGPA + gradeToGPA(courseGrade);

    // Ensure the calculated GPA does not exceed 5
    const cappedGPA = Math.min(newGPA, 5);

    return cappedGPA;
}


// GET endpoint to retrieve a student with all courses
//curl http://localhost:3000/students/<studentId>

app.get('/students/:studentId', async(req, res) => {
    try {
        const studentId = req.params.studentId;

        // Find the student by ID with associated courses
        const student = await Students.findByPk(studentId, {
            include: Courses, // Include associated courses
        });

        // If the student doesn't exist, return a 404 Not Found
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});