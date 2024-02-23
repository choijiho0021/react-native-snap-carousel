import {useCallback, useEffect, useRef} from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
}

export function useIntervalWithStop(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>(() => {});
  const intervalRef = useRef<any>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(savedCallback.current, delay);
      intervalRef.current = id;
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);

  useEffect(() => {
    // clear interval on when component gets removed to avoid memory leaks
    return () => clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(savedCallback.current, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return {
    reset,
    stop,
  };
}
