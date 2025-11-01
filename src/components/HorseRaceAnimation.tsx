import { useEffect, useState } from "react";

interface HorseRaceAnimationProps {
  isActive: boolean;
  speed: number; // 0-10 scale
  hasIdeas?: boolean; // Whether any ideas have been submitted yet
}

export const HorseRaceAnimation = ({ isActive, speed, hasIdeas = false }: HorseRaceAnimationProps) => {
  const [position, setPosition] = useState(0);
  const [competitor1Position, setCompetitor1Position] = useState(0);
  const [competitor2Position, setCompetitor2Position] = useState(0);
  const [competitor1Speed, setCompetitor1Speed] = useState(2.5);
  const [competitor2Speed, setCompetitor2Speed] = useState(2);

  // Player horse movement - drastically reduced speed
  useEffect(() => {
    if (!isActive) {
      setPosition(0);
      return;
    }

    if (speed === 0) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = prev + speed * 0.025; // Reduced from 0.08 to 0.025
        return newPos >= 95 ? 0 : newPos;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, speed]);

  // Competitor 1 movement (AI) - Marcus
  useEffect(() => {
    if (!isActive) {
      setCompetitor1Position(0);
      return;
    }

    const interval = setInterval(() => {
      // Vary speed slightly for realistic competition
      setCompetitor1Speed((prev) => {
        const variation = (Math.random() - 0.5) * 1;
        return Math.max(1.5, Math.min(3.5, prev + variation));
      });

      setCompetitor1Position((prev) => {
        const newPos = prev + competitor1Speed * 0.025; // Reduced from 0.08 to 0.025
        return newPos >= 95 ? 0 : newPos;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, competitor1Speed]);

  // Competitor 2 movement (AI) - Sarah (Slower)
  useEffect(() => {
    if (!isActive) {
      setCompetitor2Position(0);
      return;
    }

    const interval = setInterval(() => {
      // Vary speed slightly for realistic competition - slower than competitor 1
      setCompetitor2Speed((prev) => {
        const variation = (Math.random() - 0.5) * 0.8;
        return Math.max(1, Math.min(2.5, prev + variation));
      });

      setCompetitor2Position((prev) => {
        const newPos = prev + competitor2Speed * 0.025; // Reduced from 0.08 to 0.025
        return newPos >= 95 ? 0 : newPos;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, competitor2Speed]);

  const animationSpeed = speed === 0 ? 0 : Math.max(0.3, 2 - (speed / 10));
  const competitor1AnimSpeed = Math.max(0.3, 2 - (competitor1Speed / 10));
  const competitor2AnimSpeed = Math.max(0.3, 2 - (competitor2Speed / 10));

  return (
    <div className="relative w-full h-48 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden border-4 border-primary/20">
      {/* Sky background */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-300 to-sky-200" />

      {/* Racing track gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-green-400/50 to-green-600/50" />

      {/* Three racing lanes with divider lines */}
      <div className="absolute inset-x-0 bottom-0 h-32 flex flex-col">
        <div className="flex-1 border-b-2 border-white/40 border-dashed" />
        <div className="flex-1 border-b-2 border-white/40 border-dashed" />
        <div className="flex-1" />
      </div>

      {/* Competitor 2 (Top Lane) - Sarah */}
      <div
        className="absolute top-8 transition-all duration-100"
        style={{
          left: `${competitor2Position}%`,
          transform: `scale(0.9) scaleX(-1)`,
        }}
      >
        <div className="relative">
          <div
            className="text-4xl leading-none opacity-80"
            style={{
              animation: `gallop ${competitor2AnimSpeed}s ease-in-out infinite`,
            }}
          >
            🏇
          </div>
          {/* Name Label */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs bg-red-500/80 text-white px-2 py-0.5 rounded-full whitespace-nowrap transform scale-x-[-1]">
            Sarah
          </div>
        </div>
      </div>

      {/* Competitor 1 (Middle Lane) - Marcus */}
      <div
        className="absolute top-20 transition-all duration-100"
        style={{
          left: `${competitor1Position}%`,
          transform: `scale(0.9) scaleX(-1)`,
        }}
      >
        <div className="relative">
          <div
            className="text-4xl leading-none opacity-80"
            style={{
              animation: `gallop ${competitor1AnimSpeed}s ease-in-out infinite`,
            }}
          >
            🏇
          </div>
          {/* Name Label */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs bg-orange-500/80 text-white px-2 py-0.5 rounded-full whitespace-nowrap transform scale-x-[-1]">
            Marcus
          </div>
        </div>
      </div>

      {/* Player Horse (Bottom Lane) - You! */}
      <div
        className="absolute bottom-6 transition-all duration-100"
        style={{
          left: `${position}%`,
          transform: `scale(${speed === 0 ? 1 : 1.1}) scaleX(-1)`,
        }}
      >
        <div className="relative">
          {/* Horse emoji with animation */}
          <div
            className="text-5xl leading-none"
            style={{
              animation: speed > 0
                ? `gallop ${animationSpeed}s ease-in-out infinite`
                : 'none',
              filter: speed === 0 ? 'grayscale(50%) opacity(0.7)' : 'grayscale(0%)',
            }}
          >
            🏇
          </div>

          {/* Player Label */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold whitespace-nowrap transform scale-x-[-1]">
            YOU
          </div>

          {/* Speed lines when fast - behind the horse */}
          {speed > 5 && (
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 transform scale-x-[-1]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 bg-primary/40 rounded-full mb-2"
                  style={{
                    width: `${15 - i * 3}px`,
                    animation: `speedLine 0.3s ease-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Speed indicator - Your Speed */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
        <div className="text-xs font-semibold bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded">
          Your Speed
        </div>
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-full transition-all ${i < speed
                    ? 'bg-primary'
                    : 'bg-muted'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Race position indicator */}
      {isActive && (
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border-2 border-primary/20">
          <div className="text-xs font-semibold mb-1">Race Position</div>
          <div className="flex gap-2 text-xs">
            {[
              { name: 'You', pos: position, color: 'text-primary' },
              { name: 'Sarah', pos: competitor2Position, color: 'text-red-500' },
              { name: 'Marcus', pos: competitor1Position, color: 'text-orange-500' },
            ]
              .sort((a, b) => b.pos - a.pos)
              .map((racer, idx) => (
                <div key={racer.name} className="flex items-center gap-1">
                  <span className="font-bold">{idx + 1}.</span>
                  <span className={racer.color}>{racer.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Status text */}
      {speed === 0 && isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-destructive animate-pulse">
            <span className="text-sm font-semibold text-destructive">
              {hasIdeas
                ? "Your horse stopped! Submit ideas to catch up!"
                : "Submit an idea to start racing!"}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gallop {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes speedLine {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-15px); }
        }
      `}</style>
    </div>
  );
};
