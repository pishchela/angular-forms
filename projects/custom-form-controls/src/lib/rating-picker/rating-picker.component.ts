import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type RatingOptions = 'great' | 'good' | 'neutral' | 'bad' | null;

@Component({
  selector: 'cfc-rating-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-picker.component.html',
  styleUrls: ['./rating-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RatingPickerComponent,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingPickerComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input()
  value: RatingOptions = null;

  @Output()
  change = new EventEmitter<RatingOptions>();

  onChange: (newValue: RatingOptions) => void = () => {};
  onTouch: () => void = () => {};

  @Input()
  disabled: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  writeValue(obj: RatingOptions): void {
    this.value = obj;
    this.cdr.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  @Input()
  @HostBinding('attr.tabIndex')
  tabIndex = 0;


  @HostListener('blur')
  onBlur() {
    this.onTouch();
  }

  ngOnInit(): void {
  }

  setValue(value: RatingOptions) {
    if (!this.disabled) {
      this.value = value;
      this.onChange(this.value);
      this.onTouch();
      this.change.emit(this.value);
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.onChange(changes['value'].currentValue);
    }
  }

}
