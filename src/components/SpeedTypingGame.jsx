import React, { useState, useEffect, useRef } from 'react';
import './SpeedTypingGame.css';

const SpeedTypingGame = () => {
  const paragraphs = [
    "Solve this: Write a function to reverse a string.",
    "Solve this: Find the factorial of a number using recursion."
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

    // If it's the correct character
    if (typedChar === currentChar) {
      setCharIndex(charIndex + 1);
      setScore((prev) => prev + 1); // Increase score for correct typing
    } 
    // If it's the wrong character and typed something
    else if (typedChar) {
      setMistakes(mistakes + 1);
      setScore((prev) => prev - 1); // Deduct points for incorrect typing
    }

    // Handle red light (you can customize when red light should occur)
    if (light === 'red') {
      setScore((prev) => prev - 1); // Deduct points for red light
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);

        // Change to red light when time runs out
        if (timeLeft <= 0) {
          setLight('red');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  return (
    <div className="game-container">
      <div className="text-container">
              {typingText.split('').map((char, index) => (
                <span
                  key={index}
                  className={
                    index < charIndex
                      ? 'correct-char'
                      : index === charIndex
                      ? 'active-char'
                      : ''
                  }
                >
                  {char}
                </span>
              ))}
            </div>
      <div className="typing-area">
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

            

            <textarea
              ref={inputRef}
              className="input-field"
              value={inpFieldValue}
              onChange={handleTyping}
              rows="3"
              placeholder="Type your answer here..."
            />
          </>
        )}
      </div>

      <div className={`light-area ${light}`}>
        {light.toUpperCase()} LIGHT
      </div>
    </div>
  );
};

export default SpeedTypingGame;
