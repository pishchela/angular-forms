import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, FormGroupDirective,
  FormRecord,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { bufferCount, delay, filter, Observable, of, startWith, Subscription, tap } from 'rxjs';
import { UserSkillsService } from '../../../core/user-skills.service';
import { banWords } from "../validators/ban-words.validator";
import { passwordShouldMatch } from "../validators/password-should-match.validator";
import { UniqueNicknameValidator } from "../validators/unique-nickname.validator";
import { DynamicValidatorMessageDirective } from "../../../core/dynamic-validator-message.directive";
import { ErrorStateMatcher, OnTouchedStateMatcher } from "../../../core/input-error/error-state-matcher.service";
import { ValidatorMessageContainer } from "../../../core/input-error/validator-message-container.directive";

interface Address {
  fullAddress: FormControl<string>,
  city?: FormControl<string>,
  postCode?: FormControl<number>,
}

@Component({
  selector: 'app-reactive-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicValidatorMessageDirective,
    ValidatorMessageContainer,
  ],
  templateUrl: './reactive-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    '../../common-form.scss',
    './reactive-forms-page.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [
  //   {
  //     provide: ErrorStateMatcher,
  //     useClass: OnTouchedStateMatcher,
  //   }
  // ]
})
export class ReactiveFormsPageComponent implements OnInit, OnDestroy {

  phoneLabels = ['Main', 'Mobile', 'Work', 'Home'];
  years = this.getYears;
  skills$!: Observable<string[]>;

  showErrorStrategy = new OnTouchedStateMatcher();

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective;

  public form = this.fb.group({
    firstName: ['Dmytro', [Validators.required, Validators.minLength(2), banWords(['test', 'dummy'])]],
    lastName: ['Mezhenskyi', [Validators.required, Validators.minLength(2)]],
    nickname: ['', {
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[\w.]+$/),
        banWords(['test', 'abstract'])
      ],
      asyncValidators: [
        this.uniqueNicknameValidator.validate.bind(this.uniqueNicknameValidator),
      ],
      updateOn: 'blur',
    },
    ],
    email: ['dmytro@decodedfrontend.io', [Validators.email]],
    yearOfBirth: this.fb.nonNullable.control(
      this.years[this.years.length - 1],
      [Validators.required]),
    passport: ['', [Validators.pattern(/^[A-Z]{2}[0-9]{6}$/)]],
    // new FormGroup<Address>({})
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
    password: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ''
    }, {
      validators: passwordShouldMatch
    })
  });

  private ageValidators!: Subscription;
  private formPendingState!: Subscription;

  private initialFormValues: any;


  get getYears() {
    const now = new Date().getUTCFullYear();
    return Array(now - (now - 40)).fill('').map((_, idx) => now - idx);
  }

  constructor(
    private userSkills: UserSkillsService,
    private fb: FormBuilder,
    private uniqueNicknameValidator: UniqueNicknameValidator,
    private cdr: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {
    this.skills$ = this.userSkills.getSkills()
      .pipe(
        tap((skills) => this._buildSkillsControls (skills)),
        tap(() => this.initialFormValues = this.form.value),
      );

    // this.form.controls.address.addControl('city', new FormControl())
    // this.form.controls.address.addControl('postCode', new FormControl())
    this.ageValidators = this.form.controls.yearOfBirth.valueChanges.pipe(
      tap(() => this.form.controls.passport.markAsDirty()),
      startWith(this.form.controls.yearOfBirth.value)
    ).subscribe(
      yearOfBirth => {
        this.isAdult(yearOfBirth)
          ? this.form.controls.passport.addValidators(Validators.required)
          : this.form.controls.passport.removeValidators(Validators.required);
        this.form.controls.passport.updateValueAndValidity();
      }
    );

    this.formPendingState = this.form.controls.nickname.statusChanges
      .pipe(
        bufferCount(2, 1),
        filter(([prevState]) => prevState === 'PENDING'),
      )
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.ageValidators.unsubscribe();
    this.formPendingState.unsubscribe();
  }

  public onSubmit(e: Event): void {
    console.warn(this.form.value);
    this.initialFormValues = this.form.value;
    // this.form.reset();
    // formDir reset reseting ng-submitted status from form
    this.formDir.resetForm(this.form.value);
    // this.form.controls.firstName.reset();
  }

  public onReset(e: Event): void {
    e.preventDefault();
    this.formDir.resetForm(this.initialFormValues);
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

  private isAdult(yearOfBirth: number): boolean {
    const currentYear = new Date().getFullYear();
    return currentYear - yearOfBirth >= 18;
  }

}
