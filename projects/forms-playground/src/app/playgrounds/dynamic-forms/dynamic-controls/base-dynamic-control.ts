import { Directive, HostBinding, inject, InjectFlags, OnInit, StaticProvider } from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { CONTROL_DATA } from "./control-data.token";
import { CommonModule, KeyValue } from "@angular/common";
import { DynamicControl } from "../dynamic-forms.model";
import { banWords } from "../../reactive-forms/validators/ban-words.validator";
import { DynamicValidatorMessageDirective } from "../../../core/dynamic-validator-message.directive";

export const comparatorFn = (a: KeyValue<string, DynamicControl>, b: KeyValue<string, DynamicControl>): number => a.value.order = b.value.order;

export const sharedDynamicControlDeps = [
  CommonModule, ReactiveFormsModule, DynamicValidatorMessageDirective
];

export const dynamicControlResolver: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, InjectFlags.SkipSelf),
}

@Directive()
export class BaseDynamicControl implements OnInit {
  @HostBinding('class') hostClass = 'form-field';
  control = inject(CONTROL_DATA);

  formControl: AbstractControl = new FormControl(
    this.control.config.value,
    this.resolveValidators(this.control.config),
    );

  private parentGroupDir = inject(ControlContainer);
  ngOnInit() {
    (this.parentGroupDir.control as FormGroup).addControl(this.control.controlKey, this.formControl);
  }

  private resolveValidators({ validators = {}}: DynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(validatorKey => {
      const validatorValue = validators[validatorKey];
      if (validatorKey === 'required') {
        return Validators.required
      }
      if (validatorKey === 'requiredTrue') {
        return Validators.requiredTrue
      }
      if (validatorKey === 'email') {
        return Validators.email
      }
      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      if (validatorKey === 'banWords' && Array.isArray(validatorValue)) {
        return banWords(validatorValue);
      }
      return Validators.nullValidator;
    });
  }
}
