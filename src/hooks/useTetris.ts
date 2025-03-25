import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the tetromino shapes
const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    className: 'block-i'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    className: 'block-j'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    className: 'block-l'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    className: 'block-o'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    className: 'block-s'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    className: 'block-t'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    className: 'block-z'
  }
};

// Constants for the game
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const POINTS_PER_LINE = 100;
// Changed from LEVEL_UP_LINES to POINTS_PER_LEVEL
const POINTS_PER_LEVEL = 500;

const createEmptyBoard = () => Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

// Generate a random tetromino
const randomTetromino = () => {
  const keys = Object.keys(TETROMINOES);
  const tetrominoType = keys[Math.floor(Math.random() * keys.length)];
  return {
    ...TETROMINOES[tetrominoType as keyof typeof TETROMINOES],
    pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    type: tetrominoType
  };
};

// Check for collision with walls, floor or other blocks
const checkCollision = (board: number[][], tetromino: any, pos: { x: number, y: number }) => {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      // Check if we're on a tetromino cell (1)
      if (tetromino.shape[y][x] !== 0) {
        // Calculate the position on the board
        const boardX = x + pos.x;
        const boardY = y + pos.y;

        // Check if tetromino is outside the game bounds or collides with a filled cell
        if (
          boardX < 0 || boardX >= BOARD_WIDTH || // Left and right walls
          boardY >= BOARD_HEIGHT || // Floor
          (boardY >= 0 && board[boardY][boardX] !== 0) // Other blocks
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

// Rotate a tetromino matrix
const rotate = (matrix: number[][]) => {
  const N = matrix.length;
  const rotated = matrix.map((row, i) => 
    matrix.map((val, j) => matrix[N - j - 1][i])
  );
  return rotated;
};

// Merge the tetromino with the board
const mergeTetrominoWithBoard = (board: any[][], tetromino: any, pos: { x: number, y: number }) => {
  const newBoard = board.map(row => [...row]);
  
  tetromino.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const boardY = y + pos.y;
        const boardX = x + pos.x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = { value: 1, className: tetromino.className };
        }
      }
    });
  });
  
  return newBoard;
};

// Check and clear completed rows
const clearRows = (board: any[][]) => {
  let linesCleared = 0;
  
  const newBoard = board.reduce((acc, row) => {
    // If every cell in the row is filled (not 0)
    if (row.every(cell => cell !== 0)) {
      linesCleared += 1;
      // Add an empty row at the beginning
      acc.unshift(Array(BOARD_WIDTH).fill(0));
    } else {
      // Keep the row
      acc.push(row);
    }
    return acc;
  }, [] as any[][]);
  
  return { board: newBoard, linesCleared };
};

export const useTetris = () => {
  // Game state
  const [board, setBoard] = useState(createEmptyBoard());
  const [tetromino, setTetromino] = useState(randomTetromino());
  const [nextTetromino, setNextTetromino] = useState(randomTetromino());
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [dropTime, setDropTime] = useState(1000);
  const [gameActive, setGameActive] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particleCoords, setParticleCoords] = useState({ x: 0, y: 0 });
  
  const dropTimeRef = useRef<number | null>(null);
  const audioRef = useRef<{ backgroundMusic?: HTMLAudioElement, clearLine?: HTMLAudioElement, gameOver?: HTMLAudioElement, rotate?: HTMLAudioElement, drop?: HTMLAudioElement }>(
    typeof window !== 'undefined' ? { 
      backgroundMusic: new Audio(''), // This will be replaced with actual audio in a real implementation
      clearLine: new Audio(''),
      gameOver: new Audio(''),
      rotate: new Audio(''),
      drop: new Audio('')
    } : {}
  );

  // Reset the game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setTetromino(randomTetromino());
    setNextTetromino(randomTetromino());
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    setDropTime(1000);
    setShowParticles(false);
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    resetGame();
    setGameActive(true);
    if (typeof window !== 'undefined' && audioRef.current.backgroundMusic) {
      audioRef.current.backgroundMusic.volume = 0.3;
      audioRef.current.backgroundMusic.loop = true;
      audioRef.current.backgroundMusic.play().catch(e => console.log("Audio playback prevented by browser", e));
    }
  }, [resetGame]);

  // Move tetromino horizontally
  const moveTetromino = useCallback((dir: -1 | 1) => {
    if (!gameActive || gameOver || isPaused) return;
    
    const newPos = { ...tetromino.pos, x: tetromino.pos.x + dir };
    if (!checkCollision(board, tetromino, newPos)) {
      setTetromino({ ...tetromino, pos: newPos });
    }
  }, [board, tetromino, gameActive, gameOver, isPaused]);
  
  // Rotate tetromino
  const rotateTetromino = useCallback(() => {
    if (!gameActive || gameOver || isPaused) return;
    
    const rotatedTetromino = {
      ...tetromino,
      shape: rotate(tetromino.shape)
    };
    
    // Check if rotation is valid
    if (!checkCollision(board, rotatedTetromino, tetromino.pos)) {
      setTetromino(rotatedTetromino);
      if (audioRef.current.rotate) {
        audioRef.current.rotate.currentTime = 0;
        audioRef.current.rotate.play().catch(e => console.log("Audio playback prevented by browser", e));
      }
    } else {
      // Try wall kicks
      const wallKicks = [-1, 1, -2, 2];
      for (let kick of wallKicks) {
        const kickedPos = { ...tetromino.pos, x: tetromino.pos.x + kick };
        if (!checkCollision(board, rotatedTetromino, kickedPos)) {
          setTetromino({ ...rotatedTetromino, pos: kickedPos });
          if (audioRef.current.rotate) {
            audioRef.current.rotate.currentTime = 0;
            audioRef.current.rotate.play().catch(e => console.log("Audio playback prevented by browser", e));
          }
          break;
        }
      }
    }
  }, [board, tetromino, gameActive, gameOver, isPaused]);

  // Drop tetromino faster (soft drop)
  const dropTetromino = useCallback(() => {
    if (!gameActive || gameOver || isPaused) return;
    
    const newPos = { ...tetromino.pos, y: tetromino.pos.y + 1 };
    if (!checkCollision(board, tetromino, newPos)) {
      setTetromino({ ...tetromino, pos: newPos });
    } else {
      // If can't move down further, place the tetromino
      const mergedBoard = mergeTetrominoWithBoard(board, tetromino, tetromino.pos);
      const { board: clearedBoard, linesCleared } = clearRows(mergedBoard);
      
      if (linesCleared > 0) {
        // Trigger particles for line clear
        setShowParticles(true);
        setParticleCoords({ 
          x: BOARD_WIDTH * 30 / 2, // Roughly center of the board
          y: (tetromino.pos.y + tetromino.shape.length / 2) * 30 // Roughly y position of the cleared line
        });
        
        // Play line clear sound
        if (audioRef.current.clearLine) {
          audioRef.current.clearLine.currentTime = 0;
          audioRef.current.clearLine.play().catch(e => console.log("Audio playback prevented by browser", e));
        }
        
        setTimeout(() => {
          setShowParticles(false);
        }, 800);
        
        // Update score and lines
        const newScore = score + linesCleared * POINTS_PER_LINE * level;
        const newLines = lines + linesCleared;
        
        setScore(newScore);
        setLines(newLines);
        
        // CHANGED: Level up based on score instead of lines
        const newLevel = Math.floor(newScore / POINTS_PER_LEVEL) + 1;
        
        // Level up if needed
        if (newLevel > level) {
          setLevel(newLevel);
          setDropTime(Math.max(100, 1000 - (newLevel - 1) * 100));
          toast({
            title: "Level Up!",
            description: `You've reached level ${newLevel}`,
          });
        }
      }
      
      setBoard(clearedBoard);
      
      // Get next tetromino
      setTetromino(nextTetromino);
      setNextTetromino(randomTetromino());
      
      // Check if game over by seeing if the new tetromino collides immediately
      if (checkCollision(clearedBoard, nextTetromino, { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })) {
        setGameOver(true);
        setGameActive(false);
        
        // Play game over sound
        if (audioRef.current.gameOver) {
          audioRef.current.gameOver.play().catch(e => console.log("Audio playback prevented by browser", e));
        }
        
        // Stop background music
        if (audioRef.current.backgroundMusic) {
          audioRef.current.backgroundMusic.pause();
          audioRef.current.backgroundMusic.currentTime = 0;
        }
        
        toast({
          title: "Game Over!",
          description: `Your final score: ${score}`,
          variant: "destructive"
        });
      }
      
      if (audioRef.current.drop) {
        audioRef.current.drop.currentTime = 0;
        audioRef.current.drop.play().catch(e => console.log("Audio playback prevented by browser", e));
      }
    }
  }, [board, tetromino, nextTetromino, gameActive, gameOver, isPaused, score, level, lines]);

  // Hard drop tetromino
  const hardDropTetromino = useCallback(() => {
    if (!gameActive || gameOver || isPaused) return;
    
    let newPos = { ...tetromino.pos };
    while (!checkCollision(board, tetromino, { ...newPos, y: newPos.y + 1 })) {
      newPos.y += 1;
    }
    
    setTetromino({ ...tetromino, pos: newPos });
    dropTetromino();
  }, [board, tetromino, dropTetromino, gameActive, gameOver, isPaused]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (!gameActive || gameOver) return;
    
    setIsPaused(!isPaused);
    
    // Pause/resume background music
    if (audioRef.current.backgroundMusic) {
      if (!isPaused) {
        audioRef.current.backgroundMusic.pause();
      } else {
        audioRef.current.backgroundMusic.play().catch(e => console.log("Audio playback prevented by browser", e));
      }
    }
  }, [gameActive, gameOver, isPaused]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          moveTetromino(-1);
          break;
        case 'ArrowRight':
          moveTetromino(1);
          break;
        case 'ArrowDown':
          dropTetromino();
          break;
        case 'ArrowUp':
          rotateTetromino();
          break;
        case ' ':
          hardDropTetromino();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveTetromino, dropTetromino, rotateTetromino, hardDropTetromino, togglePause, gameActive]);

  // Auto-drop tetromino based on level
  useEffect(() => {
    if (!gameActive || gameOver || isPaused) return;
    
    const dropTetrominoByTime = () => {
      dropTetromino();
    };
    
    dropTimeRef.current = window.setInterval(dropTetrominoByTime, dropTime);
    
    return () => {
      if (dropTimeRef.current) {
        clearInterval(dropTimeRef.current);
      }
    };
  }, [dropTetromino, dropTime, gameActive, gameOver, isPaused]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current.backgroundMusic) {
        audioRef.current.backgroundMusic.pause();
        audioRef.current.backgroundMusic.currentTime = 0;
      }
    };
  }, []);

  return {
    board,
    tetromino,
    nextTetromino,
    score,
    level,
    lines,
    gameOver,
    isPaused,
    gameActive,
    showParticles,
    particleCoords,
    startGame,
    resetGame,
    moveTetromino,
    dropTetromino,
    hardDropTetromino,
    rotateTetromino,
    togglePause
  };
};
