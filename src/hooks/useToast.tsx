import toast from 'react-hot-toast';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export const useToast = () => {
  const showToast = (options: ToastOptions) => {
    const { title, description, variant = 'default', duration = 4000 } = options;
    
    const message = title && description ? `${title}: ${description}` : title || description || '';
    
    if (variant === 'destructive') {
      toast.error(message, { duration });
    } else {
      toast.success(message, { duration });
    }
  };

  return {
    toast: showToast,
  };
};

