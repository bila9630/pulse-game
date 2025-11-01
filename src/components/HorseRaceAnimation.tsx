import { useEffect, useState } from "react";

interface HorseRaceAnimationProps {
  isActive: boolean;
  speed: number; // 0-10 scale
}

export const HorseRaceAnimation = ({ isActive, speed }: HorseRaceAnimationProps) => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    if (!isActive || speed === 0) return;
    
    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev + speed * 0.5;
        return newPos >= 100 ? 0 : newPos;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, speed]);
  
  const animationSpeed = speed === 0 ? 0 : Math.max(0.5, 3 - (speed / 5));
  
  return (
    <div className="relative w-full h-32 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden border-4 border-primary/20">
      {/* Sky background */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sky-300 to-sky-200" />
      
      {/* Track lines */}
      <div className="absolute inset-0 flex flex-col justify-end pb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="h-px bg-white/30"
            style={{ marginBottom: '4px' }}
          />
        ))}
      </div>
      
      {/* Racing track gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-green-400/50 to-green-600/50" />
      
      {/* Horse */}
      <div 
        className="absolute bottom-4 transition-all duration-100"
        style={{ 
          left: `${position}%`,
          transform: speed === 0 ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        <div className="relative">
          {/* Horse emoji with animation */}
          <div 
            className="text-6xl"
            style={{
              animation: speed > 0 
                ? `gallop ${animationSpeed}s steps(2) infinite`
                : 'none',
              filter: speed === 0 ? 'grayscale(50%)' : 'grayscale(0%)',
            }}
          >
            🏇
          </div>
          
          {/* Speed lines when fast */}
          {speed > 5 && (
            <div className="absolute left-[-20px] top-1/2 -translate-y-1/2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 bg-primary/40 rounded-full mb-2 animate-slide-out-right"
                  style={{
                    width: `${15 - i * 3}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Speed indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
        <div className="flex gap-1">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-4 rounded-full transition-all ${
                i < speed
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Status text */}
      {speed === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-destructive animate-pulse">
            <span className="text-sm font-semibold text-destructive">
              Horse stopped! Generate ideas to keep racing!
            </span>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes gallop {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
