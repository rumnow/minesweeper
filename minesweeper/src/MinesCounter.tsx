import React from 'react';

interface MinesCounterProps {
  minesLeft: number;
}

const MinesCounter: React.FC<MinesCounterProps> = ({ minesLeft }) => {
  return <div>Мины: {minesLeft}</div>;
};

export default MinesCounter;
