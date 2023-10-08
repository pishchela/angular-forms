import { InjectionToken } from "@angular/core";

export const ERROR_MESSAGES: { [key: string]: string } = {
  required: `This field is required`,
  requiredTrue: `This field is required`,
  email: `It should be a valid email`,
  minlength: `The value lenth is too short`,
  banWords: `This word isn't allowed`,
  appBanWords: `This word isn't allowed`,
  appPasswordShouldMatch: `Password should match`,
  passwordShouldMatch: `Password should match`,
  pattern: `Wrong format`,
  appUniqueNickname: `Nickname is taken`,
  uniqueName: `Nickname is taken`,
}

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES,
})
