import { ChangeDetectorRef, Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from "@angular/forms";
import { catchError, finalize, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Directive({
  selector: '[appUniqueNickname]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      multi: true,
      useExisting: UniqueNicknameDirective,
    }
  ],
})
export class UniqueNicknameDirective implements AsyncValidator {

  private _error = { appUniqueNickname: { isTaken: true } };
  constructor(
    private _http: HttpClient,
    private _cdr: ChangeDetectorRef,
  ) { }

  validate(control: AbstractControl<string>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this._http.get<any[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`)
      .pipe(
        map((users) => {
         return users.length === 0 ? null : this._error;
        }),
        catchError(() => of(this._error)),
        finalize(() => {
          this._cdr.markForCheck();
        })
      )
  }

}
