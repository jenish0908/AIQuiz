# API Documentation for Quiz AI Backend Application

## Overview

This documentation provides a comprehensive guide to the API endpoints available for the Quiz Backend Application. The application supports user authentication, quiz generation, submission evaluation, hint generation, and submission filtering.

## Postman Public Workspace

Public workspace link : [Click here](https://www.postman.com/lunar-satellite-180365/workspace/playpowerlabbackend-public)

### Authentication

The application uses JWT (JSON Web Tokens) for user authentication.

### Base URL

`http://localhost:3000/api`

### Production URL

`https://play-power-lab-backend.vercel.app/api`

## API Endpoints

### User Authentication

#### Register User

- **Endpoint:** `/register`
- **Method:** `POST`
- **Request Body:**

```
{
"username": "demo123",
"password": "demo@123"
}
```

- **Description:** Registers a new user and returns a JWT upon successful registration.

#### Login User

- **Endpoint:** `/login`
- **Method:** `POST`

- **Request Body:**

```
{
"username": "demo123",
"password": "demo@123"
}
```

- **Description:** Authenticates a user and returns a JWT token for subsequent requests.

---

### Quiz Management

#### Generate Quiz

- **Endpoint:** `/quiz/generate`
- **Method:** `POST`
- **Request Body:**

```
{
"grade": 10,
"subject": "Maths",
"totalQuestions": 10,
"difficulty": "HARD"
}
```

- **Description:** Generates a quiz based on the provided parameters and returns a JSON object containing quiz questions.

---

### Submission Management

#### Submit Quiz Responses

- **Endpoint:** `/submission/submit`
- **Method:** `POST`
- **Request Body:**

```
{
"quizId": "66e6b0817000b23949547a49",
"userId": "66e68241c31ca3cb75c87fa5",
"responses": [
{
"questionId": "66e6b0817000b23949547a4a",
"userResponse": "$400"
},
...
]
}

```

- **Description:** Submits the user's responses to a quiz for evaluation and returns the score.

#### Get User Submissions

- **Endpoint:** `/submission/getSubmissions`
- **Method:** `GET`
- **Request Body:**

```
{
"quizId": "66e6b0817000b23949547a49",
"userId": "66e68241c31ca3cb75c87fa5"
}

```

- **Description:** Retrieves all submissions made by a user for a specific quiz.

---

### Hint Generation

#### Generate Hint

- **Endpoint:** `/hint/generate-hint`
- **Method:** `POST`
- **Request Body:**

```
{
"questionId": "66e6b0817000b23949547a4d"
}
```

- **Description:** Generates and returns a hint for the specified question ID.

---

### Submission Filtering

#### Filter Submissions

- **Endpoint:** `/filters/filter`
- **Method:** `POST`
- **Request Body:**

```
{
"userId": "66e68241c31ca3cb75c87fa5",
"grade": 5,
"subject": "Maths",
"minScore": 10,
"from": "01-09-2024",
"to": "17-09-2024"
}
```

- **Description:** Filters user submissions based on specified parameters such as grade, subject, minimum score, and date range.

---

## Interactive API Explorer

- Use the interactive API explorer tool to test the endpoints directly. Simply input the required parameters and see the responses in real-time.

## Code Examples

### JavaScript (using Fetch)

```
fetch('http://localhost:3000/api/register', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({
username: 'demo123',
password: 'demo@123'
}),
})
.then(response => response.json())
.then(data => console.log(data));
```

### Python (using Requests)

```
import requests

response = requests.post('http://localhost:3000/api/register', json={
'username': 'demo123',
'password': 'demo@123'
})

print(response.json())
```
