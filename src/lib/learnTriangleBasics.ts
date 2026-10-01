export const triangleBasicsContent = {
  title: 'Triangle Basics: Sides, Angles & Types of Triangles',
  intro: 'Triangles are among the simplest shapes in mathematics, and they appear in the world around us. Learn how their sides and angles fit together, why those relationships are useful, and how to recognize common triangle types.',
  sections: {
    what: {
      title: 'What Is a Triangle?',
      description: 'A triangle is a closed, flat shape made from three straight sides. The sides meet at three corner points called vertices, and each corner forms an interior angle.',
      terms: [
        { term: 'Side', definition: 'one of the three straight edges' },
        { term: 'Vertex', definition: 'a corner where two sides meet' },
        { term: 'Angle', definition: 'the opening between two sides at a vertex' },
      ],
      angleFact: 'The three interior angles of every triangle add up to 180°.',
    },
    used: {
      title: 'Where Are Triangles Used?',
      intro: 'Triangles help describe how distances and angles relate. That is useful when a length is difficult to measure directly or when a structure needs stable shapes.',
      examples: [
        { title: 'Roofs and buildings', text: 'Roof frames use triangular arrangements to support loads and define slopes.' },
        { title: 'Bridges', text: 'Triangular trusses spread forces through connected members.' },
        { title: 'Construction and surveying', text: 'Measured angles and reachable distances can help estimate the position of a point across a site.' },
        { title: 'Navigation and engineering', text: 'Direction and distance measurements can be combined to describe positions and dimensions.' },
        { title: 'Computer graphics', text: 'Digital scenes are often represented with many small triangles that fit together to model surfaces.' },
      ],
      takeaway: 'Triangles give us a practical way to reason about distances and directions, even when we cannot measure every length directly.',
    },
    why: {
      title: 'Why Do We Calculate Triangles?',
      intro: 'Often, only part of a triangle is known. If the known sides and angles are enough, their mathematical relationships can reveal a missing side or angle.',
      steps: ['Known information', 'Mathematical relationship', 'Missing information'],
      examples: ['finding an unknown distance', 'determining a slope or angle', 'checking dimensions in a geometric construction'],
      bridge: 'Later, the Pythagorean theorem, sine rule and cosine rule provide different ways to connect known and unknown values. Here, the key idea is simply that the information you start with determines what you can find.',
    },
    sidesAngles: {
      title: 'Sides and Angles',
      description: 'A common way to label a triangle uses lowercase letters for sides and matching Greek letters for the opposite angles.',
      pairs: [
        { side: 'a', angle: 'α', explanation: 'side a is opposite angle α' },
        { side: 'b', angle: 'β', explanation: 'side b is opposite angle β' },
        { side: 'c', angle: 'γ', explanation: 'side c is opposite angle γ' },
      ],
      formula: 'α + β + γ = 180°',
      note: 'Opposite means the side does not touch that angle; it lies across from it. Matching each side with its opposite angle is important in later triangle calculations.',
    },
    types: {
      title: 'Types of Triangles',
      intro: 'Triangles can be classified by their sides or by their angles. These are two separate ways to describe the same triangle, so a triangle can belong to one group from each list.',
      sideHeading: 'Classified by sides',
      angleHeading: 'Classified by angles',
      sideTypes: [
        { name: 'Equilateral', property: 'Three equal sides', description: 'All three angles are also equal, so each is 60°.', sides: [5, 5, 5] },
        { name: 'Isosceles', property: 'At least two equal sides', description: 'The angles opposite the equal sides are equal.', sides: [5, 5, 6] },
        { name: 'Scalene', property: 'Three different side lengths', description: 'No two sides are equal.', sides: [4, 5, 6] },
      ],
      angleTypes: [
        { name: 'Right', property: 'One 90° angle', description: 'The side opposite the right angle is the longest side.', sides: [3, 4, 5] },
        { name: 'Acute', property: 'Three angles less than 90°', description: 'Every interior angle is acute.', sides: [5, 6, 7] },
        { name: 'Obtuse', property: 'One angle greater than 90°', description: 'A triangle can have only one obtuse angle.', sides: [3, 4, 6] },
      ],
      overlap: 'For example, a 45°–45°–90° triangle is both isosceles and right. Side-based and angle-based names can be used together.',
    },
    described: {
      title: 'How Are Triangles Described?',
      intro: 'Triangle problems are often described by the pieces of information you know: three sides, two sides and an angle, or one side and two angles. The position of an angle can matter as well as its size.',
      outcomes: [
        { title: 'Not enough information', text: 'Many different triangles could still fit the values.' },
        { title: 'One solution', text: 'The known values fix one triangle.' },
        { title: 'Two solutions', text: 'In some side-side-angle (SSA) cases, the same measurements can fit two different shapes.' },
        { title: 'No possible triangle', text: 'Some measurements conflict with the basic rules of triangles.' },
      ],
      close: 'That is why a triangle problem is not only about entering numbers: it is also about checking what those numbers allow.',
    },
    try: {
      title: 'Try It Yourself',
      intro: 'Change the side length to resize the triangle. Change angle α to reshape it while the opposite side a stays fixed. Angle β is held at 50°, and γ adjusts so the angle sum remains 180°.',
      sideLabel: 'Side a length',
      alphaLabel: 'Angle α',
      betaLabel: 'Angle β (held constant)',
      gammaLabel: 'Angle γ (adjusts automatically)',
      sumLabel: 'Angle sum',
      resetLabel: 'Reset triangle',
    },
    calculator: {
      title: 'Ready to Calculate a Triangle?',
      text: 'Use the Triangle Calculator to enter the sides and angles you know. It can solve for missing values and show the resulting triangle.',
      link: 'Open the Triangle Calculator',
    },
  },
} as const;
