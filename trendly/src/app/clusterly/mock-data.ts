import { ClusterData } from '../models/server-datatypes'

/**
 * Const mock data, to be deleted when the server is connected
 */
export const CLUSTERS_DATA: ClusterData[] = [
    {
      title: 'Cluster 1',
      id: 1,
      queries: [
        { title: 'This is query 1 from cluster 1 ', volume: 10 },
        { title: 'This is query 2 from cluster 1 ', volume: 25 },
        { title: 'This is query 3 from cluster 1 ', volume: 50 },
        { title: 'This is query 4 from cluster 1 ', volume: 80 },
        { title: 'This is query 5 from cluster 1 ', volume: 100 },
      ],
    },
    {
      title: 'Cluster 2',
      id: 2,
      queries: [
        { title: 'apple!!', volume: 5 },
        { title: 'banana!!', volume: 29 },
        { title: 'orange!!', volume: 37 },
        { title: 'watermelon!!', volume: 60 },
        { title: 'grapes!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 3',
      id: 3,
      queries: [
        { title: 'hi!!!', volume: 10 },
        { title: 'hi!!!', volume: 30 },
        { title: 'hi!!!', volume: 50 },
        { title: 'hi!!!', volume: 70 },
        { title: 'hi!!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 4',
      id: 4,
      queries: [
        { title: 'hi!!!!', volume: 10 },
        { title: 'hi!!!!', volume: 25 },
        { title: 'hi!!!!', volume: 40 },
        { title: 'hi!!!!', volume: 90 },
        { title: 'hi!!!!', volume: 100 },
      ],
    },
    {
      title: 'Cluster 5',
      id: 5,
      queries: [
        { title: 'hi!!!!', volume: 40 },
        { title: 'hi!!!!', volume: 25 },
        { title: 'hi!!!!', volume: 35 },
        { title: 'hi!!!!', volume: 90 },
        { title: 'hi!!!!', volume: 100 },
      ],
    },
  ];
