import {Component} from '@angular/core';
import {Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroupDirective, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ClustersSectionComponent} from '../clusters-section/clusters-section.component';
import {CircleDatum} from '../models/circle-datum';

/** Error when invalid control is dirty, touched, or submitted. */
export class AddClusterErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl|null, form: FormGroupDirective|NgForm|null):
      boolean {
    const isSubmitted = form && form.submitted;
    return !!(
        control && control.invalid &&
        (control.dirty || control.touched || isSubmitted));
  }
}

export interface AddClusterDialogData {
  addCluster:
      (title: String, clusterly: ClustersSectionComponent,
       query: CircleDatum) => void;
  clustersTitles: String[];
  query?: CircleDatum;
  clusterly: ClustersSectionComponent;
}

/** A dialog that allows the user to pick a name for the new added cluster. */
@Component({
  selector: 'app-add-cluster-dialog',
  templateUrl: './add-cluster-dialog.component.html',
  styleUrls: ['./add-cluster-dialog.component.css']
})
export class AddClusterDialogComponent {
  clusterTitle: String;
  readonly titleFormControl: FormControl;
  readonly matcher = new AddClusterErrorStateMatcher();

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddClusterDialogData) {
    this.titleFormControl = new FormControl(
        '', [Validators.required, this.existingTitle(data.clustersTitles)]);
    this.titleFormControl.updateValueAndValidity(
        {onlySelf: true, emitEvent: false});
  }

  /** An added title can't match any existing title. */
  private existingTitle(clustersTitles: String[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any}|null => {
      const isForbidden = clustersTitles.includes(control.value);
      return isForbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
}
