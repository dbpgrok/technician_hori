import type { SystemMetrics } from '../../technician_verti/src/contract';

export function isVerticalActive(metrics: SystemMetrics): boolean {
  return metrics.verticalStatus === 'active';
}

export function createMetrics(): SystemMetrics {
  const timestamp = new Date();

  return {
    id: 'technician_hori',
    verticalStatus: 'idle',
    timestamp,
    lastUpdated: timestamp.toISOString(),
  };
}
