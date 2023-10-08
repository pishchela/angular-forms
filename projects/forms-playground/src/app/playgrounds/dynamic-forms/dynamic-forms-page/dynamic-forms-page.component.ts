import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DynamicFormConfig } from "../dynamic-forms.model";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { DynamicControlResolver } from "../dynamic-controls/dynamic-control-resolver.service";
import { ControlInjectorPipe } from "../dynamic-controls/control-injector.pipe";
import { comparatorFn } from "../dynamic-controls/base-dynamic-control";
import { InputErrorComponent } from "../../../core/input-error/input-error.component";

@Component({
  selector: 'app-dynamic-forms-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlInjectorPipe, InputErrorComponent],
  templateUrl: './dynamic-forms-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    './dynamic-forms-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormsPageComponent implements OnInit {

  form!: FormGroup

  protected comparatorFn = comparatorFn;
  protected formLoadingTrigger = new Subject<'user' | 'company'>();
  protected formConfig$!: Observable<{ form: FormGroup, config: DynamicFormConfig }>;

  constructor(
    private http: HttpClient,
    protected controlResolver: DynamicControlResolver,
  ) { }

  ngOnInit(): void {
    this.formConfig$ = this.formLoadingTrigger.pipe(
      switchMap(config => this.http.get<DynamicFormConfig>(`assets/${config}.form.json`)),
      map((config) => ({
        config,
        form: new FormGroup({}),
      }))
    );

  }
  protected onSubmit(form: FormGroup) {
    console.warn(form.value);
    form.reset();
  }
}
