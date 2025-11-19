// Shared packs accessible to all users
// These packs can be accessed without authentication or tier restrictions

export const sharedPacks = {
  'sample-pack-2026': {
    packId: 'sample-pack-2026',
    name: 'Sample Pack 2026',
    description: 'Try out a real CSAT question from 2026',
    size: 1,
    level: 3,
    questions: [
      {
        "questionNumber": 34,
        "year": "2026",
        "questionText": "Kant was a strong defender of the rule of law as the ultimate guarantee, not only of security and peace, but also of freedom. He believed that human societies were moving towards more rational forms regulated by effective and binding legal frameworks because only such frameworks enabled people to live in harmony, to prosper and to co-operate. However, his belief in inevitable progress was not based on an optimistic or high-minded view of human nature. On the contrary, it comes close to Hobbes's outlook: man's violent and conflict-prone nature makes it necessary to establish and maintain an effective legal framework in order to secure peace. We cannot count on people's benevolence or goodwill, but even 'a nation of devils' can live in harmony in a legal system that binds every citizen equally. Ideally, the law is the embodiment of those political principles that all rational beings would freely choose. If such laws forbid them to do something that they would not rationally choose to do anyway, then the law cannot be _______.",
        "actualQuestion": "다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오.",
        "answerOptions": [
          "① regarded as reasonably confining human liberty",
          "② viewed as a strong defender of the justice system",
          "③ understood as a restraint on their freedom",
          "④ enforced effectively to suppress their evil nature",
          "⑤ accepted within the assumption of ideal legal frameworks"
        ],
        "correctAnswer": "③ understood as a restraint on their freedom",
        "imageFile": "default_image.jpg",
        "videoSolutionLink": "",
        "source": "past-paper",
        "primarySubjectArea": "social science",
        "passageType": "argumentative",
        "questionSkill": "빈칸 추론",
        "objectID": "2026_pp_36",
        "questionId": "2026_pp_36",
        "passage": "Kant was a strong defender of the rule of law as the ultimate guarantee, not only of security and peace, but also of freedom. He believed that human societies were moving towards more rational forms regulated by effective and binding legal frameworks because only such frameworks enabled people to live in harmony, to prosper and to co-operate. However, his belief in inevitable progress was not based on an optimistic or high-minded view of human nature. On the contrary, it comes close to Hobbes's outlook: man's violent and conflict-prone nature makes it necessary to establish and maintain an effective legal framework in order to secure peace. We cannot count on people's benevolence or goodwill, but even 'a nation of devils' can live in harmony in a legal system that binds every citizen equally. Ideally, the law is the embodiment of those political principles that all rational beings would freely choose. If such laws forbid them to do something that they would not rationally choose to do anyway, then the law cannot be _______.",
        "difficulty": "medium",
        "subject": "English",
        "topic": "빈칸 추론",
        "requiresPLEW": true,
        "correctAnswerNumber": 3
      }
    ],
    createdAt: new Date().toISOString()
  }
};

export type SharedPack = typeof sharedPacks[keyof typeof sharedPacks];

export function getSharedPack(packId: string): SharedPack | null {
  return sharedPacks[packId as keyof typeof sharedPacks] || null;
}

export function isSharedPack(packId: string): boolean {
  return packId in sharedPacks;
}
