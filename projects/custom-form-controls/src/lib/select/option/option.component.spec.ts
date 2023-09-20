import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionComponent } from './option.component';

describe('OptionComponent', () => {
  let component: OptionComponent<any>;
  let fixture: ComponentFixture<OptionComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
