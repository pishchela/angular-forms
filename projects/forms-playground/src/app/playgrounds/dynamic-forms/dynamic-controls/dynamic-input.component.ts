import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { BaseDynamicControl, dynamicControlResolver } from "./base-dynamic-control";

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [dynamicControlResolver],
  template: `
<!--    <ng-container [formGroup]="formGroup">-->
      <label [for]="control.controlKey">{{control.config.label}}</label>
      <input [formControlName]="control.controlKey"
             [id]="control.controlKey"
             [value]="control.config.value"
             [type]="control.config.type">
<!--    </ng-container>-->
  `
})
export class DynamicInputComponent extends BaseDynamicControl {

}
