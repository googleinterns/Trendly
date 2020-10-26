import {ClusterData} from '../models/server-datatypes'
import {ClusterDataObj} from '../models/server-datatypes';


/**
 * Const mock data, to be deleted when the server is connected
 */
export const CLUSTERS_DATA = {
  '0': {
    title: 'Cluster 1',
    id: 1,
    volume: 100,
    queriesToDisplay: [
      {title: 'This is query 1 from cluster 1 ', value: 10},
      {title: 'This is query 2 from cluster 1 ', value: 25},
      {title: 'This is query 3 from cluster 1 ', value: 50},
      {title: 'This is query 4 from cluster 1 ', value: 80},
      {title: 'This is query 5 from cluster 1 ', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [3]
  },
  '1': {
    title: 'Cluster 2',
    id: 2,
    volume: 100,
    queriesToDisplay: [
      {title: 'apple!!', value: 5},
      {title: 'banana!!', value: 29},
      {title: 'orange!!', value: 37},
      {title: 'watermelon!!', value: 60},
      {title: 'grapes!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [4]
  },
  '2': {
    title: 'Cluster 3',
    id: 3,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!', value: 10},
      {title: 'hi!!!', value: 30},
      {title: 'hi!!!', value: 50},
      {title: 'hi!!!', value: 70},
      {title: 'hi!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [3]
  },
  '3': {
    title: 'Cluster 4',
    id: 4,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!!', value: 10},
      {title: 'hi!!!!', value: 25},
      {title: 'hi!!!!', value: 40},
      {title: 'hi!!!!', value: 90},
      {title: 'hi!!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [1]
  },
  '4': {
    title: 'Cluster 5',
    id: 5,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!!', value: 40},
      {title: 'hi!!!!', value: 25},
      {title: 'hi!!!!', value: 35},
      {title: 'hi!!!!', value: 90},
      {title: 'hi!!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [2]
  },
  '5': {
    title: 'Cluster 6',
    id: 6,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!!', value: 40},
      {title: 'hi!!!!', value: 25},
      {title: 'hi!!!!', value: 35},
      {title: 'hi!!!!', value: 90},
      {title: 'hi!!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [1]
  },
  '6': {
    title: 'Cluster 7',
    id: 7,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!!', value: 40},
      {title: 'hi!!!!', value: 25},
      {title: 'hi!!!!', value: 35},
      {title: 'hi!!!!', value: 90},
      {title: 'hi!!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [1]
  },
  '7': {
    title: 'Cluster 8',
    id: 8,
    volume: 100,
    queriesToDisplay: [
      {title: 'hi!!!!', value: 40},
      {title: 'hi!!!!', value: 25},
      {title: 'hi!!!!', value: 35},
      {title: 'hi!!!!', value: 90},
      {title: 'hi!!!!', value: 100},
    ],
    additionalQueries: [],
    relatedClustersIds: [2]
  },
};
