
import React from 'react';

// Define the board dimensions - same as in useTetris.ts
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30; // Size of each cell in pixels

interface TetrisBoardProps {
  board: any[][];
  tetromino: {
    shape: number[][];
    pos: { x: number; y: number };
    className: string;
  };
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, tetromino }) => {
  // Draw the active tetromino on top of the board
  const renderActiveTetromino = () => {
    if (!tetromino) return null;
    
    return tetromino.shape.map((row, y) => 
      row.map((cell, x) => {
        if (cell !== 0) {
          const cellX = (tetromino.pos.x + x) * CELL_SIZE;
          const cellY = (tetromino.pos.y + y) * CELL_SIZE;
          
          // Only render if the cell is within the visible board
          if (tetromino.pos.y + y >= 0) {
            return (
              <div
                key={`active-${x}-${y}`}
                className={`absolute ${tetromino.className} animate-pulse-glow`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  transform: `translate(${cellX}px, ${cellY}px)`,
                  zIndex: 2
                }}
              />
            );
          }
          return null;
        }
        return null;
      })
    );
  };

  return (
    <div className="relative border-2 border-primary/50 neon-border rounded-md overflow-hidden shadow-lg"
         style={{ width: BOARD_WIDTH * CELL_SIZE, height: BOARD_HEIGHT * CELL_SIZE }}>
      {/* Board background with grid */}
      <div className="absolute inset-0 cyber-grid bg-black/60 backdrop-blur-sm"></div>
      
      {/* Static blocks */}
      {board.map((row, y) => 
        row.map((cell, x) => {
          if (cell !== 0) {
            return (
              <div
                key={`${x}-${y}`}
                className={`absolute ${cell.className}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  transform: `translate(${x * CELL_SIZE}px, ${y * CELL_SIZE}px)`,
                  zIndex: 1
                }}
              />
            );
          }
          return null;
        })
      )}
      
      {/* Active tetromino */}
      {renderActiveTetromino()}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(TetrisBoard);
