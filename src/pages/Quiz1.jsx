import React, { useState, useEffect, useRef, useCallback } from 'react';

// ==========================================
// GAME DATA AND CONFIGURATION
// ==========================================
const PIGPEN_MAP = {
  'A': '⌈', 'B': '⊓', 'C': '⌉',
  'D': '⊏', 'E': '□', 'F': '⊐',
  'G': '⌊', 'H': '⊔', 'I': '⌋',
  'J': '⌈•', 'K': '⊓•', 'L': '⌉•',
  'M': '⊏•', 'N': '□•', 'O': '⊐•',
  'P': '⌊•', 'Q': '⊔•', 'R': '⌋•',
  'S': '◁', 'T': '▷', 'U': '△', 'V': '▽',
  'W': '◁•', 'X': '▷•', 'Y': '△•', 'Z': '▽•'
};
const DIFFICULTY_CONFIG = {
  easy: { letters: 3, timeLimit: 45, basePoints: 50 },
  medium: { letters: 5, timeLimit: 35, basePoints: 100 },
  hard: { letters: 8, timeLimit: 25, basePoints: 200 }
};
const WORD_LISTS = {
  easy: ['CAT', 'DOG', 'BAT', 'HAT', 'SUN', 'MAP', 'PEN', 'BOX', 'KEY', 'BUS', 'CUP', 'BAG'],
  medium: ['APPLE', 'BRAIN', 'CLOUD', 'DREAM', 'FLAME', 'GRAPE', 'HORSE', 'LEMON', 'OCEAN', 'PIANO'],
  hard: ['ELEPHANT', 'MOUNTAIN', 'TREASURE', 'BUTTERFLY', 'UNIVERSE', 'KEYBOARD', 'PINEAPPLE']
};
const MAX_ROUNDS = 10;

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function textToPigpen(text) {
  return text.toUpperCase().split('').map(char => PIGPEN_MAP[char] || char).join(' ');
}
function getRandomWord(difficulty) {
  const words = WORD_LISTS[difficulty];
  return words[Math.floor(Math.random() * words.length)];
}

// ==========================================
// MAIN REACT COMPONENT
// ==========================================
export default function PigpenCipherGame() {
  // ==========================================
  // REACT STATE
  // ==========================================
  const [screen, setScreen] = useState('difficulty');
  const [lastScreen, setLastScreen] = useState('difficulty');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [cipherSymbols, setCipherSymbols] = useState('Click Start!');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_CONFIG.easy.timeLimit);
  const timerRef = useRef(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'correct' });

  // ==========================================
  // DERIVED STATE
  // ==========================================
  const accuracy = currentRound === 0 ? 0 : Math.round((correctCount / currentRound) * 100);

  // ==========================================
  // GAME FLOW FUNCTIONS
  // ==========================================
  const loadNextQuestion = useCallback(() => {
    if (currentRound >= MAX_ROUNDS) {
      endGame();
      return;
    }
    setCurrentRound(prev => prev + 1);
    const newWord = getRandomWord(difficulty);
    setCurrentAnswer(newWord);
    setCipherSymbols(textToPigpen(newWord));
    setUserInput('');
    setInputDisabled(false);
    setTimeLeft(DIFFICULTY_CONFIG[difficulty].timeLimit);
  }, [currentRound, difficulty]);

  const handleWrongAnswer = useCallback((message) => {
    setScore(prev => Math.max(0, prev - 25));
    setStreak(0);
    setWrongCount(prev => prev + 1);
    setFeedback({ show: true, message, type: 'wrong' });
    setInputDisabled(true);
    setUserInput('');
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'wrong' });
      loadNextQuestion();
    }, 3000);
  }, [loadNextQuestion]); // Add loadNextQuestion as dependency

  const startGame = (diff) => {
    setDifficulty(diff);
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setScreen('game');
    setTimeout(() => loadNextQuestion(), 100);
  };

  const handleCorrectAnswer = () => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const basePoints = config.basePoints;
    const timeBonus = timeLeft * 2;
    const streakBonus = streak * 10;
    const totalPoints = basePoints + timeBonus + streakBonus;
    setScore(prev => prev + totalPoints);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setCorrectCount(prev => prev + 1);
    if (newStreak > bestStreak) setBestStreak(newStreak);
    setFeedback({ show: true, message: `✓ Correct! +${totalPoints} points`, type: 'correct' });
    setInputDisabled(true);
    setUserInput('');
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'correct' });
      loadNextQuestion();
    }, 2000);
  };

  const submitAnswer = () => {
    setTimeLeft(0); // Stop timer
    const userAnswer = userInput.trim().toUpperCase();
    if (userAnswer === currentAnswer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer(`Wrong! The correct answer was: ${currentAnswer}`);
    }
  };

  const skipQuestion = () => {
    setTimeLeft(0); // Stop timer
    setScore(prev => Math.max(0, prev - 10));
    setStreak(0);
    setWrongCount(prev => prev + 1);
    setFeedback({ show: true, message: `Skipped! The answer was: ${currentAnswer} (-10 pts)`, type: 'wrong' });
    setInputDisabled(true);
    setUserInput('');
    setTimeout(() => {
      setFeedback({ show: false, message: '', type: 'wrong' });
      loadNextQuestion();
    }, 2500);
  };

  const endGame = () => {
    setTimeLeft(0);
    setScreen('gameover');
  };

  const restartGame = () => setScreen('difficulty');

  const toggleKey = () => {
    if (screen === 'key') {
      setScreen(lastScreen);
    } else {
      setLastScreen(screen);
      setScreen('key');
    }
  };

  // ==========================================
  // TIMER LOGIC
  // ==========================================
  const timeIsUp = useCallback(() => {
    handleWrongAnswer(`Time's up! The answer was: ${currentAnswer}`);
  }, [currentAnswer, handleWrongAnswer]);

  useEffect(() => {
    if (timeLeft > 0 && screen === 'game' && !inputDisabled) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && screen === 'game' && !inputDisabled) {
      timeIsUp();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, screen, inputDisabled, timeIsUp]);

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  const handleInputKeydown = (e) => {
    if (e.key === 'Enter' && !inputDisabled) submitAnswer();
  }

  // ==========================================
  // RENDER LOGIC
  // ==========================================
  const renderKeyCell = (letter, pos, hasDot = false) => {
    const borderClasses = {
      1: 'border-r-0 border-b-0', 2: 'border-b-0', 3: 'border-l-0 border-b-0',
      4: 'border-r-0', 5: 'border-none', 6: 'border-l-0',
      7: 'border-r-0 border-t-0', 8: 'border-t-0', 9: 'border-l-0 border-t-0',
    };
    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 border-4 border-gray-800 flex items-center justify-center text-xl sm:text-2xl font-bold bg-white text-gray-800 relative ${borderClasses[pos]}`}>
        {letter}
        {hasDot && <span className="absolute text-5xl text-purple-600" style={{ transform: 'translate(0, -3px)' }}>•</span>}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 min-h-screen p-5 font-sans text-white">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🔐 PinPoint Cipher Game</h1>
          <p>Decode the symbols and learn the ancient Pigpen cipher!</p>
        </div>

        {/* ================================ */}
        {/* SCREEN 1: CHOOSE DIFFICULTY      */}
        {/* ================================ */}
        {screen === 'difficulty' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-5 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-8 text-white">Choose Your Difficulty Level</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-5 px-8 rounded-lg text-lg font-bold cursor-pointer transition-all duration-300 shadow-md hover:bg-white/40 hover:scale-105 hover:shadow-lg" 
                onClick={() => startGame('easy')}
              >
                <div>EASY</div>
                <small>3 letters • 45 seconds</small>
              </button>
              <button 
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-5 px-8 rounded-lg text-lg font-bold cursor-pointer transition-all duration-300 shadow-md hover:bg-white/40 hover:scale-105 hover:shadow-lg" 
                onClick={() => startGame('medium')}
              >
                <div>MEDIUM</div>
                <small>5 letters • 35 seconds</small>
              </button>
              <button 
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white py-5 px-8 rounded-lg text-lg font-bold cursor-pointer transition-all duration-300 shadow-md hover:bg-white/40 hover:scale-105 hover:shadow-lg" 
                onClick={() => startGame('hard')}
              >
                <div>HARD</div>
                <small>8 letters • 25 seconds</small>
              </button>
            </div>
          </div>
        )}

        {/* ================================ */}
        {/* SCREEN 2: GAME PLAY              */}
        {/* ================================ */}
        {screen === 'game' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-5 shadow-2xl">
            
            {/* Game Info */}
            <div className="flex justify-around flex-wrap gap-3 mb-5">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[100px] flex-1 shadow-md">
                <div className="text-sm text-purple-100 font-bold uppercase tracking-wider">ROUND</div>
                <div className="text-3xl font-bold text-white">{currentRound}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[100px] flex-1 shadow-md">
                <div className="text-sm text-purple-100 font-bold uppercase tracking-wider">SCORE</div>
                <div className="text-3xl font-bold text-white">{score}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[100px] flex-1 shadow-md">
                <div className="text-sm text-purple-100 font-bold uppercase tracking-wider">STREAK</div>
                <div className="text-3xl font-bold text-white">{streak}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[100px] flex-1 shadow-md">
                <div className="text-sm text-purple-100 font-bold uppercase tracking-wider">LEVEL</div>
                <div className="text-3xl font-bold text-white">{difficulty.toUpperCase()}</div>
              </div>
            </div>

            {/* Timer */}
            <div className={`bg-red-500 text-white p-5 rounded-lg text-center text-4xl font-bold mb-5 transition-opacity shadow-lg ${timeLeft <= 10 && timeLeft > 0 ? 'animate-pulse' : ''}`}>
              {timeLeft}s
            </div>

            {/* Cipher Display */}
            <div className="bg-white/90 p-10 rounded-lg text-center mb-5 min-h-[100px] flex items-center justify-center shadow-inner">
              <div className="text-4xl font-bold tracking-widest text-gray-800" style={{ fontFamily: 'monospace' }}>
                {cipherSymbols}
              </div>
            </div>

            {/* Feedback Message */}
            {feedback.show && (
              <div className={`p-5 rounded-lg text-center font-bold text-lg mb-5 shadow-md
                ${feedback.type === 'correct' ? 'bg-green-100 text-green-800 border-2 border-green-200' : 'bg-red-100 text-red-800 border-2 border-red-200'}
              `}>
                {feedback.message}
              </div>
            )}

            {/* Input Area */}
            <div className="mb-5">
              <input 
                type="text" 
                className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg mb-4 box-border focus:outline-none focus:border-purple-600 disabled:bg-gray-100 text-gray-900"
                placeholder="Type your answer here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleInputKeydown}
                disabled={inputDisabled}
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 py-3 px-5 rounded-xl text-base font-bold cursor-pointer min-w-[120px] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 hover:scale-105 active:scale-95 disabled:hover:scale-100" 
                  onClick={submitAnswer} 
                  disabled={inputDisabled}
                >
                  Submit Answer
                </button>
                <button 
                  className="flex-1 py-3 px-5 rounded-xl text-base font-bold cursor-pointer min-w-[120px] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white/30 backdrop-blur-sm text-white border border-white/50 hover:bg-white/50 active:scale-95 disabled:hover:scale-100" 
                  onClick={skipQuestion} 
                  disabled={inputDisabled}
                >
                  Skip (-10 pts)
                </button>
                <button 
                  className="flex-1 py-3 px-5 rounded-xl text-base font-bold cursor-pointer min-w-[120px] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white/30 backdrop-blur-sm text-white border border-white/50 hover:bg-white/50 active:scale-95 disabled:hover:scale-100" 
                  onClick={toggleKey}
                >
                  Show Key
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                <div className="text-sm text-purple-100 opacity-90">Total Rounds</div>
                <div className="text-3xl font-bold text-white mt-1">{currentRound}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                <div className="text-sm text-purple-100 opacity-90">Correct</div>
                <div className="text-3xl font-bold text-white mt-1">{correctCount}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                <div className="text-sm text-purple-100 opacity-90">Wrong</div>
                <div className="text-3xl font-bold text-white mt-1">{wrongCount}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                <div className="text-sm text-purple-100 opacity-90">Accuracy</div>
                <div className="text-3xl font-bold text-white mt-1">{accuracy}%</div>
              </div>
            </div>
          </div>
        )}

        {/* ================================ */}
        {/* SCREEN 3: PIGPEN KEY             */}
        {/* ================================ */}
        {screen === 'key' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-5 shadow-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-5">Pigpen Cipher Key</h3>
            
            <div className="bg-gray-100 p-4 sm:p-8 rounded-lg inline-block text-gray-800">
              <h4 className="text-lg font-semibold">Grid 1: Letters A-I (no dots)</h4>
              <div className="inline-grid grid-cols-3 gap-0 mb-8 mt-4">
                {renderKeyCell('A', 1)}
                {renderKeyCell('B', 2)}
                {renderKeyCell('C', 3)}
                {renderKeyCell('D', 4)}
                {renderKeyCell('E', 5)}
                {renderKeyCell('F', 6)}
                {renderKeyCell('G', 7)}
                {renderKeyCell('H', 8)}
                {renderKeyCell('I', 9)}
              </div>

              <h4 className="text-lg font-semibold">Grid 2: Letters J-R (with dots)</h4>
              <div className="inline-grid grid-cols-3 gap-0 mb-8 mt-4">
                {renderKeyCell('J', 1, true)}
                {renderKeyCell('K', 2, true)}
                {renderKeyCell('L', 3, true)}
                {renderKeyCell('M', 4, true)}
                {renderKeyCell('N', 5, true)}
                {renderKeyCell('O', 6, true)}
                {renderKeyCell('P', 7, true)}
                {renderKeyCell('Q', 8, true)}
                {renderKeyCell('R', 9, true)}
              </div>

              <div>
                <h4 className="text-lg font-semibold">Letters S-Z: X shapes</h4>
                <p className="text-gray-600">S, T, U, V = X shapes without dots</p>
                <p className="text-gray-600">W, X, Y, Z = X shapes with dots</p>
                <div className='flex gap-4 justify-center text-3xl font-mono mt-4'>
                  <span>S:◁</span>
                  <span>T:▷</span>
                  <span>U:△</span>
                  <span>V:▽</span>
                </div>
              </div>
            </div>

            <button 
              className="flex-1 py-3 px-5 rounded-xl text-base font-bold cursor-pointer min-w-[120px] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white/30 backdrop-blur-sm text-white border border-white/50 hover:bg-white/50 active:scale-95 disabled:hover:scale-100 mt-5" 
              onClick={toggleKey}
            >
              Hide Key
            </button>
          </div>
        )}

        {/* ================================ */}
        {/* SCREEN 4: GAME OVER              */}
        {/* ================================ */}
        {screen === 'gameover' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-5 shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-6">🎉 Game Complete!</h2>
            
            <div className="bg-black/10 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Your Final Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                  <div className="text-sm text-purple-100 opacity-90">Final Score</div>
                  <div className="text-3xl font-bold text-white mt-1">{score}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                  <div className="text-sm text-purple-100 opacity-90">Best Streak</div>
                  <div className="text-3xl font-bold text-white mt-1">{bestStreak}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                  <div className="text-sm text-purple-100 opacity-90">Correct</div>
                  <div className="text-3xl font-bold text-white mt-1">{correctCount}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-5 rounded-lg text-center shadow-md">
                  <div className="text-sm text-purple-100 opacity-90">Accuracy</div>
                  <div className="text-3xl font-bold text-white mt-1">{accuracy}%</div>
                </div>
              </div>
            </div>

            <button 
              className="py-4 px-10 rounded-xl text-lg font-bold cursor-pointer min-w-[120px] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 hover:scale-105 active:scale-95 disabled:hover:scale-100" 
              onClick={restartGame}
            >
              Play Again
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}