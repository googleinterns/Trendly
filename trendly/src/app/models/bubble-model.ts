export class Bubble {
  query: string;
  volume: number;
  clusterId: number;

  constructor(query: string, volume: number, clusterId: number) {
    this.query = query;
    this.volume = volume;
    this.clusterId = clusterId;
  }
}
