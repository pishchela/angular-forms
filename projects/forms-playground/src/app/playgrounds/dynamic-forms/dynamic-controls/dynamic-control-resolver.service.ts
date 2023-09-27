import { Injectable, Type } from '@angular/core';
import { DynamicControl } from "../dynamic-forms.model";
import { DynamicInputComponent } from "./dynamic-input.component";
import { DynamicSelectComponent } from "./dynamic-select.component";
import { DynamicCheckboxComponent } from "./dynamic-checkbox.component";
import { DynamicGroupComponent } from "./dynamic-group.component";

type DynamicControlsMap = {
  [T in DynamicControl['controlType']]: Type<any>;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private controlComponents: DynamicControlsMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
    checkbox: DynamicCheckboxComponent,
    group: DynamicGroupComponent,
  };
  constructor() { }

  resolve(controlType: keyof DynamicControlsMap) {
    return this.controlComponents[controlType];
  }
}
