/** Query data type as recieved from the server */
export interface QueryData {
    title: string;
    volume: number;
}

/** Cluster data type as recieved from the server */
export interface ClusterData {
    title: string;
    id: number;
    queries: QueryData[]
}