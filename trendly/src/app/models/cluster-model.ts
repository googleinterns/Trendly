import {Bubble} from './bubble-model'

export class Cluster {
  private title: string;
  private id: number;
  private _bubbles: Array<Bubble> = new Array<Bubble>();

  // TODO: check queries type !
  constructor(title: string, id: number, queries) {
    this.title = title;
    this.id = id;
    queries.forEach((query) =>
      this._bubbles.push(new Bubble(query.queryString, query.volume, id))
    );
  }
  
  get bubbles(): Array<Bubble> {
    return this._bubbles
  }
}
