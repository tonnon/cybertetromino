
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, ArrowLeft, ArrowDown, ArrowUp, ArrowRight } from "lucide-react";

interface ControlsProps {
  onMove: (dir: -1 | 1) => void;
  onDrop: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  gameActive: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onMove,
  onDrop,
  onRotate,
  onHardDrop,
  onTogglePause,
  isPaused,
  gameActive
}) => {
  if (!gameActive) return null;
  
  return (
    <div className="w-full flex flex-col gap-3 mt-4">
      <div className="flex justify-center items-center mb-1">
        <Button 
          variant="outline"
          size="icon"
          className="border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={onTogglePause}
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        {/* Top row - just rotate */}
        <div></div>
        <Button 
          variant="outline"
          size="icon"
          className="border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={onRotate}
        >
          <ArrowUp size={18} />
        </Button>
        <div></div>
        
        {/* Middle row - left, down, right */}
        <Button 
          variant="outline"
          size="icon"
          className="border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={() => onMove(-1)}
        >
          <ArrowLeft size={18} />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={onDrop}
        >
          <ArrowDown size={18} />
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={() => onMove(1)}
        >
          <ArrowRight size={18} />
        </Button>
      </div>
      
      <div className="mt-3">
        <Button 
          variant="outline"
          className="w-full border border-primary/50 bg-secondary/30 text-primary hover:bg-primary/10 neon-border"
          onClick={onHardDrop}
        >
          Hard Drop
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        <p>Keyboard: Arrow keys to move, Space to hard drop, P to pause</p>
      </div>
    </div>
  );
};

export default Controls;
