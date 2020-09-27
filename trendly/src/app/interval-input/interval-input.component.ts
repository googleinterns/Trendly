import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-interval-input',
  templateUrl: './interval-input.component.html',
  styleUrls: ['./interval-input.component.css']
})
export class IntervalInputComponent implements OnInit {
  @Output() emitter = new EventEmitter<number>();
  intervalValue : string = '1';

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * emits the interval to the parent 'inputs' component while the input value changes.
   */
  emitInterval() : void {
    this.emitter.emit(Number(this.intervalValue));
  }
}
