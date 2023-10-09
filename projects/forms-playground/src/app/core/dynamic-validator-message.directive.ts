import {
  ComponentRef,
  Directive, ElementRef,
  inject, Input,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import { ControlContainer, FormGroupDirective, NgControl, NgForm, NgModel } from "@angular/forms";
import { EMPTY, fromEvent, iif, merge, skip, startWith, Subscription } from "rxjs";
import { InputErrorComponent } from "./input-error/input-error.component";
import { ErrorStateMatcher } from "./input-error/error-state-matcher.service";

@Directive({
  selector: '[ngModel],[formControl],[formControlName]',
  standalone: true
})
export class DynamicValidatorMessageDirective implements OnInit, OnDestroy {
  ngControl = inject(NgControl, { self: true });
  elementRef = inject(ElementRef);
  get form() {
    return this.parentContainer?.formDirective as NgForm | FormGroupDirective | null;
  }
  @Input()
  errorStateMatcher = inject(ErrorStateMatcher);

  private vcr = inject(ViewContainerRef)
  private componentRef: ComponentRef<InputErrorComponent> | null = null;
  private errorMessageTrigger: Subscription | undefined;
  private parentContainer = inject(ControlContainer, { optional: true });
  ngOnInit() {
    if (!this.ngControl.control) throw Error(`No control model for ${this.ngControl.name} control...`);
    this.errorMessageTrigger = merge(
      this.ngControl?.control?.statusChanges,
      fromEvent(this.elementRef.nativeElement, 'blur'),
      iif(() => !!this.form, this.form!.ngSubmit, EMPTY),
      ).pipe(
        startWith(this.ngControl?.control?.status),
        skip(this.ngControl instanceof NgModel ? 1 : 0),
      )
      .subscribe(() => {
        if (this.errorStateMatcher.isErrorVisible(this.ngControl.control, this.form)) {
          if (!this.componentRef) {
            this.componentRef = this.vcr.createComponent(InputErrorComponent);
            this.componentRef.changeDetectorRef.markForCheck();
          }
          this.componentRef.setInput('errors', this.ngControl.errors);
        } else {
          this.componentRef?.destroy();
          this.componentRef = null;
        }
      });
  }

  ngOnDestroy() {
    this.errorMessageTrigger?.unsubscribe();
  }
}
