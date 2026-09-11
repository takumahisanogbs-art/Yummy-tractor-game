const quizData = window.YUMMY_QUESTIONS;

if (
  !quizData ||
  !quizData.spring ||
  !quizData.summer ||
  !quizData.autumn ||
  !quizData.winter
) {
  throw new Error(
    "Seasonal question files were not loaded correctly."
  );
}
