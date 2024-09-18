const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");
const QuizModel = require("../schema/quizModel");
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API });

exports.generateHint = async (req, res) => {
  const { questionId } = req.body;

  if (!questionId) {
    return res.status(400).json({ message: "Question ID is required" });
  }

  try {
    const quiz = await QuizModel.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = quiz.questions.id(questionId);
    const questionText = question?.questionText;

    if (!questionText) {
      return res.status(404).json({ message: "Question text not found" });
    }

    const hint = await generateHintFromAI(questionText);

    res.status(200).json({
      message: "Hint generated successfully",
      hint,
    });
  } catch (error) {
    console.error("Error generating hint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateHintFromAI = async (questionText) => {
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an AI that provides hints for quiz questions.",
      },
      {
        role: "user",
        content: `Provide a hint for the following question: "${questionText}"`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0.7,
    max_tokens: 150,
    top_p: 1,
    stop: null,
    stream: false,
  });

  const hint = response.choices[0]?.message?.content.trim();
  return hint;
};
