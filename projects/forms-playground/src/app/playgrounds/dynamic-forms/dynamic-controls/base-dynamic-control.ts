import { Directive, HostBinding, inject, InjectFlags, StaticProvider } from "@angular/core";
import { ControlContainer } from "@angular/forms";
import { CONTROL_DATA } from "./control-data.token";

export const dynamicControlResolver: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, InjectFlags.SkipSelf),
}

@Directive()
export class BaseDynamicControl {
  @HostBinding('class') hostClass = 'form-field';
  control = inject(CONTROL_DATA);
}
