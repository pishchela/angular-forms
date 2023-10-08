import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, KeyValue } from '@angular/common';
import { ValidationErrors } from "@angular/forms";
import { VALIDATION_ERROR_MESSAGES } from "./validation-error-messages.token";
import { ErrorMessagePipe } from "../error-message.pipe";

@Component({
  selector: 'app-input-error',
  standalone: true,
  imports: [CommonModule, ErrorMessagePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let error of errors | keyvalue; trackBy: trackByFn" class="input-error">
      {{ error.key | errorMessage: error.value }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class InputErrorComponent implements OnInit{
  @Input()
  errors?: ValidationErrors | null = null;

  protected errorsMap = inject(VALIDATION_ERROR_MESSAGES);

  ngOnInit() {
    console.warn(this.errorsMap);
  }

  trackByFn(index: number, item: KeyValue<string, any>) {
    return item.key;
  }
}
