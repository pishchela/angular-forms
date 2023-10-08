import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from "@angular/forms";
import { UserInfo } from "../../../core/user-info";
import { BanWordsDirective } from "../validators/ban-words.directive";
import { PasswordShouldMatchDirective } from '../validators/password-should-match.directive';
import { UniqueNicknameDirective } from "../validators/unique-nickname.directive";
import { InputErrorComponent } from "../../../core/input-error/input-error.component";

@Component({
  selector: 'app-template-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BanWordsDirective,
    PasswordShouldMatchDirective,
    UniqueNicknameDirective,
    InputErrorComponent,
  ],
  templateUrl: './template-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './template-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormsPageComponent implements OnInit, AfterViewInit {

  userInfo: UserInfo = {
    city: '',
    email: 'email@email',
    firstName: '',
    fullAddress: '',
    lastName: '',
    nickname: '',
    passport: '',
    postCode: 111,
    yearOfBirth: 2022,
    password: '',
    confirmPassword: ''
  };
  @ViewChild(NgForm)
  formDir!: NgForm;

  private _initialFormValues: unknown = {

  };
  constructor() { }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this._initialFormValues = this.formDir.value;
    });
  }

  get isAdult() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.userInfo.yearOfBirth >= 18;
  }

  get years() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm, event: SubmitEvent): void {
    console.warn('submit string ', form.value);
    console.warn(event);

    // Strategy 1 - Reset form values, validation statuses, making controls untouched, pristine, etc
    // form.resetForm();
    // Strategy 2 - Reset only form control statuses but not values;
    form.resetForm(form.value);
    this._initialFormValues = this.formDir.value;
  }
  onReset(event: Event): void {
    event.preventDefault();
    this.formDir.resetForm(this._initialFormValues);
  }
}
