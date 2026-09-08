import { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = [
  '#6C5CE7',
  '#00D9B5',
  '#FFB020',
  '#F43F5E',
  '#22C55E',
];

function ConfettiBurst({ burstId }) {
  const particles = useMemo(() => {
    if (!burstId) return [];

    return Array.from(
      { length: 18 },
      (_, index) => {
        const angle =
          (index / 18) * Math.PI * 2;

        const distance =
          55 + Math.random() * 45;

        return {
          id: index,

          x:
            Math.cos(angle) *
            distance,

          y:
            Math.sin(angle) *
            distance,

          color:
            COLORS[index % COLORS.length],

          size:
            5 + Math.random() * 5,

          rotate:
            Math.random() * 180,
        };
      }
    );
  }, [burstId]);

  if (!burstId) return null;

  return (
    <div
      key={burstId}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.span
          key={`${burstId}-${particle.id}`}
          style={{
            position: 'absolute',

            top: '50%',
            left: '50%',

            width: particle.size,
            height: particle.size,

            borderRadius:
              particle.id % 2 === 0
                ? '50%'
                : '2px',

            background: particle.color,

            boxShadow:
              `0 0 10px ${particle.color}`,
          }}
          initial={{
            x: 0,
            y: 0,

            opacity: 1,

            scale: 0.7,

            rotate: 0,
          }}
          animate={{
            x: particle.x,

            y: particle.y,

            opacity: 0,

            scale: 0.3,

            rotate: particle.rotate,
          }}
          transition={{
            duration: 0.8,

            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default ConfettiBurst;