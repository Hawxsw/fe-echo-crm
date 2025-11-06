import { useState, useEffect } from 'react';

type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

interface UseFetchOptions extends RequestInit {
  enabled?: boolean;
}

export function useFetch<T>(url: string | null, options?: UseFetchOptions): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' });

  useEffect(() => {
    if (!url || options?.enabled === false) {
      return;
    }

    setState({ status: 'loading' });

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { ...options, signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: T) => {
        setState({ status: 'success', data });
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          setState({ status: 'error', error });
        }
      });

    return () => {
      controller.abort();
    };
  }, [url, options?.enabled]);

  return state;
}

