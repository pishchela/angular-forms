import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlResolver, sharedDynamicControlDeps } from "./base-dynamic-control";

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [...sharedDynamicControlDeps],
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
