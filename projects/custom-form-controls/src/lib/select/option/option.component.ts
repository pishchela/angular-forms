import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'cfc-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent<T> implements OnInit {

  @Input()
  value: T | null = null;

  @Input()
  disabledReason = '';

  @Input()
  @HostBinding('class.disabled')
  disabled: boolean = false;

  @Output()
  selected = new EventEmitter<OptionComponent<T>>();

  @HostListener('click')
  protected select() {
    if (!this.disabled) {
      this.isSelected = true;
      this.selected.emit(this);
    }
  }

  @HostBinding('class.selected')
  protected isSelected = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  highlightAsSelected() {
    this.isSelected = true;
    this.cd.markForCheck();
  }

  public deselect() {
    this.isSelected = false;
    this.cd.markForCheck();
  }

}
