import { Toaster as HotToaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export const Toaster = () => {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#fff',
          color: '#374151',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '400px',
        },
        // Success toast
        success: {
          duration: 3000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
        },
        // Loading toast
        loading: {
          duration: Infinity,
          style: {
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
          },
        },
      }}
    />
  );
};

// Custom toast components
export const toast = {
  success: (message: string, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast.success(message, {
        icon: <CheckCircle className="w-5 h-5" />,
        ...options,
      })
    );
  },
  
  error: (message: string, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast.error(message, {
        icon: <XCircle className="w-5 h-5" />,
        ...options,
      })
    );
  },
  
  warning: (message: string, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast(message, {
        icon: <AlertCircle className="w-5 h-5" />,
        style: {
          background: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fed7aa',
        },
        iconTheme: {
          primary: '#f59e0b',
          secondary: '#fffbeb',
        },
        ...options,
      })
    );
  },
  
  info: (message: string, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast(message, {
        icon: <Info className="w-5 h-5" />,
        style: {
          background: '#eff6ff',
          color: '#2563eb',
          border: '1px solid #bfdbfe',
        },
        iconTheme: {
          primary: '#3b82f6',
          secondary: '#eff6ff',
        },
        ...options,
      })
    );
  },
  
  loading: (message: string, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast.loading(message, options)
    );
  },
  
  dismiss: (toastId?: string) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast.dismiss(toastId)
    );
  },
  
  promise: (promise: Promise<any>, messages: {
    loading: string;
    success: string;
    error: string;
  }, options?: any) => {
    return import('react-hot-toast').then(({ default: toast }) =>
      toast.promise(promise, messages, options)
    );
  },
};
