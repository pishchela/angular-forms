import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { BaseDynamicControl, dynamicControlResolver } from "./base-dynamic-control";

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [dynamicControlResolver],
  template: `
    <label [for]="control.controlKey">{{control.config.label}}</label>
    <select
      [formControlName]="control.controlKey"
      [value]="control.config.value"
      [id]="control.controlKey">
      <option *ngFor="let option of control.config.options" [value]="option.value">{{option.label}}</option>
    </select>
  `
})
export class DynamicSelectComponent extends BaseDynamicControl{

}
