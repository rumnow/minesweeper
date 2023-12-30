import React from 'react';
import GameSetupForm from './GameSetupForm';

function App() {
  const createGame = (size: number, difficulty: string) => {
    // Здесь вы можете отправить запрос на сервер
    console.log(`Игра создана с размером ${size} и сложностью ${difficulty}`);
  };

  return (
    <div className="App">
      <GameSetupForm onCreateGame={createGame} />
    </div>
  );
}

export default App;
