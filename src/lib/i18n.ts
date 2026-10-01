// UI strings and educational content, separated from calculation logic
// for future multilingual support. Add a new language by adding a new key here.

export type Language = 'en';

export const translations = {
  en: {
    // Header
    siteName: 'Triangle Calculator',
    primaryNavigation: 'Primary navigation',
    navCalculator: 'Calculator',
    navLearn: 'Learn',
    navPractice: 'Practice',
    navKids: 'Kids',
    comingSoon: 'Coming soon',
    openNavigationMenu: 'Open navigation menu',
    closeNavigationMenu: 'Close navigation menu',
    educationalSectionNavigation: 'On this page',
    navHowItWorks: 'How It Works',
    navFormulas: 'Triangle Formulas',
    navFaq: 'FAQ',

    // Hero
    heroTitle: 'Triangle Calculator – Calculate Missing Sides & Angles',
    heroIntro:
      'Enter the side lengths and angles you already know. Our triangle calculator automatically calculates the missing values and shows you the resulting triangle.',

    // Calculator
    calculatorTitle: 'Triangle Calculator',
    unitLabel: 'Unit',
    sidesTitle: 'Side Lengths',
    anglesTitle: 'Angles',
    sideA: 'Side a',
    sideB: 'Side b',
    sideC: 'Side c',
    angleAlpha: 'Angle α',
    angleBeta: 'Angle β',
    angleGamma: 'Angle γ',
    calculate: 'Calculate',
    reset: 'Reset',
    enterValue: 'Enter value',

    // Status
    statusSolved: 'Triangle solved',
    statusSolvedMsg: 'All missing values have been calculated.',
    statusMultiple: 'Multiple solutions possible',
    statusMultipleMsg: 'These values can describe two different triangles.',
    statusInsufficient: 'More information needed',
    statusInvalid: 'No valid triangle',
    statusContradictory: 'Your values do not agree.',
    whyLabel: 'Why?',
    longestSideExplanation: 'The longest side is',
    otherSidesExplanation: 'The other two sides are',
    sideSumExplanation: 'The other sides add up to',
    lessThanExplanation: 'is less than',
    equalToExplanation: 'is equal to',
    cannotFormTriangleExplanation: 'These side lengths cannot form a triangle.',
    basedOnSidesExplanation: 'Based on the side lengths, angle',
    shouldBeExplanation: 'should be',
    enteredAngleExplanation: 'You entered',
    differentTrianglesExplanation: 'These values describe different triangles.',

    // Results
    resultTitle: 'Triangle Result',
    calculationExplanationTitle: 'How was this calculated?',
    sidesResult: 'Sides',
    anglesResult: 'Angles',
    methodUsed: 'Method used',
    triangleType: 'Triangle type',
    solution1: 'Solution 1',
    solution2: 'Solution 2',
    ambiguousNote:
      'Two solutions are possible because the given side and angle (SSA case) allow the unknown side to be placed in two different positions.',

    // Footer
    footerNote:
      'This calculator provides mathematical calculations for educational purposes. Results should be independently verified when used for engineering, construction, or safety-critical applications.',
    footerRights: 'Triangle Calculator',

    // Sections
    howItWorksTitle: 'How Does a Triangle Calculator Work?',
    howItWorksText:
      'A triangle calculator uses the values you already know to determine the missing sides and angles of a triangle. Enter any known side lengths or angles, and the calculator checks whether the triangle can be solved and automatically chooses the appropriate mathematical method. Depending on the information provided, the calculation may use the angle sum of a triangle, the Pythagorean theorem, the sine rule, or the cosine rule.',

    calcAnglesTitle: 'How to Calculate Missing Angles in a Triangle',
    calcAnglesText1:
      'The three interior angles of every triangle always add up to 180°. If you know two of the three angles, you can find the third by subtracting the known angles from 180°.',
    calcAnglesFormula: 'α + β + γ = 180°',
    calcAnglesExampleTitle: 'Example',
    calcAnglesExample:
      'If α = 40° and β = 60°, then γ = 180° − 40° − 60° = 80°. The third angle is 80°.',

    calcSidesTitle: 'How to Calculate a Missing Side of a Triangle',
    calcSidesText1:
      'The formula you need depends on which values are already known. If you know two sides of a right triangle, use the Pythagorean theorem. If you know two angles and one side, use the sine rule. If you know two sides and the included angle, use the cosine rule.',
    calcSidesExampleTitle: 'Examples',
    calcSidesExample1: 'Right triangle with legs a = 3 cm and b = 4 cm → c = √(3² + 4²) = 5 cm',
    calcSidesExample2: 'Two sides a = 10, b = 15 with included angle γ = 60° → c = √(10² + 15² − 2·10·15·cos60°) ≈ 13.23',

    pythagorasTitle: 'Pythagorean Theorem',
    pythagorasText:
      'The Pythagorean theorem applies only to right triangles. It relates the lengths of the two legs to the hypotenuse (the side opposite the right angle).',
    pythagorasFormula: 'a² + b² = c²',
    pythagorasExample:
      'If the two legs are 3 cm and 4 cm, the hypotenuse is c = √(3² + 4²) = √25 = 5 cm. This is the classic 3-4-5 right triangle.',

    sineRuleTitle: 'Sine Rule',
    sineRuleText:
      'The sine rule (also called the law of sines) relates each side of a triangle to the sine of its opposite angle. It is especially useful when you know two angles and one side, or two sides and a non-included angle.',
    sineRuleFormula: 'a / sin(α) = b / sin(β) = c / sin(γ)',
    sineRuleNote:
      'Each side is paired with the angle directly opposite it. If you know any side-angle pair, you can find any other side or angle.',

    cosineRuleTitle: 'Cosine Rule',
    cosineRuleText:
      'The cosine rule (also called the law of cosines) is a generalization of the Pythagorean theorem. It works for any triangle and is particularly useful when you know two sides and the included angle, or all three sides.',
    cosineRuleFormula: 'c² = a² + b² − 2ab cos(γ)',
    cosineRuleNote:
      'The angle γ is the angle between sides a and b. The same pattern applies to the other two sides and their included angle.',

    solveYourselfTitle: 'How to Solve a Triangle Yourself',
    solveYourselfSteps: [
      'Write down all known sides and angles.',
      'Determine what information is missing.',
      'Check whether the triangle can be uniquely determined.',
      'Choose the appropriate formula (angle sum, sine rule, cosine rule, or Pythagorean theorem).',
      'Calculate the missing value.',
      'Continue until all possible values are known.',
      'Check that the three angles add up to 180°.',
      'Check that the side lengths satisfy the triangle inequality.',
    ],

    typesTitle: 'Types of Triangles',
    typesIntro: 'Triangles can be classified by their sides and by their angles:',
    equilateralTitle: 'Equilateral Triangle',
    equilateralText: 'All three sides are equal, and all three angles are 60°.',
    isoscelesTitle: 'Isosceles Triangle',
    isoscelesText: 'Two sides are equal, and the two angles opposite those sides are also equal.',
    scaleneTitle: 'Scalene Triangle',
    scaleneText: 'All three sides have different lengths, and all three angles are different.',
    rightTitle: 'Right Triangle',
    rightText: 'One angle is exactly 90°. The side opposite the right angle is called the hypotenuse.',
    acuteTitle: 'Acute Triangle',
    acuteText: 'All three angles are less than 90°.',
    obtuseTitle: 'Obtuse Triangle',
    obtuseText: 'One angle is greater than 90°.',

    faqTitle: 'Frequently Asked Questions',
  },
} as const;

export type TranslationKey = typeof translations.en;

export function getTranslation(lang: Language = 'en'): TranslationKey {
  return translations[lang] ?? translations.en;
}

// FAQ data — used for both the visible FAQ section and structured data
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqData: FaqItem[] = [
  {
    question: 'What is a triangle calculator?',
    answer:
      'A triangle calculator is an online tool that finds the missing sides and angles of a triangle. You enter the values you already know, and the calculator determines whether the triangle can be solved and automatically applies the correct formula.',
  },
  {
    question: 'How do I calculate a missing side of a triangle?',
    answer:
      'It depends on what you know. If you have two sides of a right triangle, use the Pythagorean theorem (a² + b² = c²). If you know two angles and one side, use the sine rule. If you know two sides and the included angle, use the cosine rule.',
  },
  {
    question: 'How do I calculate a missing angle?',
    answer:
      'The three angles of a triangle always add up to 180°. If you know two angles, subtract their sum from 180° to find the third. If you know all three sides, use the cosine rule to find any angle.',
  },
  {
    question: 'Can I calculate a triangle from three sides?',
    answer:
      'Yes. If you know all three side lengths (SSS), the calculator uses the cosine rule to determine all three angles. The sides must satisfy the triangle inequality: the sum of any two sides must be greater than the third.',
  },
  {
    question: 'Can I calculate a triangle from two sides and an angle?',
    answer:
      'Yes. If the angle is between the two known sides (SAS), the solution is unique and the cosine rule is used. If the angle is not between the two known sides (SSA), there may be one solution, two solutions, or no solution at all.',
  },
  {
    question: 'Can a triangle have two possible solutions?',
    answer:
      'Yes. In the ambiguous SSA case (two sides and a non-included angle), the given values can sometimes describe two different valid triangles. The calculator will display both solutions when they exist.',
  },
  {
    question: 'What is the difference between the sine rule and cosine rule?',
    answer:
      'The sine rule (a/sin α = b/sin β = c/sin γ) is best when you know two angles and a side, or two sides and a non-included angle. The cosine rule (c² = a² + b² − 2ab cos γ) is best when you know two sides and the included angle, or all three sides.',
  },
  {
    question: 'Can I calculate a right triangle?',
    answer:
      'Yes. A right triangle has one 90° angle. If you know the two legs, the Pythagorean theorem gives the hypotenuse. If you know one leg and the hypotenuse, you can find the other leg. The calculator handles all of these cases automatically.',
  },
  {
    question: 'Can I use inches instead of centimeters?',
    answer:
      'Yes. Use the unit selector to switch between centimeters (cm) and inches (inch). All side inputs and results will update to the selected unit. The conversion uses 1 inch = 2.54 cm. Angles are always measured in degrees.',
  },
  {
    question: 'What information do I need to solve a triangle?',
    answer:
      'You need at least three pieces of information, including at least one side length. Valid combinations are: three sides (SSS), two sides and the included angle (SAS), two angles and one side (ASA or AAS), or two sides and a non-included angle (SSA).',
  },
];
