import {
  AfterContentInit, Attribute, ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ContentChildren, ElementRef,
  EventEmitter, HostBinding,
  HostListener,
  Input, OnChanges, OnDestroy,
  OnInit,
  Output,
  QueryList, SimpleChanges, ViewChild
} from '@angular/core';
import { animate, AnimationEvent, state, style, transition, trigger } from "@angular/animations";
import { OptionComponent } from "./option/option.component";
import { SelectionModel } from "@angular/cdk/collections";
import { merge, startWith, Subject, switchMap, takeUntil, tap } from "rxjs";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export type SelectValue<T> = T | T[] | null;

@Component({
  selector: 'cfc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0, })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1, })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      // void => *   -    :enter
      transition(':leave', [animate('420ms cubic-bezier(0.88, -0.7, 0.86, 0.85)')]),
      // * => void   -    :leave
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent<T> implements OnChanges, AfterContentInit, OnDestroy, ControlValueAccessor {

  @Input()
  label = '';

  @Input()
  searchable = false;

  @Input()
  @HostBinding('class.disabled')
  disabled = false;

  @Input()
  displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: ((v1: T | null, v2: T | null) => boolean) = (v1, v2) => v1 === v2;


  @Input()
  set value(value: SelectValue<T>) {
    this.setupValue(value);
    this.onChange(this.value);
  }

  get value() {
    if (this.selectionModel.isEmpty()) {
      return null;
    }
    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }
    return this.selectionModel.selected[0];
  }

  private selectionModel = new SelectionModel<T>(coerceBooleanProperty(this.multiple))

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<SelectValue<T>>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @Output()
  readonly searchChanged = new EventEmitter<string>();

  @HostListener('blur')
  markAsTouched() {
    if (!this.disabled && !this.isOpen) {
      this.onTouched();
    }
  }

  @HostListener('click')
  open() {
    if (this.disabled) return;
    this.isOpen = true;
    if (this.searchable) {
      requestAnimationFrame(() => {
        this.searchInputEl.nativeElement.focus();
      })
    }
    this.cdr.markForCheck();
  }

  close() {
    this.isOpen = false;
    this.onTouched();
    this.cdr.markForCheck();
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  @ViewChild('input')
  searchInputEl!: ElementRef<HTMLInputElement>

  @HostBinding('class.select-panel-open')
  isOpen = false;

  @HostBinding('attr.tabIndex')
  @Input()
  tabIndex = 0;

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if (Array.isArray(this.value)) {
        return this.value.map(this.displayWith)
      }
      return this.displayWith(this.value)
    }
    return this.value;
  }

  protected onChange: (newValue: SelectValue<T>) => void = () => {};
  protected onTouched: () => void = () => {};

  private unsubscribe$ = new Subject<void>();
  private optionMap = new Map<T | null, OptionComponent<T>>();

  constructor(
    @Attribute('multiple') private multiple: string,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['compareWith']) {
      /// ????
      // this.selectionModel['compareWith'] = changes['compareWith'].currentValue;
      this.highlightSelectedOptions();
    }
   }

  clearSelection(e: Event) {
    e?.stopPropagation();
    if (this.disabled) return;
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
    this.onChange(this.value);
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    this.selectionModel.changed.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      values.removed.forEach(rv => this.optionMap.get(rv)?.deselect());
      values.added.forEach(av => this.optionMap.get(av)?.highlightAsSelected());
    });
    this.options.changes.pipe(
      startWith<QueryList<OptionComponent<T>>>(this.options),
      tap(() => this.refreshOptionsMap()),
      tap(() => queueMicrotask(() => this.highlightSelectedOptions())),
      switchMap(options => merge(...options.map(opt => opt.selected))),
      takeUntil(this.unsubscribe$),
    ).subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  protected onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState == null && this.isOpen) {
      this.opened.emit();
    }
    if (fromState === '*' && toState == 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  protected onHandleInput(e: Event) {
    this.searchChanged.emit((e.target as HTMLInputElement).value);
  }

  handleSelection(option: OptionComponent<T>) {
    if (this.disabled) {
      return;
    }
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
      this.onChange(this.value);
    }
    if (!this.selectionModel.isMultipleSelection()) {
      this.close();
    }
  }

  private refreshOptionsMap() {
    this.optionMap.clear();
    this.options.forEach(o => this.optionMap.set(o.value, o));
  }

  private highlightSelectedOptions() {
    const valuesWithUpdatedReferences = this.selectionModel.selected.map(value => {
      const correspondingOption = this.findOptionsByValue(value);
      return correspondingOption ? correspondingOption.value! : value;
    });
    this.selectionModel.clear();
    this.selectionModel.select(...valuesWithUpdatedReferences);

  }

  private setupValue(value: T[] | T | null) {
    this.selectionModel.clear();
    if (value) {
      if (Array.isArray(value)) {
        this.selectionModel.select(...value);
      } else {
        this.selectionModel.select(value);
      }
    }
    this.highlightSelectedOptions();
  }

  private findOptionsByValue(value: T | null): OptionComponent<T> | undefined {
    if (this.optionMap.has(value)) {
      return this.optionMap.get(value);
    }
    return this.options && this.options.find((option) => this.compareWith(option.value, value));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  writeValue(obj: SelectValue<T>): void {
    this.setupValue(obj);
    this.cdr.markForCheck();
  }
}
