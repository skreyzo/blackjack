import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MainPage(): React.JSX.Element {
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

  const drawCard = async () => {
    if (!deckId) return;

    try {
      const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`, {
        params: { count: 1 },
      });
      const newCard = drawResponse.data.cards[0];
      setCards((prevCards) => [...prevCards, newCard]);

      const cardValue = calculateCardValue(newCard);
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

  const drawOpponentCard = async () => {
    if (!deckId) return;

    try {
      const drawResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`, {
        params: { count: 1 },
      });
      const newCard = drawResponse.data.cards[0];
      setOpponentCards((prevCards) => [...prevCards, newCard]);

      const cardValue = calculateCardValue(newCard);
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

  const calculateCardValue = (card: any) => {
    if (card.value === 'ACE') return 11;
    if (['KING', 'QUEEN', 'JACK'].includes(card.value)) return 10;
    return parseInt(card.value, 10);
  };

  return (
    <div>
      <h1>Blackjack Game</h1>
      <div>
        <h2>You</h2>
        {gameStatus && <p>{gameStatus}</p>}
        <p>Score: {score}</p>
        <button onClick={drawCard} disabled={gameStatus !== null || currentPlayer !== 'player'}>
          Draw Card
        </button>
        <div>
          {cards.map((card, index) => (
            <img key={index} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
      <div>
        <h2>Opponent</h2>
        {opponentGameStatus && <p>{opponentGameStatus}</p>}
        <p>Score: {opponentScore}</p>
        <button onClick={drawOpponentCard} disabled={opponentGameStatus !== null || currentPlayer !== 'opponent'}>
          Ход второго игрока
        </button>
        <div>
          {opponentCards.map((card, index) => (
            <img key={index} src={card.image} alt={card.code} />
          ))}
        </div>
      </div>
      <button onClick={switchTurn} disabled={gameStatus !== null || opponentGameStatus !== null}>
        Переход хода
      </button>
    </div>
  );
}