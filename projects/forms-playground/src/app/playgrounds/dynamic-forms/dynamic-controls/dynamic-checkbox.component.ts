import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlResolver, sharedDynamicControlDeps } from "./base-dynamic-control";

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [...sharedDynamicControlDeps],
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
