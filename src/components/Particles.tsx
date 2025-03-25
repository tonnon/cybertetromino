
import React, { useEffect, useState } from 'react';

interface ParticleProps {
  posX: number;
  posY: number;
  active: boolean;
}

const Particles: React.FC<ParticleProps> = ({ posX, posY, active }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number }[]>([]);
  
  useEffect(() => {
    if (active) {
      const colors = [
        'rgba(239, 68, 68, 0.8)',  // Red
        'rgba(249, 115, 22, 0.8)',  // Orange
        'rgba(250, 204, 21, 0.8)',  // Yellow
        'rgba(16, 185, 129, 0.8)',  // Green
        'rgba(14, 165, 233, 0.8)',  // Blue
        'rgba(139, 92, 246, 0.8)',  // Purple
        'rgba(217, 70, 239, 0.8)',  // Pink
      ];
      
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 300 - 150,  // Random x direction (-150 to 150)
        y: Math.random() * 300 - 150,  // Random y direction (-150 to 150)
        size: Math.random() * 6 + 2,  // Random size (2-8)
        color: colors[Math.floor(Math.random() * colors.length)],  // Random color
        delay: Math.random() * 200,  // Random delay (0-200ms)
      }));
      
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);
  
  if (!active) return null;
  
  return (
    <div className="absolute pointer-events-none z-50" style={{ left: posX, top: posY }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-particle-explosion"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 6px ${particle.color}`,
            opacity: 1,
            '--x': `${particle.x}px`,
            '--y': `${particle.y}px`,
            animationDelay: `${particle.delay}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default Particles;
