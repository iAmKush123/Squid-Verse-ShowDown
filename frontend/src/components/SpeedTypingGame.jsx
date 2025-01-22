import React, { useState, useEffect, useRef } from 'react';
import './SpeedTypingGame.css';

const SpeedTypingGame = () => {
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog."
  ];

  const [typingText, setTypingText] = useState('');
  const [inpFieldValue, setInpFieldValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 1-minute timer
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [light, setLight] = useState('green'); // Red or Green light
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const inputRef = useRef(null); // Reference for the input field

  // Load a random paragraph
  const loadParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    setTypingText(paragraphs[randomIndex]);
    setInpFieldValue('');
    setCharIndex(0);
    setMistakes(0);
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(60);
    setScore(0);
    loadParagraph();

    // Focus textarea and set cursor at the beginning
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle typing
  const handleTyping = (event) => {
    const value = event.target.value;
    setInpFieldValue(value);

    const currentChar = typingText[charIndex];
    const typedChar = value[value.length - 1]; // Get the last typed character

    if (typedChar === currentChar) {
      setCharIndex(charIndex + 1);
      setScore((prev) => prev + 1); // Increase score for correct typing
    } else if (typedChar) {
      setMistakes(mistakes + 1);
      setScore((prev) => prev - 1); // Deduct points for incorrect typing
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  return (
    <div className="game-container">
      {!gameStarted && (
        <button onClick={startGame} className="start-button">
          Start Game
        </button>
      )}

      {gameStarted && (
              <>
            <div>
                <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
                <div className="score">Score: {score}</div>
            </div>      
          
          <div className="typing-area">
            {/* Display the paragraph with dynamic styling */}
            <div className="text-container">
              {typingText.split('').map((char, index) => (
                <span
                  key={index}
                  className={
                    index < charIndex
                      ? 'correct-char' // Correctly typed character
                      : index === charIndex
                      ? 'active-char' // Current character being typed
                      : '' // Remaining characters
                  }
                >
                  {char}
                </span>
              ))}
            </div>

            {/* Multi-line textarea input */}
            <textarea
              ref={inputRef}
              className="input-field"
              value={inpFieldValue}
              onChange={handleTyping}
              rows="3"
              placeholder="Type here..."
            />
          </div>

          <div className={`light-area ${light}`}>
            {light.toUpperCase()} LIGHT
          </div>
        </>
      )}
    </div>
  );
};

export default SpeedTypingGame;
