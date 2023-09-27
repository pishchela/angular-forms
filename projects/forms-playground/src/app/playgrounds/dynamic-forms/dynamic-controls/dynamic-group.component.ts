
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDynamicControl } from './base-dynamic-control';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicControlResolver } from "./dynamic-control-resolver.service";
import { ControlInjectorPipe } from "./control-injector.pipe";
@Component({
  selector: 'app-dynamic-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe],
  template: `
    <ng-container [formGroup]="formGroup">
      <fieldset [formGroupName]="control.controlKey">
        <legend>{{control.config.label}}</legend>
        <div *ngFor="let control of control.config.controls | keyvalue" class="form-field">
          <ng-container
            [ngComponentOutlet]="controlResolver.resolve(control.value.controlType)"
            [ngComponentOutletInjector]="control.key | controlInjector:control.value"></ng-container>
        </div>
      </fieldset>
    </ng-container>
  `,
  styles: [
  ]
})
export class DynamicGroupComponent extends BaseDynamicControl {
  controlResolver = inject(DynamicControlResolver);
}
