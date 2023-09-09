import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule } from "@angular/forms";
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

  public form = new FormGroup({
    firstName: new FormControl<string>('Dmytro', { nonNullable: true }),
    lastName: new FormControl('Mezhenskyi'),
    nickname: new FormControl(''),
    email: new FormControl('dmytro@decodedfrontend.io'),
    yearOfBirth: new FormControl(this.years[this.years.length - 1], { nonNullable: true }),
    passport: new FormControl(''),
    address: new FormGroup<Address>({
      fullAddress: new FormControl('', { nonNullable: true }),
      // city: new FormControl('', { nonNullable: true }),
      // postCode: new FormControl(0, { nonNullable: true }),
    }),
    phones: new FormArray([
      this._phoneFormGroup,
    ]),
    // skills: new FormGroup<{ [key: string]: FormControl<boolean> }>({}),
    skills: new FormRecord<FormControl<boolean>>({}),
  });


  get getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  constructor(private userSkills: UserSkillsService) { }

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills()
      .pipe(
        tap((skills) => this._buildSkillsControls (skills)),
      );

    this.form.controls.address.addControl('city', new FormControl())
    this.form.controls.address.addControl('postCode', new FormControl())
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
    return new FormGroup({
      label: new FormControl(this.phoneLabels[0], { nonNullable: true }),
      phone: new FormControl(''),
    });
  }

  private _buildSkillsControls(skills: string[]): void {
    skills.forEach((skill) => {
      this.form.controls.skills.addControl(skill, new FormControl(false, { nonNullable: true }))
    });
  }


}
