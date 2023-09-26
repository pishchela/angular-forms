import { Injectable, Type } from '@angular/core';
import { DynamicControl } from "../dynamic-forms.model";
import { DynamicInputComponent } from "./dynamic-input.component";
import { DynamicSelectComponent } from "./dynamic-select.component";

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
  };
  constructor() { }

  resolve(controlType: keyof DynamicControlsMap) {
    return this.controlComponents[controlType];
  }
}
