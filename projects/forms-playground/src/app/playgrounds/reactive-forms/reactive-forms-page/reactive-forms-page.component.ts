import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { Observable, tap } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';

interface Address {
  fullAddress: FormControl<string>,
  city?: FormControl<string>,
  postCode?: FormControl<number>,
}

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './reactive-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveFormsPageComponent implements OnInit {

  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  years = this.getYears;
  skills$!: Observable<string[]>;

  public form = this.fb.group({
    firstName: ['Dmytro', [Validators.required, Validators.minLength(2)]],
    lastName: ['Mezhenskyi', [Validators.required, Validators.minLength(2)]],
    nickname: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern(/^[\w.]+$/)],
    ],
    email: ['dmytro@decodedfrontend.io', [Validators.email]],
    yearOfBirth: this.fb.nonNullable.control(
      this.years[this.years.length - 1],
      [Validators.required]),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
    address: this.fb.nonNullable.group({
      fullAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postCode: ['', [Validators.required]],
      // city: new FormControl('', { nonNullable: true }),
      // postCode: new FormControl(0, { nonNullable: true }),
    }),
    phones: this.fb.array([
      this._phoneFormGroup,
    ]),
    // skills: new FormGroup<{ [key: string]: FormControl<boolean> }>({}),
    skills: new FormRecord<FormControl<boolean>>({}),
    // since Angular 14.2 -> this.fb.record<boolean>
  });


  get getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  constructor(private userSkills: UserSkillsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills()
      .pipe(
        tap((skills) => this._buildSkillsControls (skills)),
      );

    // this.form.controls.address.addControl('city', new FormControl())
    // this.form.controls.address.addControl('postCode', new FormControl())
  }

  public onSubmit(e: Event): void {
    // this.form.controls.firstName.reset();
    console.warn(this.form.value);
  }

  public addPhone(): void {
    this.form.controls.phones.insert(0, this._phoneFormGroup)
  }

  public removePhone(index: number): void {
    this.form.controls.phones.removeAt(index);
  }

  private get _phoneFormGroup(): FormGroup {
    return this.fb.group({
      label: this.fb.nonNullable.control(this.phoneLabels[0]),
      phone: '',
    });
  }

  private _buildSkillsControls(skills: string[]): void {
    skills.forEach((skill) => {
      this.form.controls.skills.addControl(skill, new FormControl(false, { nonNullable: true }))
    });
  }


}
