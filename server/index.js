const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import JWT for token creation
const EmployeeModel = require('./models/Employee');
const Submission = require('./models/Submission');
const Exam = require('./models/Exam'); // Import the Exam model
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/employees")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
console.log("MongoDB connection established.");
// JWT secret key 
const JWT_SECRET = 'your_jwt_secret_key'; 



// Login route
app.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await EmployeeModel.findOne({ email: email });
       
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
    
        // Check if the password is correct
        console.log(password, user.password)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordValid); // Log for debugging
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Payload includes user ID and role
            JWT_SECRET, // Secret key for encoding
            { expiresIn: '1h' } // Token expiration time (1 hour in this case)
        );

        res.json({
            message: "Login successful",
            token:token, // Send the token in response
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Register route
app.post('/register', async (req, res) => {
   
    console.log("Register route hit"); // Log for debugging
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, email, password, and role are required.' });
    }

    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Choose either "student" or "teacher".' });
    }

    try {
        const cleanPassword = password.trim();  // Trim spaces from password

        // Check if the user already exists
        const existingEmployee = await EmployeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email is already in use.' });
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);

        const newEmployee = new EmployeeModel({
            name,
            email,
            password: hashedPassword,
            role
        });
        console.log("New employee object:", newEmployee); // Log for debugging

        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);

    } catch (err) {
        console.error('Error saving employee:', err);
        res.status(500).json({ message: 'Error saving employee', error: err });
    }
});

// Middleware to check JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from 'Authorization' header
    
    if (!token) {
        return res.status(403).json({ message: 'Access Denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded); // Log for debugging
        req.user = decoded;  // Store decoded token data in the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};


// Route to fetch student data
app.get('/student', verifyToken, async (req, res) => {
    try {
        console.log("Fetching student data for ID:", req.user.userId);

        // Use the user ID stored in the token to fetch user data
        const user = await EmployeeModel.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user data in the response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Route to fetch teacher data
app.get('/teacher', verifyToken, async (req, res) => {
    try {
        console.log("Fetching teacher data for ID:", req.user.userId);

        // Check if the user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access Denied: Not a teacher' });
        }

        // Use the user ID stored in the token to fetch user data
        const user = await EmployeeModel.findById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send teacher data in the response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error fetching teacher data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




// Create new exam
app.post('/api/exams', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const teacherId = req.user.userId;  // Get teacher ID from JWT token
  
    try {
      const newExam = new Exam({ title, description, teacherId });
      await newExam.save();
      res.status(201).json(newExam);
    } catch (error) {
      console.error('Error creating exam:', error);
      res.status(500).json({ message: 'Server error' });
    }
});
  
// Get single exam by ID
app.get('/api/exams/:examId', async (req, res) => {
  const { examId } = req.params;

  // Validate if examId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return res.status(400).json({ message: 'Invalid exam ID format' });
  }

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(400).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// PUT route to update an exam
app.put('/api/exams/:examId', async (req, res) => {
  const { examId } = req.params; // Get the examId from the URL parameter
  const { title, description, targetAudience, examLink, questions, media } = req.body; // Get data from request body

  try {
    // Find the exam by ID and update it
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      {
        title,
        description,
        targetAudience,
        examLink,
        questions, // Update questions field
        media,
      },
      { new: true } // Return the updated document
    );

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Return the updated exam document
    res.json(updatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});






// Get all exams
app.get('/api/exams', verifyToken, async (req, res) => {
    try {
      const teacherId = req.user.userId; // Get teacher ID from JWT token
      const exams = await Exam.find({ teacherId }); // Filter exams by teacherId
      res.json(exams);
    } catch (error) {
      console.error('Error fetching exams:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Route to generate a unique link for an exam
  app.post('/api/exams/:examId/generate-link', async (req, res) => {
    const { examId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({ message: 'Invalid exam ID format' });
    }
  
    try {
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
  
      const uniqueLink = `http://localhost:5173/question/${examId}`;
      res.json({ link: uniqueLink });
  
    } catch (error) {
      console.error('Error generating link:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
 
  
  

 app.get('/api/exams/:id', (req, res) => {
    const examId = req.params.id;
    // Ensure examId is valid and handle accordingly
    Exam.findById(examId)
      .then(exam => {
        if (!exam) return res.status(404).send({ message: 'Exam not found' });
        res.status(200).send(exam);
      })
      .catch(err => res.status(400).send({ message: 'Error fetching exam' }));
  });




  
 // Route to edit an exam (update exam and its questions)
app.put('/api/exams/edit/:examId', async (req, res) => {
    try {
      const { examId } = req.params; // Get the exam ID from URL parameters
      const { questions } = req.body; // Get the questions data from the request body
  
      // Find the exam by ID
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
  
      // Loop through each question in the provided data and update it
      exam.questions.forEach((question, index) => {
        const updatedQuestion = questions[index]; // The updated question sent from the client
        
        // If the question type is 'direct', store the actual correct answer (not an index)
        if (updatedQuestion.questionType === 'direct') {
          question.correctAnswer = updatedQuestion.correctAnswer;  // Store the direct answer value
        } else if (updatedQuestion.questionType === 'multiple-choice') {
          question.correctAnswer = updatedQuestion.correctAnswerIndex;  // Store the index for multiple-choice questions
        }
      });
  
      // Save the updated exam document
      await exam.save();
  
      // Send a response back indicating the exam was updated
      res.status(200).json({ message: 'Exam updated successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while updating exam' });
    }
  });
  
  
  

// Route to submit answers for an exam
app.post('/api/submissions/submit', async (req, res) => {
    const { studentId, examId, answers } = req.body; // Get data from request body

    try {
        // Create a new submission document
        const newSubmission = new Submission({
            studentId,
            examId,
            answers,
        });

        // Save the submission to the database
        await newSubmission.save();
        res.status(201).json({ message: 'Submission successful', submission: newSubmission });
    } catch (error) {
        console.error('Error submitting answers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
 
// Route to fetch submissions for a specific student
app.get('/api/submissions/student/:studentId', async (req, res) => {
    const { studentId } = req.params; // Get student ID from URL parameters

    try {
        // Fetch submissions for the specified student
        const submissions = await Submission.find({ studentId }).populate('examId'); // Populate examId to get exam details

        if (!submissions.length) {
            return res.status(404).json({ message: 'No submissions found for this student' });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/exams/:examId/submit', (req, res) => {
  const { examId } = req.params;
  const { answers } = req.body;

  // Log answers before saving
  console.log('Saving answers for examId:', examId, 'Answers:', answers);

  ExamSubmission.create({ examId, answers })
    .then(submission => {
      res.status(200).json(submission);
    })
    .catch(error => {
      console.error('Error saving submission:', error);
      res.status(500).json({ message: 'Error saving submission' });
    });
});

// Start server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});