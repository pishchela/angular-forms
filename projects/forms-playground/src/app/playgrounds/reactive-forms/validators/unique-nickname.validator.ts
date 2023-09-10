import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UniqueNicknameValidator implements AsyncValidator{
  private _error = { uniqueName: { isTaken: true } };
  private _unknownError = { uniqueName: { unknownError: true } };
  constructor(private _http: HttpClient) { }

  validate(control: AbstractControl<string>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this._http.get<unknown[]>(`https://jsonplaceholder.typicode.com/users?username=${control.value}`)
          .pipe(
            map((users) =>
             users.length === 0 ? null : this._error,
            ),
            catchError(() => of(this._unknownError)),
          )
  }
}
