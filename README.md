
**# WorkShare – AI-Powered Employability Platform**

## Overview

WorkShare is a full-stack AI-powered platform designed to improve student employability by combining resume analysis, project-based learning, mentorship, and recruitment into a unified ecosystem.

The platform connects students, mentors, recruiters, and administrators, enabling structured skill development, evaluation, and hiring.



## Aim of the Project

WorkShare aims to:

* Enhance employability using AI-driven resume analysis
* Provide real-world project experience
* Enable mentorship and guided learning
* Simplify hiring for recruiters
* Bridge the gap between students and industry


## Key Features

### Student

* AI-based resume analysis with scoring and suggestions
* Project-based learning system
* Interview preparation support
* Access to mentorship sessions
* Visibility to recruiters

### Mentor

* Create and manage projects
* Review student submissions
* Conduct mentorship sessions

### Recruiter

* Search and filter candidates
* View resume insights and analytics
* Schedule interviews
* Hire candidates

### Admin

* Manage users (students, mentors, recruiters)
* Monitor platform activity
* Control and moderate the system

## Tech Stack

### Frontend

* React.js / Next.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### AI Integration

* Groq API (LLaMA models) for resume analysis

### File Handling

* Multer for file uploads
* pdf-parse / mammoth for resume text extraction


## Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/workshare.git
cd workshare
```

### 2. Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secret_key
```


### 4. Run the Project

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend

```bash
cd client
npm run dev
```

## System Architecture

```
Client (React / Next.js)
        ↓
Backend (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
AI Layer (Groq API - LLaMA)
```

---

## Workflow

1. User registers and selects a role
2. Student uploads resume
3. AI analyzes the resume and provides score and suggestions
4. Student works on projects and mentorship
5. Recruiters browse candidates
6. Interviews are scheduled and hiring is completed


## Future Enhancements

* Real-time recruiter dashboard
* Advanced resume analytics breakdown
* AI-based mock interview system
* Subscription-based premium features
* Live notification system

## Contribution

Contributions are welcome.

1. Fork the repository
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Commit and push
6. Open a pull request

## License

This project is licensed under the MIT License.


## Author

Nishant Raj Jha

