import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-interval-input',
  templateUrl: './interval-input.component.html',
  styleUrls: ['./interval-input.component.css']
})
export class IntervalInputComponent {
  @Output() intervalSelected = new EventEmitter<number>();
  intervalValue: string = '1';

  /**
   * Emits the interval to the parent 'inputs' component while the input value
   * changes.
   */
  emitInterval(): void {
    this.intervalSelected.emit(Number(this.intervalValue));
  }
}
