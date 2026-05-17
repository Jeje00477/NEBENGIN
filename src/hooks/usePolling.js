import { useEffect, useRef } from 'react';

export function usePolling(asyncFn, intervalMs, stopConditionFn) {
  const savedCallback = useRef(asyncFn);
  const intervalRef = useRef(null);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = asyncFn;
  }, [asyncFn]);

  useEffect(() => {
    let isMounted = true;

    const tick = async () => {
      try {
        const result = await savedCallback.current();
        if (isMounted && stopConditionFn && stopConditionFn(result)) {
          clearInterval(intervalRef.current);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Execute immediately once
    tick();

    // Then set interval
    if (intervalMs !== null) {
      intervalRef.current = setInterval(tick, intervalMs);
      return () => clearInterval(intervalRef.current);
    }
  }, [intervalMs, stopConditionFn]);
}
