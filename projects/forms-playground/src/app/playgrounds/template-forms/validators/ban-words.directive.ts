import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: '[appBanWords]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: BanWordsDirective,
      multi: true,
    }
  ]
})
export class BanWordsDirective implements Validator {

  @Input()
  set appBanWords(value: string | string[]) {
    this._bannedWords = Array.isArray(value) ? value : [value];
    this._onChange();
  }
  private _bannedWords: string[] = [];
  private _onChange: () => void = () => {}

  constructor() { }

  validate(control: AbstractControl<string>): ValidationErrors | null {
    const foundBadWord = this._bannedWords.find((word) => word.toLowerCase() === control.value?.toLowerCase());
    return !foundBadWord
      ? null
      :  { appBanWords: { bannedWords: foundBadWord } };
  }

  registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }
}
