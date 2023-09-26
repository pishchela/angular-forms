import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      dynamic-select works!
    </p>
  `,
  styles: [
  ]
})
export class DynamicSelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
