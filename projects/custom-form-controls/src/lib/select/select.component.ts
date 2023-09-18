import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input, OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import { animate, AnimationEvent, state, style, transition, trigger } from "@angular/animations";
import { OptionComponent } from "./option/option.component";
import { SelectionModel } from "@angular/cdk/collections";
import { merge, startWith, Subject, switchMap, takeUntil } from "rxjs";

export type SelectValue<T> = T | null;

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
  ]
})
export class SelectComponent<T> implements AfterContentInit, OnDestroy {

  @Input()
  label = '';

  @Input()
  set value(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
      this.highlightSelectedOptions(value);
    }
  }

  get value() {
    return this.selectionModel.selected[0] || null;
  }

  private selectionModel = new SelectionModel<T>()

  @Output()
  readonly opened = new EventEmitter<void>();

  @Output()
  readonly selectionChanged = new EventEmitter<SelectValue<T>>();

  @Output()
  readonly closed = new EventEmitter<void>();

  @HostListener('click')
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  isOpen = false;
  constructor() { }

  private unsubscribe$ = new Subject<void>();

  ngAfterContentInit(): void {
    this.highlightSelectedOptions(this.value);
    this.selectionModel.changed.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      values.removed.forEach(rv => this.findOptionsByValue(rv)?.deselect());
      values.added.forEach(rv => this.findOptionsByValue(rv)?.highlightAsSelected() );
    });
    this.options.changes.pipe(
      startWith<QueryList<OptionComponent<T>>>(this.options),
      switchMap(options => merge(...options.map(opt => opt.selected))),
      takeUntil(this.unsubscribe$),
    ).subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState == null && this.isOpen) {
      this.opened.emit();
    }
    if (fromState === '*' && toState == 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  handleSelection(option: OptionComponent<T>) {
    if (option.value) {
      this.selectionModel.toggle(option.value);
      this.selectionChanged.emit(this.value);
    }
    this.close();
  }


  private highlightSelectedOptions(value: SelectValue<T>) {
    this.findOptionsByValue(value)?.highlightAsSelected();

  }

  private findOptionsByValue(value: SelectValue<T>): OptionComponent<T> | undefined {
    return this.options && this.options.find((option) => option.value === value);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
