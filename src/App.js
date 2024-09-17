import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const phrases = [
    "La vie est belle.",
    "Le ciel est bleu.",
    "Les oiseaux chantent.",
    "Il fait beau aujourd'hui.",
    "Le soleil brille.",
    "La mer est calme.",
    "Les montagnes sont majestueuses.",
    "La nature est magnifique.",
    "Les fleurs sont en pleine floraison.",
    "Le vent souffle doucement."
  ];

  const [currentPhrase, setCurrentPhrase] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [showRetry, setShowRetry] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [missedLetters, setMissedLetters] = useState({}); 
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Chois une phrase aléatoire dans la liste
    //TODO : choisir la phrase aleatoirement dans un JSON
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    // Commence le chrono si c'est la première fois
    if (!startTime) {
      setStartTime(Date.now()); 
    }

    // On sépare par des espaces
    const words = input.trim().split(/\s+/).length;
    const letters = input.length;
    setWordCount(words);
    setLetterCount(letters);

    const newMissedLetters = { ...missedLetters };
    let errorDetected = false;
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== currentPhrase[i]) {
        newMissedLetters[currentPhrase[i]] = (newMissedLetters[currentPhrase[i]] || 0) + 1;
        errorDetected = true;
        break; // on sort de la boucle dès qu'on détecte une erreur
      }
    }
    setMissedLetters(newMissedLetters);
    setHasError(errorDetected);

    // Si tout est correct, on affiche le succès
    if (input === currentPhrase) {
      setMessage('Succès! Vous avez correctement réécrit la phrase.');
      setShowRetry(true); 
    } else {
      setMessage(''); 
      setShowRetry(false);
    }
  };

  const handleRetry = () => {
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    setUserInput(''); // remettre à zéro l'input
    setMessage(''); 
    setShowRetry(false);
    setStartTime(null); 
    setWordCount(0); 
    setLetterCount(0);
    setMissedLetters({});
    setHasError(false); 
  };

  // Empêcher l'utilisateur de se déplacer avec les flèches et autres 
  const handleKeyDown = (e) => {
    const forbiddenKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']; 
    if (hasError && e.key !== 'Backspace') {
      e.preventDefault(); 
    } else if (forbiddenKeys.includes(e.key)) {
      e.preventDefault(); 
    }
  };

  // Affichage des lettres en couleur
  const getColoredPhrase = () => {
    return currentPhrase.split('').map((char, index) => {
      let color;
      if (index < userInput.length) {
        color = char === userInput[index] ? 'green' : 'red';
      } else {
        color = 'black'; // default
      }
      return <span key={index} style={{ color }}>{char}</span>;
    });
  };

  // Calcul temps écoulé
  const getTimeElapsed = () => {
    if (!startTime) return 0;
    return (Date.now() - startTime) / 1000; // en secondes
  };

  // Calcul des mots par seconde
  const getWordsPerSecond = () => {
    const timeElapsed = getTimeElapsed();
    return timeElapsed > 0 ? (wordCount / timeElapsed).toFixed(2) : 0;
  };

  // Pareil pour les lettres par seconde
  const getLettersPerSecond = () => {
    const timeElapsed = getTimeElapsed();
    return timeElapsed > 0 ? (letterCount / timeElapsed).toFixed(2) : 0; 
  };

  // Affiche les lettres ratées
  const renderMissedLetters = () => {
    return Object.entries(missedLetters).map(([letter, count]) => (
      <p key={letter}>{`Lettre "${letter}" ratée ${count} fois`}</p> 
    ));
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/Primios/typing-app', '_blank');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          onClick={handleGitHubClick} 
          style={{ position: 'absolute', top: '10px', left: '10px', background: 'none', border: 'none' }}
        >
          <img src="../type-app/public/25231.png" alt="GitHub" style={{ width: '30px', height: '30px' }} />
        </button>
        <p>{getColoredPhrase()}</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            value={userInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Réécrivez la phrase ici" 
          />
        </form>
        <p>{message}</p>
        {showRetry && (
          <>
            <button onClick={handleRetry}>Retry</button> 
            <p>Mots par seconde: {getWordsPerSecond()}</p>
            <p>Lettres par seconde: {getLettersPerSecond()}</p>
            <p>Temps pris: {getTimeElapsed()} secondes</p>
            <div>{renderMissedLetters()}</div> 
          </>
        )}
      </header>
    </div>
  );
}

export default App;
