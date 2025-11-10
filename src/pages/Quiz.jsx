import React, { useState, useEffect } from 'react';

// --- Quiz Data ---
const questions = [
  {
    question: "What does 'encryption' mean in cybersecurity?",
    answers: [
      { text: "Converting data into a secret code", correct: true },
      { text: "Deleting all data", correct: false },
      { text: "Backing up data", correct: false },
      { text: "Sharing files publicly", correct: false },
    ],
  },
  {
    question: "Which of the following is a strong password?",
    answers: [
      { text: "password123", correct: false },
      { text: "qwerty", correct: false },
      { text: "H@ckMe2025!", correct: true },
      { text: "myname123", correct: false },
    ],
  },
  {
    question: "What does 'HTTPS' mean in a website URL?",
    answers: [
      { text: "HyperText Transfer Protocol Secure", correct: true },
      { text: "High Transfer Text Protocol", correct: false },
      { text: "HyperText Transmission Path", correct: false },
      { text: "Home Transfer Protocol Service", correct: false },
    ],
  },
  {
    question: "What is phishing?",
    answers: [
      { text: "Catching real fish", correct: false },
      { text: "Sending fake emails to steal information", correct: true },
      { text: "Encrypting your messages", correct: false },
      { text: "Updating your antivirus", correct: false },
    ],
  },
  {
    question: "Which of the following helps protect your computer?",
    answers: [
      { text: "Firewall", correct: true },
      { text: "Malware", correct: false },
      { text: "Spyware", correct: false },
      { text: "Phishing link", correct: false },
    ],
  },
];

// --- Main App Component ---
export default function App() {
  // --- State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showScore, setShowScore] = useState(false);

  // --- Event Handlers ---

  /**
   * Handles selecting an answer
   */
  const handleAnswerSelect = (answer) => {
    if (isAnswerChecked) return; // Prevent changing answer

    setSelectedAnswer(answer);
    setIsAnswerChecked(true);

    if (answer.correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  /**
   * Moves to the next question or shows the score
   */
  const handleNextButton = () => {
    // Reset answer state
    setSelectedAnswer(null);
    setIsAnswerChecked(false);

    // Move to next question or show score
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  /**
   * Resets the quiz to play again
   */
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowScore(false);
  };

  // --- Helper Functions & Variables ---

  /**
   * Gets the appropriate button style based on answer state
   */
  const getButtonClass = (answer) => {
    const baseClass = "p-4 rounded-lg border-2 text-left w-full transition-all duration-200 font-medium text-gray-800";

    if (!isAnswerChecked) {
      return `${baseClass} border-gray-300 hover:bg-pink-100 cursor-pointer`;
    }

    // Answer is checked
    const isCorrect = answer.correct;
    const isSelected = selectedAnswer === answer;

    if (isCorrect) {
      return `${baseClass} bg-green-100 border-green-500 text-green-800 font-semibold`;
    }

    if (isSelected && !isCorrect) {
      return `${baseClass} bg-red-100 border-red-500 text-red-800 font-semibold`;
    }

    // Default for unchecked, incorrect answers after selection
    return `${baseClass} border-gray-300 opacity-60 cursor-not-allowed`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = showScore ? 100 : (currentQuestionIndex / questions.length) * 100;
  const answerIcons = ["🌱", "📘", "🧠", "👑"];

  // --- Render ---
  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900">
      
      {/* --- Main Quiz Container --- */}
      <main className="flex justify-center items-center py-10 md:py-20 px-4">
        <div className="app w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
          
          {showScore ? (
            // --- Score View ---
            <div className="text-center fade-in">
              <h1 className="text-3xl font-bold mb-4">🎉 You scored {score} out of {questions.length}!</h1>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-6">
                <div 
                  className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `100%` }}
                ></div>
              </div>
              
              <button 
                onClick={handlePlayAgain}
                className="w-full bg-pink-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-pink-700 transition-all text-lg shadow-lg"
              >
                Play Again
              </button>
            </div>

          ) : (
            // --- Quiz View ---
            <div className="fade-in">
              <h1 className="text-2xl md:text-3xl font-bold">
                Test Your Encryption <span className="text-pink-500">Knowledge</span>
              </h1>
              <p className="text-gray-600 mt-2 mb-4">Level up your encryption knowledge!</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 my-6">
                <div 
                  className="bg-pink-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Question */}
              <div className="quiz">
                <h2 id="question" className="text-xl md:text-2xl font-semibold my-6 min-h-[4rem]">
                  {currentQuestionIndex + 1}. {currentQuestion.question}
                </h2>
                
                {/* Answers */}
                <div id="answer-buttons" className="grid grid-cols-1 gap-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <button
                      key={index}
                      className={getButtonClass(answer)}
                      onClick={() => handleAnswerSelect(answer)}
                      disabled={isAnswerChecked}
                    >
                      <span className="mr-2">{answerIcons[index % answerIcons.length]}</span>
                      {answer.text}
                    </button>
                  ))}
                </div>
                
                {/* Next Button */}
                {isAnswerChecked && (
                  <button 
                    id="next-btn"
                    onClick={handleNextButton}
                    className="w-full bg-pink-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-pink-700 transition-all mt-8 text-lg shadow-lg animate-pulse"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}