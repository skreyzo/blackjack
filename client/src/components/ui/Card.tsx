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
      } else if (score + cardValue > 21) {
        setGameStatus('You lose!');
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
      setOpponentCards((prevCards) => [...prevCards, newCard]);

      const cardValue = calculateCardValue(newCard, opponentScore);
      setOpponentScore((prevScore) => prevScore + cardValue);

      if (opponentScore + cardValue === 21) {
        setOpponentGameStatus('Opponent wins!');
      } else if (opponentScore + cardValue > 21) {
        setOpponentGameStatus('Opponent loses!');
      }
    } catch (error) {
      console.error('Error drawing opponent card:', error);
    }
  };

  const switchTurn = () => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === 'player' ? 'opponent' : 'player'));
  };

  const calculateCardValue = (card: any, currentScore: number) => {
    if (card.value === 'ACE') {
      return currentScore >= 11 ? 1 : 11;
    }
    if (['KING', 'QUEEN', 'JACK'].includes(card.value)) return 10;
    return parseInt(card.value, 10);
  };

  return (
    <div className="card-page">
      <div className="button-container">
        <button
          onClick={drawCardForPlayer}
          disabled={gameStatus !== null || currentPlayer !== 'player'}
        >
          Взять еще
        </button>
        <button
          onClick={drawCardForOpponent}
          disabled={opponentGameStatus !== null || currentPlayer !== 'opponent'}
        >
          Ход второго игрока
        </button>
        <button onClick={switchTurn} disabled={gameStatus !== null || opponentGameStatus !== null}>
          Переход хода
        </button>
      </div>
      <div>
        <h2>You</h2>
        {gameStatus && <p>{gameStatus}</p>}
        <p>Score: {score}</p>
        <div>
          {cards.map((card, index) => (
            <img key={index} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
      <div>
        <h2>Dealer</h2>
        {opponentGameStatus && <p>{opponentGameStatus}</p>}
        <p>Score: {opponentScore}</p>
        <div>
          {opponentCards.map((card, index) => (
            <img key={index} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
    </div>
  );
}