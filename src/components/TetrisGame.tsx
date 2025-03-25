
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTetris } from '@/hooks/useTetris';
import TetrisBoard from './TetrisBoard';
import NextTetromino from './NextTetromino';
import Controls from './Controls';
import Particles from './Particles';
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";

const TetrisGame: React.FC = () => {
  const {
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
  } = useTetris();

  const [showInstructions, setShowInstructions] = useState(false);

  // Fade elements in/out based on game state
  const mainVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const gameInfoVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
  };

  const controlsVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Game container */}
      <motion.div
        className="relative flex flex-col md:flex-row items-center justify-center gap-8 z-10"
        variants={mainVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Main game area */}
        <div className="relative">
          {/* Game board */}
          <TetrisBoard board={board} tetromino={tetromino} />
          
          {/* Particles effect on line clear */}
          <Particles posX={particleCoords.x} posY={particleCoords.y} active={showParticles} />
          
          {/* Game start overlay */}
          {!gameActive && !gameOver && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button 
                onClick={startGame}
                className="text-2xl py-8 px-12 bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90 animate-pulse-glow text-glow font-cyber font-bold tracking-wider rounded-md"
              >
                <Play className="mr-2" size={24} /> PLAY
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setShowInstructions(true)}
                className="mt-4 text-muted-foreground hover:text-foreground"
              >
                <Info className="mr-2" size={16} /> Instructions
              </Button>
            </motion.div>
          )}
          
          {/* Game over overlay */}
          {gameOver && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-cyber font-bold text-destructive text-glow mb-4">GAME OVER</h2>
              <p className="text-lg text-foreground mb-6">Final Score: <span className="font-bold">{score}</span></p>
              <Button 
                onClick={resetGame}
                className="text-xl py-6 px-10 bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90 animate-pulse-glow font-cyber tracking-wider rounded-md"
              >
                TRY AGAIN
              </Button>
            </motion.div>
          )}
          
          {/* Pause overlay */}
          {isPaused && (
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-cyber font-bold text-primary text-glow mb-4">PAUSED</h2>
              <Button 
                onClick={togglePause}
                className="text-xl py-6 px-10 bg-primary text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary/90 animate-pulse-glow font-cyber tracking-wider rounded-md"
              >
                RESUME
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Game info sidebar */}
        <motion.div 
          className="flex flex-col gap-6 max-w-[300px] w-full"
          variants={gameInfoVariants}
        >
          {/* Next tetromino */}
          <div className="bg-secondary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-4">
            <h3 className="text-muted-foreground mb-2 font-cyber text-sm">NEXT PIECE</h3>
            <div className="flex justify-center">
              <NextTetromino tetromino={nextTetromino} />
            </div>
          </div>
          
          {/* Score and level */}
          <div className="bg-secondary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-muted-foreground mb-1 font-cyber text-sm">SCORE</h3>
              <p className="text-3xl font-cyber font-bold text-glow text-foreground">{score}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-muted-foreground mb-1 font-cyber text-sm">LEVEL</h3>
              <p className="text-2xl font-cyber font-bold text-glow text-accent">{level}</p>
            </div>
            <div>
              <h3 className="text-muted-foreground mb-1 font-cyber text-sm">LINES</h3>
              <p className="text-xl font-cyber text-foreground">{lines}</p>
            </div>
          </div>
          
          {/* Controls (mobile-friendly) */}
          <motion.div 
            className="md:hidden"
            variants={controlsVariants}
          >
            <Controls
              onMove={moveTetromino}
              onDrop={dropTetromino}
              onRotate={rotateTetromino}
              onHardDrop={hardDropTetromino}
              onTogglePause={togglePause}
              isPaused={isPaused}
              gameActive={gameActive}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Controls (desktop) - shown below game on larger screens */}
      <motion.div 
        className="hidden md:block mt-8"
        variants={controlsVariants}
        initial="initial"
        animate="animate"
      >
        <Controls
          onMove={moveTetromino}
          onDrop={dropTetromino}
          onRotate={rotateTetromino}
          onHardDrop={hardDropTetromino}
          onTogglePause={togglePause}
          isPaused={isPaused}
          gameActive={gameActive}
        />
      </motion.div>
      
      {/* Instructions modal */}
      {showInstructions && (
        <motion.div 
          className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-secondary/50 backdrop-blur-lg border border-primary/30 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-cyber font-bold text-primary mb-4">HOW TO PLAY</h2>
            
            <div className="text-left mb-6">
              <p className="mb-3">Use the controls to move and rotate falling blocks to create complete horizontal lines, which will be cleared from the board.</p>
              
              <h3 className="text-lg font-semibold mb-1">Controls:</h3>
              <ul className="space-y-1 text-sm">
                <li>← → : Move left/right</li>
                <li>↓ : Soft drop</li>
                <li>↑ : Rotate</li>
                <li>Space : Hard drop</li>
                <li>P : Pause/Resume</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4 mb-1">Scoring:</h3>
              <p className="text-sm">Clear lines to score points. The more lines you clear at once, the higher your score.</p>
              <p className="text-sm mt-1">As your score increases, the level will increase and the blocks will fall faster!</p>
            </div>
            
            <Button 
              onClick={() => setShowInstructions(false)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-cyber"
            >
              CLOSE
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TetrisGame;
