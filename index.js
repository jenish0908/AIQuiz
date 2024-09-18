const { Groq } = require("groq-sdk");
const mongoose = require("mongoose");
const conn = require("./service/db");
const Submission = require("./schema/submissionModel");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API });

// const main = async () => {
//   const quizParams = {
//     grade: 5,
//     subject: "Maths",
//     totalQuestions: 10,
//     difficulty: "EASY",
//   };

//   const chatCompletion = await generateQuiz(quizParams);

//   console.log(chatCompletion.choices[0]?.message?.content || "");
// };

// const generateQuiz = async ({ grade, subject, totalQuestions, difficulty }) => {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are an AI that generates quizzes. Your task is to generate quizzes for students based on the provided parameters.",
//       },
//       {
//         role: "user",
//         content: `Generate a quiz for grade ${grade} students on the subject of ${subject}. The quiz should contain ${totalQuestions} questions with a difficulty level of ${difficulty}. Return the quiz in the following JSON format:
//         {
//           "quiz": {
//             "title": "string",
//             "gradeLevel": ${grade},
//             "subject": "${subject}",
//             "questions": [
//               {
//                 "questionText": "string",
//                 "options": ["string", "string", "string", "string"],
//                 "correctAnswer": "string"
//               }
//             ]
//           }
//         }`,
//       },
//     ],

//     model: "llama3-8b-8192",
//     temperature: 0.7,
//     max_tokens: 1024,
//     top_p: 1,
//     stop: null,
//     stream: false,
//   });
// };

// main();

async function getFilteredSubmissions({
  userId,
  grade,
  subject,
  minScore,
  completedAfter,
}) {
  try {
    const filteredSubmissions = await Submission.aggregate([
      {
        // Lookup to join Quiz collection
        $lookup: {
          from: "quizzes", // Name of the 'quizzes' collection in MongoDB
          localField: "quizId", // The field in `submissions` that refers to `quizzes`
          foreignField: "_id", // The field in `quizzes` that `quizId` corresponds to
          as: "quizDetails", // Alias for the quiz data being merged
        },
      },
      {
        // Unwind to flatten the joined quizDetails array
        $unwind: "$quizDetails",
      },
      {
        // Match to filter based on conditions
        $match: {
          ...(userId ? { userId: mongoose.Types.ObjectId(userId) } : {}),
          ...(grade ? { "quizDetails.gradeLevel": grade } : {}), // Match grade level if provided
          ...(subject ? { "quizDetails.subject": subject } : {}), // Match subject if provided
          ...(minScore
            ? { "attempts.score": { $gte: minScore.toString() } }
            : {}), // Filter by score
          ...(completedAfter
            ? { "attempts.submittedAt": { $gte: new Date(completedAfter) } }
            : {}), // Filter by completed date
        },
      },
      {
        // Optional: Project only the necessary fields in the final result
        $project: {
          _id: 1,
          userId: 1,
          quizId: 1,
          "quizDetails.title": 1,
          "quizDetails.subject": 1,
          "quizDetails.gradeLevel": 1,
          attempts: 1, // Keep the attempts data
        },
      },
    ]);

    return filteredSubmissions;
  } catch (err) {
    console.error("Error retrieving submissions:", err);
    throw err;
  }
}

// Example usage
getFilteredSubmissions({
  // grade: 10,
  subject: "Maths",
  // minScore: 10,
  // completedAfter: "2024-09-01",
})
  .then((submissions) => {
    console.log("Filtered Submissions:", submissions);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
