-- Author: O R Imon <or.imon@tuni.fi>
-- Date: 2023-11-30

## Project Name: Student-Course Management System

-- This project briefly instructions  to setup and run

## Project Setup

## Install Dependencies
bash

## Install dependencies
npm i

# Install additional packages for the project
npm install express sequelize sqlite3

# Start the server
node app.js

# Launch the SQLite shell
sqlite3 db.sqlite

# See all tables
.tables

# See content of a table
SELECT * FROM Entity1;

# See the table structure
.schema Entity1

#Exit the SQLite shell
.exit


// POST endpoint to create a new student
curl -X POST -H "Content-Type: application/json" -d '{"firstName": "Doom", "lastName": "Doe"}' http://localhost:3000/students

// GET endpoint to retrieve a student with all courses
http://localhost:3000/students/1
curl http://localhost:3000/students/<studentId>

// POST endpoint to create a new course for a student
curl -X POST -H "Content-Type: application/json" -d '{"courseName": "CSE", "grade": 65}' http://localhost:3000/students/3/courses
