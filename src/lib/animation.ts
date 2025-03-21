
import { useEffect, useState } from 'react';

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

// Custom hook for smooth element transitions
export const useTransition = (
  show: boolean,
  duration = 300
): { status: TransitionStatus; isVisible: boolean } => {
  const [status, setStatus] = useState<TransitionStatus>(show ? 'entered' : 'exited');
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    let timeoutId: number;

    if (show && status === 'exited') {
      setIsVisible(true);
      setStatus('entering');
      timeoutId = window.setTimeout(() => {
        setStatus('entered');
      }, 10); // Small delay to trigger CSS transitions
    } else if (!show && status === 'entered') {
      setStatus('exiting');
      timeoutId = window.setTimeout(() => {
        setStatus('exited');
        setIsVisible(false);
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [show, status, duration]);

  return { status, isVisible };
};

// Function to create staggered delay for animations
export const getStaggeredDelay = (index: number, baseDelay = 50): number => {
  return index * baseDelay;
};

// Preload images to avoid flickering
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

// Page transition animation
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Scale in animation 
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
};

// Slide up animation
export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
};
