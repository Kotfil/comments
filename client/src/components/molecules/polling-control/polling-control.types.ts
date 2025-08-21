export interface PollingControlProps {
  isPolling: boolean;
  onStartPolling: () => void;
  onStopPolling: () => void;
  onRefresh: () => void;
  pollInterval: number;
  onIntervalChange?: (interval: number) => void;
  showStatus?: boolean;
}
