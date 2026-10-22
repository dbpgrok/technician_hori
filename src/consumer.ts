import type { SystemMetrics } from '../../technician_verti/src/contract';

export function isVerticalActive(metrics: SystemMetrics): boolean {
  return metrics.verticalStatus === 'active';
}
