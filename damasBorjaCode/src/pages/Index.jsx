
import { useState } from 'react';
import CheckersBoard from '../components/CheckersBoard';
import GameInfo from '../components/GameInfo';

const Index = () => {
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameStatus, setGameStatus] = useState('ongoing');

  const handleTurnChange = () => {
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-foreground" style={{ backgroundColor: '#101010' }}>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-4 mb-2">
          <img 
            src="/lovable-uploads/ecf8ab30-79b2-4fde-bfac-6976cecdda7c.png" 
            alt="Meme Chess Logo" 
            className="w-12 h-12"
          />
          <h1 className="text-5xl font-bold text-white">Damas BorjaCode</h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-8">
        <CheckersBoard currentPlayer={currentPlayer} onTurnChange={handleTurnChange} setGameStatus={setGameStatus} />
        <div className="w-[512px]">
          <GameInfo currentPlayer={currentPlayer} gameStatus={gameStatus} />
        </div>
      </div>
    </div>
  );
};

export default Index;
