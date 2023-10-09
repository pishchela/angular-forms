import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlResolver, sharedDynamicControlDeps } from "./base-dynamic-control";

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps],
  viewProviders: [dynamicControlResolver],
  template: `
    <label [for]="control.controlKey">{{control.config.label}}</label>
    <input [formControlName]="control.controlKey"
           [id]="control.controlKey"
           [value]="control.config.value"
           [type]="control.config.type">
  `
})
export class DynamicInputComponent extends BaseDynamicControl {

}
