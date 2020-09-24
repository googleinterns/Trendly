import { ClusterData } from '../models/server-datatypes'

/**
 * Const mock data, to be deleted when the server is connected
 */
export const CLUSTERS_DATA: ClusterData[] = [
    {
      title: 'Cluster 1',
      id: 1,
      queries: [
        { queryString: 'This is query 1 from cluster 1 ', volume: 10 },
        { queryString: 'This is query 2 from cluster 1 ', volume: 25 },
        { queryString: 'This is query 3 from cluster 1 ', volume: 50 },
        { queryString: 'This is query 4 from cluster 1 ', volume: 80 },
        { queryString: 'This is query 5 from cluster 1 ', volume: 100 },
      ],
    },
    {
      title: 'Cluster 2',
      id: 2,
      queries: [
        { queryString: 'apple!!', volume: 5 },
        { queryString: 'banana!!', volume: 29 },
        { queryString: 'orange!!', volume: 37 },
        { queryString: 'watermelon!!', volume: 60 },
        { queryString: 'grapes!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 3',
      id: 3,
      queries: [
        { queryString: 'hi!!!', volume: 10 },
        { queryString: 'hi!!!', volume: 30 },
        { queryString: 'hi!!!', volume: 50 },
        { queryString: 'hi!!!', volume: 70 },
        { queryString: 'hi!!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 4',
      id: 4,
      queries: [
        { queryString: 'hi!!!!', volume: 10 },
        { queryString: 'hi!!!!', volume: 25 },
        { queryString: 'hi!!!!', volume: 40 },
        { queryString: 'hi!!!!', volume: 90 },
        { queryString: 'hi!!!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 5',
      id: 5,
      queries: [
        { queryString: 'hi!!!!', volume: 40 },
        { queryString: 'hi!!!!', volume: 25 },
        { queryString: 'hi!!!!', volume: 35 },
        { queryString: 'hi!!!!', volume: 90 },
        { queryString: 'hi!!!!', volume: 100 },
      ],
    },
  ];