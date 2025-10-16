export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidBRPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Use pelo menos 8 caracteres');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Adicione letras minúsculas');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Adicione letras maiúsculas');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('Adicione números');
  }

  if (/[^a-zA-Z\d]/.test(password)) {
    score++;
  } else {
    feedback.push('Adicione caracteres especiais');
  }

  return {
    isStrong: score >= 4,
    score,
    feedback,
  };
}
