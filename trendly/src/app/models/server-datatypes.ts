/** Query data type as recieved from the server. */
export interface QueryData {
  title: string;
  value: number;
}

/** Cluster data type as recieved from the server. */
export interface ClusterData {
  title: string;
  id: number;
  volume: number;
  queriesToDisplay: QueryData[];
  additionalQueries: QueryData[];
  relatedClustersIds: number[];
}

/** The final object that the sever returns. */
export interface ClusterDataObj {
  [id: number]: ClusterData
}
