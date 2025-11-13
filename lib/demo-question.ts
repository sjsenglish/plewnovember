// Demo question for CSAT Reading Buddy onboarding

export const demoQuestion = {
  isDemo: true,
  objectID: "demo_q9",
  questionId: "demo_q9",
  actualQuestion: "다음 글의 주제로 가장 적절한 것은?",
  questionType: "다음 글의 주제로 가장 적절한 것은?",
  requiresPLEW: true,
  questionText: "The internet has opened access to more knowledge than at any other time in history. With a few clicks, people can find information on almost any subject. However, not all online information is reliable, and false claims can spread quickly. Because of this, critical thinking and careful evaluation are essential skills for internet users. Using the internet wisely means knowing how to separate trustworthy sources from misleading ones.",
  passage: "The internet has opened access to more knowledge than at any other time in history. With a few clicks, people can find information on almost any subject. However, not all online information is reliable, and false claims can spread quickly. Because of this, critical thinking and careful evaluation are essential skills for internet users. Using the internet wisely means knowing how to separate trustworthy sources from misleading ones.",
  answerOptions: [
    "① Mechanisms to ensure internet information is accurate.",
    "② How the internet reduces the need for critical thinking.",
    "③ Why only experts should use the internet for information.",
    "④ The internet's detrimental effect on the spread of knowledge.",
    "⑤ The internet's impact on knowledge and how we should use it."
  ],
  correctAnswer: "⑤ The internet's impact on knowledge and how we should use it.",
  correctAnswerNumber: 5,
  difficulty: "medium",
  subject: "Reading Comprehension",
  topic: "Main Idea"
};

export type DemoQuestion = typeof demoQuestion;
