import React from 'react';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import { PlayArrow, Pause, Refresh, Settings } from '@mui/icons-material';
import { usePollingControl } from '@/hooks/use-polling-control';

interface PollingControlProps {
  isPolling: boolean;
  onStartPolling: () => void;
  onStopPolling: () => void;
  onRefresh: () => void;
  pollInterval: number;
  onIntervalChange?: (interval: number) => void;
  showStatus?: boolean;
}

export const PollingControl: React.FC<PollingControlProps> = ({
  isPolling,
  onStartPolling,
  onStopPolling,
  onRefresh,
  pollInterval,
  onIntervalChange,
  showStatus = true,
}) => {
  const formatInterval = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}с`;
    return `${Math.round(ms / 60000)}м`;
  };

  const handleIntervalChange = (newInterval: number) => {
    if (onIntervalChange) {
      onIntervalChange(newInterval);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Кнопка Play/Pause */}
      <Tooltip
        title={
          isPolling ? 'Остановить автообновление' : 'Запустить автообновление'
        }
      >
        <IconButton
          onClick={isPolling ? onStopPolling : onStartPolling}
          color={isPolling ? 'success' : 'default'}
          size="small"
        >
          {isPolling ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Tooltip>

      {/* Кнопка обновления */}
      <Tooltip title="Обновить сейчас">
        <IconButton onClick={onRefresh} size="small">
          <Refresh />
        </IconButton>
      </Tooltip>

      {/* Статус polling */}
      {showStatus && (
        <Chip
          label={`Автообновление: ${formatInterval(pollInterval)}`}
          size="small"
          variant="outlined"
          color={isPolling ? 'success' : 'default'}
          icon={isPolling ? <PlayArrow /> : <Pause />}
        />
      )}

      {/* Быстрые интервалы */}
      {onIntervalChange && (
        <Box display="flex" gap={0.5}>
          <Chip
            label="10с"
            size="small"
            variant={pollInterval === 10000 ? 'filled' : 'outlined'}
            onClick={() => handleIntervalChange(10000)}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="30с"
            size="small"
            variant={pollInterval === 30000 ? 'filled' : 'outlined'}
            onClick={() => handleIntervalChange(30000)}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="1м"
            size="small"
            variant={pollInterval === 60000 ? 'filled' : 'outlined'}
            onClick={() => handleIntervalChange(60000)}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      )}
    </Box>
  );
};
