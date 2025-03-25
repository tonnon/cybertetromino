
import React from 'react';

interface NextTetrominoProps {
  tetromino: {
    shape: number[][];
    className: string;
  };
}

const CELL_SIZE = 20; // Smaller cell size for the preview

const NextTetromino: React.FC<NextTetrominoProps> = ({ tetromino }) => {
  if (!tetromino) return null;
  
  // Calculate dimensions based on tetromino shape
  const width = tetromino.shape[0].length * CELL_SIZE;
  const height = tetromino.shape.length * CELL_SIZE;
  
  // Center the tetromino in the preview box
  const offsetX = (4 * CELL_SIZE - width) / 2;
  const offsetY = (4 * CELL_SIZE - height) / 2;
  
  return (
    <div className="relative border border-primary/30 rounded-md overflow-hidden bg-secondary/30 backdrop-blur-sm"
         style={{ width: 4 * CELL_SIZE, height: 4 * CELL_SIZE }}>
      {tetromino.shape.map((row, y) => 
        row.map((cell, x) => {
          if (cell !== 0) {
            return (
              <div
                key={`next-${x}-${y}`}
                className={`absolute ${tetromino.className} animate-pulse-glow`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  transform: `translate(${x * CELL_SIZE + offsetX}px, ${y * CELL_SIZE + offsetY}px)`,
                  zIndex: 1
                }}
              />
            );
          }
          return null;
        })
      )}
    </div>
  );
};

export default React.memo(NextTetromino);
