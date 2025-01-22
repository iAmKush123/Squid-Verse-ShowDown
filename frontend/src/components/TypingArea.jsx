import React from 'react';

const TypingArea = ({
    typingText,
    inpFieldValue,
    timeLeft,
    mistakes,
    WPM,
    CPM,
    initTyping,
    handleKeyDown,
    resetGame,
    isRedLight,
    points
}) => {
    return (
        <div className="typing-game">
            <div className="typing-area">
                <div className="half-screen typing-section">
                    <p id="paragraph">{typingText}</p>
                    <textarea
                        className="input-field"
                        value={inpFieldValue}
                        onChange={initTyping}
                        onKeyDown={handleKeyDown}
                        placeholder="Start typing here..."
                        disabled={isRedLight} // Disable typing during Red Light
                    />
                </div>
                <div className="half-screen status-section">
                    <div className={`red-green-light ${isRedLight ? 'red' : 'green'}`}>
                        <p>{isRedLight ? 'Red Light - Stop Typing!' : 'Green Light - Go!'}</p>
                    </div>
                    <ul className="result-details">
                        <li className="time">
                            <p>Time Left:</p>
                            <span><b>{timeLeft}</b>s</span>
                        </li>
                        <li className="mistake">
                            <p>Mistakes:</p>
                            <span>{mistakes}</span>
                        </li>
                        <li className="points">
                            <p>Points:</p>
                            <span>{points}</span>
                        </li>
                        <li className="wpm">
                            <p>WPM:</p>
                            <span>{WPM}</span>
                        </li>
                        <li className="cpm">
                            <p>CPM:</p>
                            <span>{CPM}</span>
                        </li>
                    </ul>
                    <button onClick={resetGame} className="btn">Start Over</button>
                </div>
            </div>
        </div>
    )
};