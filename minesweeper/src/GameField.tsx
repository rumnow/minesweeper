import React from 'react';

interface GameFieldProps {
  size: number;
  mines: number;
  guid: string;
}

const GameField: React.FC<GameFieldProps> = ({ size, mines, guid }) => {
  // Рассчитываем размеры поля
  const width = Math.sqrt(size);

  // Создание массива клеток
  const cells = Array.from({ length: size }, (_, index) => {
    return (
    <div
        key={index}
        className="cell"
        onClick={() => handleCellClick(index, guid)}
        onContextMenu={(event) => handleCellRightClick(event, index)}
      >
        {/* Содержимое ячейки, если есть */}
      </div>)
  });

  return (
    <div className="game-field">
      <div style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }} className="grid">
        {cells}
      </div>
    </div>
  );
};

const handleCellClick = async (cellIndex: number, guid: string) => {
    // Логика обработки клика на ячейку
    console.log(`Левый клик на ячейку ${cellIndex}`);
    try {
        const response = await fetch(`http://localhost:8080/turn?guid=${guid}&field=${cellIndex}`);
        if (!response.ok) {
            throw new Error('Ошибка при запросе к серверу');
        }
        const data = await response.json();

        // Обработка полученных данных
        //setGameData({ size: data.size, mines: data.mines, guid: data.guid });
    } catch (error) {
        console.error('Ошибка при создании игры:', error);
    }
};

const handleCellRightClick = (event: React.MouseEvent, cellIndex: number) => {
    // Предотвращаем появление контекстного меню браузера
    event.preventDefault();

    // Логика обработки правого клика на ячейку
    console.log(`Правый клик на ячейку ${cellIndex}`);
};

export default GameField;
