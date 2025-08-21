import { useState, useEffect, useCallback } from 'react';

interface UsePollingControlProps {
  pollInterval?: number;
  autoStart?: boolean;
  onPoll?: () => void;
}

export const usePollingControl = ({
  pollInterval = 30000,
  autoStart = true,
  onPoll
}: UsePollingControlProps = {}) => {
  const [isPolling, setIsPolling] = useState(autoStart);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Функция для выполнения polling
  const executePoll = useCallback(() => {
    if (onPoll) {
      onPoll();
    }
  }, [onPoll]);

  // Запуск polling
  const startPolling = useCallback(() => {
    if (isPolling) return; // Уже запущен

    const id = setInterval(executePoll, pollInterval);
    setIntervalId(id);
    setIsPolling(true);
  }, [isPolling, pollInterval, executePoll]);

  // Остановка polling
  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPolling(false);
  }, [intervalId]);

  // Перезапуск polling с новым интервалом
  const restartPolling = useCallback((newInterval?: number) => {
    stopPolling();
    const interval = newInterval || pollInterval;
    
    setTimeout(() => {
      const id = setInterval(executePoll, interval);
      setIntervalId(id);
      setIsPolling(true);
    }, 100);
  }, [stopPolling, pollInterval, executePoll]);

  // Автоматический запуск при монтировании
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }

    // Очистка при размонтировании
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoStart, startPolling, intervalId]);

  // Очистка при изменении pollInterval
  useEffect(() => {
    if (isPolling && intervalId) {
      restartPolling(pollInterval);
    }
  }, [pollInterval, isPolling, intervalId, restartPolling]);

  return {
    isPolling,
    startPolling,
    stopPolling,
    restartPolling,
    pollInterval,
  };
};
