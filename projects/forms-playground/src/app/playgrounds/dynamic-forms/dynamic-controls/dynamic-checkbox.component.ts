import { Component } from '@angular/core';
import { BaseDynamicControl, dynamicControlResolver, sharedDynamicControlDeps } from "./base-dynamic-control";
import { ValidatorMessageContainer } from "../../../core/input-error/validator-message-container.directive";

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [...sharedDynamicControlDeps, ValidatorMessageContainer],
  viewProviders: [dynamicControlResolver],
  template: `
    <div>
      <input
        [container]="containerDir.container"
        type="checkbox"
        [formControlName]="control.controlKey"
        [id]="control.controlKey"
        [checked]="control.config.value">
      <label [for]="control.controlKey">{{control.config.label}}</label>
    </div>
    <ng-container validatorMessageContainer #containerDir="validatorMessageContainer"></ng-container>
  `,
  styles: [`
    :host > div {
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
  `]
})
export class DynamicCheckboxComponent extends BaseDynamicControl{
}
