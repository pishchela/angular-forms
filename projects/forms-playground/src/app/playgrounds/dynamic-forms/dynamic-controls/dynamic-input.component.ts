import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      dynamic-input works!
    </p>
  `,
  styles: [
  ]
})
export class DynamicInputComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
