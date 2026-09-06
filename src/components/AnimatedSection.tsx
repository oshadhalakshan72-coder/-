import React from 'react';
import { motion } from 'motion/react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  id?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  id,
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 28 };
      case 'down':
        return { opacity: 0, y: -28 };
      case 'left':
        return { opacity: 0, x: 28 };
      case 'right':
        return { opacity: 0, x: -28 };
      case 'none':
      default:
        return { opacity: 0, scale: 0.96 };
    }
  };

  return (
    <motion.div
      id={id}
      initial={getInitialOffset()}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
