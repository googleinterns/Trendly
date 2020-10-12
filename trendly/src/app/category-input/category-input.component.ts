import {Component, EventEmitter, OnInit, Output} from '@angular/core';

const CATEGORIES: object = {
  'All categories': '0',
  'Arts & Entertainment': '3',
  'Autos & Vehicles': '47',
  'Beauty & Fitness': '44',
  'Books & Literature': '22',
  'Business & Industrial': '12',
  'Computers & Electronics': '5',
  'Finance': '7',
  'Food & Drink': '71',
  'Games': '8',
  'Home & Garden': '11',
  'Health': '45',
  'Hobbies & Leisure': '65',
  'Internet & Telecom': '13',
  'Jobs & Education': '958',
  'Law & Government': '19',
  'News': '16',
  'Online Communities': '299',
  'People & Society': '14',
  'Pets & Animals': '66',
  'Real Estate': '29',
  'Reference': '533',
  'Science': '174',
  'Shopping': '18',
  'Sports': '20',
  'Travel': '67'
}

/** A selection input between Google Trends categories */
@Component({
  selector: 'app-category-input',
  templateUrl: './category-input.component.html',
  styleUrls: ['./category-input.component.css']
}) export class CategoryInputComponent {
  @Output() categorySelected = new EventEmitter<string>();
  categoryValue: string = 'All categories';
  categoriesOptions = Object.keys(CATEGORIES);

  /**
   * Emits to parent component the country name while the input value changes.
   */
  emitCategory(): void {
    const categoryCode = CATEGORIES[this.categoryValue];
    this.categorySelected.emit(categoryCode);
  }
}
