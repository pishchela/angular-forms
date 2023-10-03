import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDynamicControl, dynamicControlResolver } from "./base-dynamic-control";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [dynamicControlResolver],
  template: `
    <input
      type="checkbox"
      [formControlName]="control.controlKey"
      [id]="control.controlKey"
      [checked]="control.config.value">
    <label [for]="control.controlKey">{{control.config.label}}</label>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
  `]
})
export class DynamicCheckboxComponent extends BaseDynamicControl{
}
