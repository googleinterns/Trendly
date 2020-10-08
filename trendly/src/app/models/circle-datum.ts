/** An interface for d3 circle representing query data type. */
export interface CircleDatum {
  nodeId: string;
  name: string;
  label: string;
  x: number;
  y: number;
  fx: number;
  fy: number;
  r: number;
  color: string;
  volume: number;
  query: string;
  clusterId: number;
}
