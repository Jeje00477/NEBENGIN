import { useEffect, useRef } from 'react';

export function usePolling(asyncFn, intervalMs, stopConditionFn) {
  const savedCallback = useRef(asyncFn);
  const savedStopCondition = useRef(stopConditionFn);
  const timeoutRef = useRef(null);
  const isRunningRef = useRef(false);
  
  useEffect(() => {
    savedCallback.current = asyncFn;
  }, [asyncFn]);

  useEffect(() => {
    savedStopCondition.current = stopConditionFn;
  }, [stopConditionFn]);

  useEffect(() => {
    let isMounted = true;

    const tick = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      try {
        const result = await savedCallback.current();

        if (isMounted && savedStopCondition.current && savedStopCondition.current(result)) {
          return; // stop polling
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        isRunningRef.current = false;

        if (isMounted && intervalMs !== null) {
          timeoutRef.current = setTimeout(tick, intervalMs);
        }
      }
    };
    tick();

    return () => {
      isMounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [intervalMs]);
}
