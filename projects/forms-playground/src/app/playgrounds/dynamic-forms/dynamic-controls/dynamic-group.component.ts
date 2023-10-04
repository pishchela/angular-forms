
import { Component, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDynamicControl, comparatorFn, dynamicControlResolver } from './base-dynamic-control';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicControlResolver } from "./dynamic-control-resolver.service";
import { ControlInjectorPipe } from "./control-injector.pipe";
@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  viewProviders: [dynamicControlResolver],
  template: `
    <fieldset [formGroupName]="control.controlKey">
      <legend>{{control.config.label}}</legend>
      <ng-container *ngFor="let control of control.config.controls | keyvalue: comparatorFn">
        <ng-container
          [ngComponentOutlet]="controlResolver.resolve(control.value.controlType) | async"
          [ngComponentOutletInjector]="control.key | controlInjector:control.value"></ng-container>
      </ng-container>
    </fieldset>
  `,
  styles: [
  ]
})
export class DynamicGroupComponent extends BaseDynamicControl {
  @HostBinding('class') override hostClass = 'form-field-group';
  controlResolver = inject(DynamicControlResolver);
  protected comparatorFn = comparatorFn;
}
