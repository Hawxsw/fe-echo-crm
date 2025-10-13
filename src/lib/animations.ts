// Configurações de animações reutilizáveis para Framer Motion

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Transições suaves
export const smoothTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const springTransition = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

export const slowSpring = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

// Animações de lista (stagger)
export const listContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// Animações de hover
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.2 }
  },
};

// Animações de pulso
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Animações de rotação
export const rotate = {
  animate: {
    rotate: [0, 360],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Animação de digitando (typing indicator)
export const typingDot = (delay: number = 0) => ({
  animate: {
    y: [0, -8, 0],
  },
  transition: {
    duration: 0.6,
    repeat: Infinity,
    delay,
  },
});

// Animação de notificação
export const notificationBounce = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
  },
  exit: {
    scale: 0,
    opacity: 0,
  },
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

// Animação de badge
export const badgePing = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

