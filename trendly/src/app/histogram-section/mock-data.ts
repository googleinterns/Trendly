interface Topic {
  title: string;
  value: number;
  description: string;
}

interface Point {
  value: number;
  date: string;
}

interface GraphSection {
  term: string;
  points: Point[]
}

interface DataValueType {
  lines: GraphSection[]
}

const topic1: Topic = {
  title: 'elections',
  value: 80,
  description: 'elections'
};
const topic2: Topic = {
  title: 'corona',
  value: 100,
  description: 'a dangerous virus'
};
export const NEW_MOCK_DATA: Map<Topic, DataValueType> =
    new Map<Topic, DataValueType>();
NEW_MOCK_DATA.set(topic1, {
  'lines': [{
    'term': 'soccer',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
      {'value': 42, 'date': '2010-02-14'}, {'value': 28, 'date': '2010-02-21'},
      {'value': 20, 'date': '2010-02-28'}, {'value': 27, 'date': '2010-03-07'},
      {'value': 0, 'date': '2010-03-14'},  {'value': 27, 'date': '2010-03-21'},
      {'value': 30, 'date': '2010-03-28'}, {'value': 47, 'date': '2010-04-04'},
      {'value': 38, 'date': '2010-04-11'}, {'value': 13, 'date': '2010-04-18'},
      {'value': 20, 'date': '2010-04-25'}, {'value': 33, 'date': '2010-05-02'},
      {'value': 29, 'date': '2010-05-09'}, {'value': 58, 'date': '2010-05-16'},
      {'value': 50, 'date': '2010-05-23'}, {'value': 31, 'date': '2010-05-30'},
      {'value': 39, 'date': '2010-06-06'}, {'value': 35, 'date': '2010-06-13'},
      {'value': 33, 'date': '2010-06-20'}, {'value': 32, 'date': '2010-06-27'},
      {'value': 33, 'date': '2010-07-04'}, {'value': 44, 'date': '2010-07-11'},
      {'value': 43, 'date': '2010-07-18'}, {'value': 100, 'date': '2010-07-25'},
      {'value': 50, 'date': '2010-08-01'}, {'value': 45, 'date': '2010-08-08'},
      {'value': 36, 'date': '2010-08-15'}, {'value': 35, 'date': '2010-08-22'},
      {'value': 28, 'date': '2010-08-29'}, {'value': 34, 'date': '2010-09-05'},
      {'value': 33, 'date': '2010-09-12'}, {'value': 33, 'date': '2010-09-19'},
      {'value': 19, 'date': '2010-09-26'}, {'value': 20, 'date': '2010-10-03'},
      {'value': 13, 'date': '2010-10-10'}, {'value': 31, 'date': '2010-10-17'},
      {'value': 12, 'date': '2010-10-24'}, {'value': 24, 'date': '2010-10-31'},
      {'value': 18, 'date': '2010-11-07'}, {'value': 18, 'date': '2010-11-14'},
      {'value': 12, 'date': '2010-11-21'}, {'value': 43, 'date': '2010-11-28'},
      {'value': 37, 'date': '2010-12-05'}, {'value': 39, 'date': '2010-12-12'},
      {'value': 23, 'date': '2010-12-19'}, {'value': 59, 'date': '2010-12-26'},
      {'value': 29, 'date': '2011-01-02'}, {'value': 28, 'date': '2011-01-09'},
      {'value': 44, 'date': '2011-01-16'}, {'value': 11, 'date': '2011-01-23'},
      {'value': 38, 'date': '2011-01-30'}
    ]
  }]
});
NEW_MOCK_DATA.set(topic2, {
  'lines': [{
    'term': 'soccer',
    'points': [
      {'value': 15, 'date': '2010-01-03'}, {'value': 21, 'date': '2010-01-10'},
      {'value': 28, 'date': '2010-01-17'}, {'value': 27, 'date': '2010-01-24'},
      {'value': 20, 'date': '2010-01-31'}, {'value': 0, 'date': '2010-02-07'},
      {'value': 42, 'date': '2010-02-14'}, {'value': 28, 'date': '2010-02-21'},
      {'value': 20, 'date': '2010-02-28'}, {'value': 27, 'date': '2010-03-07'},
      {'value': 0, 'date': '2010-03-14'},  {'value': 27, 'date': '2010-03-21'},
      {'value': 30, 'date': '2010-03-28'}, {'value': 47, 'date': '2010-04-04'},
      {'value': 38, 'date': '2010-04-11'}, {'value': 13, 'date': '2010-04-18'},
      {'value': 20, 'date': '2010-04-25'}, {'value': 33, 'date': '2010-05-02'},
      {'value': 29, 'date': '2010-05-09'}, {'value': 58, 'date': '2010-05-16'},
      {'value': 50, 'date': '2010-05-23'}, {'value': 31, 'date': '2010-05-30'},
      {'value': 39, 'date': '2010-06-06'}, {'value': 35, 'date': '2010-06-13'},
      {'value': 33, 'date': '2010-06-20'}, {'value': 32, 'date': '2010-06-27'},
      {'value': 33, 'date': '2010-07-04'}, {'value': 44, 'date': '2010-07-11'},
      {'value': 43, 'date': '2010-07-18'}, {'value': 100, 'date': '2010-07-25'},
      {'value': 50, 'date': '2010-08-01'}, {'value': 45, 'date': '2010-08-08'},
      {'value': 36, 'date': '2010-08-15'}, {'value': 35, 'date': '2010-08-22'},
      {'value': 28, 'date': '2010-08-29'}, {'value': 34, 'date': '2010-09-05'},
      {'value': 33, 'date': '2010-09-12'}, {'value': 33, 'date': '2010-09-19'},
      {'value': 19, 'date': '2010-09-26'}, {'value': 20, 'date': '2010-10-03'},
      {'value': 13, 'date': '2010-10-10'}, {'value': 31, 'date': '2010-10-17'},
      {'value': 12, 'date': '2010-10-24'}, {'value': 24, 'date': '2010-10-31'},
      {'value': 18, 'date': '2010-11-07'}, {'value': 18, 'date': '2010-11-14'},
      {'value': 12, 'date': '2010-11-21'}, {'value': 43, 'date': '2010-11-28'},
      {'value': 37, 'date': '2010-12-05'}, {'value': 39, 'date': '2010-12-12'},
      {'value': 23, 'date': '2010-12-19'}, {'value': 59, 'date': '2010-12-26'},
      {'value': 29, 'date': '2011-01-02'}, {'value': 28, 'date': '2011-01-09'},
      {'value': 44, 'date': '2011-01-16'}, {'value': 11, 'date': '2011-01-23'},
      {'value': 38, 'date': '2011-01-30'}
    ]
  }]
});
