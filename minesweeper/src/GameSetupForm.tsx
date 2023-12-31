import React, { useState } from 'react';

interface GameSetupFormProps {
  onCreateGame: (size: number, difficulty: string) => void;
}

const GameSetupForm: React.FC<GameSetupFormProps> = ({ onCreateGame }) => {
  const [size, setSize] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('0');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreateGame(size, difficulty);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Размер поля:
        <input
          type="range"
          min="8"
          max="15"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
        />
        {size}
      </label>
      <br />
      <label>
        Уровень сложности:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="0">Easy</option>
          <option value="2">Medium</option>
          <option value="5">Hard</option>
          <option value="9">God</option>
        </select>
      </label>
      <br />
      <button type="submit">Создать игру</button>
    </form>
  );
};

export default GameSetupForm;
