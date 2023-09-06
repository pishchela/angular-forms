import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  @Input() year!: number

  @Output() yearChange: EventEmitter<number> = new EventEmitter<number>();


  @HostListener('click')
  onClick(): void {
    this.yearChange.emit(this.year + 1);
  }

}
