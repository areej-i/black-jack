import { useState, useEffect } from 'react';
import './Blackjack.css';

function Blackjack() {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [ties, setTies] = useState(0);

  useEffect(() => {
    startGame();
  }, []);

  const getCardImage = (card) => {
    return card ? `/cards/${card.value}_of_${card.suit}.png` : '';
  };

  const startGame = () => {
    const newDeck = createDeck();
    setDeck(newDeck);
    const [playerCard1, updatedDeck1] = dealCard(newDeck);
    const [dealerCard1, updatedDeck2] = dealCard(updatedDeck1);
    const [playerCard2, updatedDeck3] = dealCard(updatedDeck2);
    const [dealerCard2, updatedDeck4] = dealCard(updatedDeck3);
    setPlayerHand([playerCard1, playerCard2]);
    setDealerHand([dealerCard1, dealerCard2]);
    setDeck(updatedDeck4);
    setPlayerScore(calculateScore([playerCard1, playerCard2]));
    setDealerScore(calculateScore([dealerCard1, dealerCard2]));
    setGameOver(false);
    setMessage('');
  };

  const createDeck = () => {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const newDeck = [];
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value });
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  const dealCard = (deck) => {
    if (deck.length > 0) {
      const card = deck[0];
      const updatedDeck = deck.slice(1);
      return [card, updatedDeck];
    } else {
      return [null, deck];
    }
  };

  const calculateScore = (hand) => {
    let score = 0;
    let aceCount = 0;
    for (let card of hand) {
      if (card.value === 'A') {
        aceCount += 1;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    }
    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount -= 1;
    }
    return score;
  };

  const hit = () => {
    if (gameOver) return;
    const [newCard, updatedDeck] = dealCard(deck);
    setPlayerHand([...playerHand, newCard]);
    setDeck(updatedDeck);
    const newScore = calculateScore([...playerHand, newCard]);
    setPlayerScore(newScore);
    if (newScore > 21) {
      setGameOver(true);
      setMessage('Bust! You lose.');
      setLosses(losses + 1);
    }
  };

  const stand = () => {
    if (gameOver) return;
    let dealerHandCopy = [...dealerHand];
    let updatedDeck = [...deck];
    let dealerScore = calculateScore(dealerHandCopy);
    while (dealerScore < 17) {
      const [newCard, newDeck] = dealCard(updatedDeck);
      dealerHandCopy.push(newCard);
      updatedDeck = newDeck;
      dealerScore = calculateScore(dealerHandCopy);
    }
    setDealerHand(dealerHandCopy);
    setDeck(updatedDeck);
    setDealerScore(dealerScore);
    if (dealerScore > 21) {
      setMessage('Dealer busts! You win.');
      setWins(wins + 1);
    } else if (dealerScore > playerScore) {
      setMessage('Dealer wins.');
      setLosses(losses + 1);
    } else if (dealerScore < playerScore) {
      setMessage('You win!');
      setWins(wins + 1);
    } else {
      setMessage('Push!');
      setTies(ties + 1);
    }
    setGameOver(true);
  };

  return (
    <div className="blackjack-container">
      <div className="stats">
        <h3>Wins: {wins}</h3>
        <h3>Losses: {losses}</h3>
        <h3>Ties: {ties}</h3>
      </div>
      <div className="blackjack">
        <h1>Blackjack</h1>
        <div className="dealer">
          <h2>Dealer ({dealerScore})</h2>
          <div className="hand">
            {dealerHand.map((card, index) => (
              <img key={index} 
                className="card"
                src={gameOver || index !== 0 ? getCardImage(card) : '/cards/back.png'}
                alt={gameOver || index !== 0 ? `${card.value} of ${card.suit}` : 'Hidden card'}
              />
            ))}
          </div>
        </div>
        <div className="player">
          <h2>Player ({playerScore})</h2>
          <div className="hand">
            {playerHand.map((card, index) => (
              <img key={index} 
                className="card"
                src={getCardImage(card)}
                alt={`${card.value} of ${card.suit}`}
              />
            ))}
          </div>
        </div>
        {!gameOver && (
          <div className="buttons">
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
          </div>
        )}
        {gameOver && (
          <div className="message">
            {message}
            <br></br>
            <button onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Blackjack;

