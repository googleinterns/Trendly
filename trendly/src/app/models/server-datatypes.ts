/** Query data type as recieved from the server. */
export interface QueryData {
  title: string;
  value: number;
}

/** Cluster data type as recieved from the server. */
export interface ClusterData {
  title: string;
  id: number;
  queries: QueryData[]
}
