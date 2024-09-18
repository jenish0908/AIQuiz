const { Groq } = require("groq-sdk");
const express = require("express");
const dotenv = require("dotenv");
const QuizModel = require("../schema/quizModel");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API });

exports.generateQuiz = async (req, res) => {
  const quizParams = {
    grade: req.body.grade,
    subject: req.body.subject,
    totalQuestions: req.body.totalQuestions,
    difficulty: req.body.difficulty,
  };

  console.log(quizParams);

  try {
    const quiz = await generateHelper(quizParams);
    const quizString = quiz.choices[0]?.message?.content || "";
    const quizJSON = extractJsonFromString(quizString);

    const newQuiz = new QuizModel({
      title: quizJSON.quiz.title,
      gradeLevel: quizJSON.quiz.gradeLevel,
      subject: quizJSON.quiz.subject,
      questions: quizJSON.quiz.questions,
    });

    const savedQuiz = await newQuiz.save();

    res
      .status(200)
      .json({ message: "Quiz saved successfully", quiz: savedQuiz });
    // res.status(200).json(quizJSON);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const extractJsonFromString = (quizString) => {
  const jsonString = quizString.match(/{[\s\S]*}/)[0];
  return JSON.parse(jsonString);
};

const generateHelper = async ({
  grade,
  subject,
  totalQuestions,
  difficulty,
}) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an AI that generates quizzes. Your task is to generate quizzes for students based on the provided parameters.",
      },
      {
        role: "user",
        content: `Generate a quiz for grade ${grade} students on the subject of ${subject}. The quiz should contain ${totalQuestions} questions with a difficulty level of ${difficulty}. Return the quiz in the following JSON format:
        {
          "quiz": {
            "title": "string",
            "gradeLevel": ${grade},
            "subject": "${subject}",
            "questions": [
              {
                "questionText": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": "string"
              }
            ]
          }
        }`,
      },
    ],

    model: "llama3-8b-8192",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: false,
  });
};
