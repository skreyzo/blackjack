import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/cardPage.css';

export default function Card(): React.JSX.Element {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<string | null>(null);

  const [opponentCards, setOpponentCards] = useState<any[]>([]);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [opponentGameStatus, setOpponentGameStatus] = useState<string | null>(null);

  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>('player');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [textColor, setTextColor] = useState<string>('black');

  useEffect(() => {
    async function initializeDeck() {
      try {
        const shuffleResponse = await axios.get(
          'https://deckofcardsapi.com/api/deck/new/shuffle/',
          {
            params: { deck_count: 1 },
          },
        );
        setDeckId(shuffleResponse.data.deck_id);
      } catch (error) {
        console.error('Error initializing deck:', error);
      }
    }

    initializeDeck();
  }, []);

  useEffect(() => {
    if (deckId) {
      const drawInitialCards = async () => {
        await drawCardForPlayer();
        setTimeout(async () => {
          await drawCardForPlayer();
          setTimeout(async () => {
            await drawCardForOpponent();
            setTimeout(async () => {
              await drawCardForOpponent();
            }, 500);
          }, 500);
        }, 500);
      };

      drawInitialCards();
    }
  }, [deckId]);

  const drawCardForPlayer = async () => {
    if (!deckId) return;

    try {
      const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`, {
        params: { count: 1 },
      });
      const newCard = drawResponse.data.cards[0];
      setCards((prevCards) => [...prevCards, newCard]);

      const cardValue = calculateCardValue(newCard, score);
      setScore((prevScore) => prevScore + cardValue);

      if (score + cardValue === 21) {
        setGameStatus('You win!');
        setGameOver(true);
      } else if (score + cardValue > 21) {
        setGameStatus('You lose!');
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const drawCardForOpponent = async () => {
    if (!deckId) return;

    try {
      const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`, {
        params: { count: 1 },
      });
      const newCard = drawResponse.data.cards[0];
      setOpponentCards((prevCards) => [...prevCards, { ...newCard, hidden: prevCards.length < 2 }]);

      const cardValue = calculateCardValue(newCard, opponentScore);
      setOpponentScore((prevScore) => prevScore + cardValue);

      if (opponentScore + cardValue === 21) {
        setOpponentGameStatus('Dealer wins!');
        setGameStatus('Dealer wins!');
        setGameOver(true);
      } else if (opponentScore + cardValue > 21) {
        setOpponentGameStatus('Dealer loses!');
        setGameStatus('You win!'); // Обновляем gameStatus при переборе дилера
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error drawing Dealer card:', error);
    }
  };

  const switchTurn = () => {
    setCurrentPlayer('opponent');
    revealOpponentCards();
  };

  const revealOpponentCards = async () => {
    if (opponentCards.length > 0) {
      setTimeout(() => {
        setOpponentCards((prevCards) => {
          const updatedCards = [...prevCards];
          updatedCards[0].hidden = false;
          return updatedCards;
        });
      }, 1000);

      setTimeout(() => {
        setOpponentCards((prevCards) => {
          const updatedCards = [...prevCards];
          updatedCards[1].hidden = false;
          return updatedCards;
        });
      }, 2000);
    }
  };

  const calculateCardValue = (card: any, currentScore: number) => {
    if (card.value === 'ACE') {
      return currentScore >= 11 ? 1 : 11;
    }
    if (['KING', 'QUEEN', 'JACK'].includes(card.value)) return 10;
    return parseInt(card.value, 10);
  };

  const restartGame = async () => {
    try {
      const shuffleResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/', {
        params: { deck_count: 1 },
      });
      setDeckId(shuffleResponse.data.deck_id);
      setCards([]);
      setScore(0);
      setGameStatus(null);
      setOpponentCards([]);
      setOpponentScore(0);
      setOpponentGameStatus(null);
      setCurrentPlayer('player');
      setGameOver(false);
      setTextColor('black');
    } catch (error) {
      console.error('Error initializing deck:', error);
    }
  };

  const checkGameResult = () => {
    if (opponentScore > score && opponentScore <= 21) {
      setGameStatus('Dealer wins!');
    } else if (opponentScore < score) {
      setGameStatus('You win!');
    } else if (opponentScore === score) {
      setGameStatus('Draw!');
      setTextColor('red');
      setTimeout(() => setTextColor('black'), 2000);
    }
    setGameOver(true);
  };

  return (
    <div className="card-page">
      {gameOver && (
        <div className="game-result">
          <h1 style={{ color: 'white', fontSize: '48px' }}>{gameStatus}</h1>
        </div>
      )}
      <div className="button-container left">
        {gameOver ? (
          <button onClick={restartGame}>Сыграть еще раз</button>
        ) : (
          <>
            <button
              onClick={currentPlayer === 'player' ? drawCardForPlayer : drawCardForOpponent}
              disabled={gameStatus !== null || gameOver}
            >
              Взять еще
            </button>
            <button
              onClick={currentPlayer === 'opponent' ? checkGameResult : switchTurn}
              disabled={gameStatus !== null || opponentGameStatus !== null}
            >
              Хватит
            </button>
          </>
        )}
      </div>
      <div className="status-container right" style={{ color: textColor }}>
        {gameOver ? (
          <p>{gameStatus}</p>
        ) : (
          <p>{currentPlayer === 'player' ? 'Ваш ход' : 'Ход дилера'}</p>
        )}
      </div>
      <div>
        <h2>You</h2>
        <p>Score: {score}</p>
        <div>
          {cards.map((card, index) => (
            <img key={index} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
      <div>
        <h2>Dealer</h2>
        <p>Score: {opponentCards.some(card => card.hidden) ? '??' : opponentScore}</p>
        <div>
          {opponentCards.map((card, index) => (
            <img
              key={index}
              src={card.hidden ? 'https://deckofcardsapi.com/static/img/back.png' : card.image}
              alt={card.code}
            />
          ))}
        </div>
      </div>
    </div>
  );
}