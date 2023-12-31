import React, { useState } from 'react';
import GameSetupForm from './GameSetupForm';
import GameField from './GameField';
import Timer from './Timer';
import MinesCounter from './MinesCounter';

function App() {
  const [gameData, setGameData] = useState<{ size: number, mines: number, guid: string } | null>(null);
  const [minesLeft, setMinesLeft] = useState<number>(0);
  const createGame = async (size: number, difficulty: string) => {
    // Здесь вы можете отправить запрос на сервер
    console.log(`Игра создана с размером ${size} и сложностью ${difficulty}`);
    try {
      const response = await fetch(`http://localhost:8080/newgame?difficulty=${difficulty}&size=${size}`);
      if (!response.ok) {
        throw new Error('Ошибка при запросе к серверу');
      }
      const data = await response.json();
      // Обработка полученных данных
      setGameData({ size: data.size, mines: data.mines, guid: data.guid });
    } catch (error) {
      console.error('Ошибка при создании игры:', error);
    }
  };

  return (
    <div className="App">
      {gameData ? (
        <>
          <div className="header">
            <MinesCounter minesLeft={minesLeft} />
            <Timer />
          </div>
          <GameField size={gameData.size} mines={gameData.mines} guid={gameData.guid} />
        </>
      ) : (
        <GameSetupForm onCreateGame={createGame} />
      )}
    </div>
  );
}
export default App;

