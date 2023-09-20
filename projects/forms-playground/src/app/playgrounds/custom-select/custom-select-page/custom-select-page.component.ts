import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from "custom-form-controls";
import { User } from "../../../core/user";
import { SelectValue } from "../../../../../../custom-form-controls/src/lib/select/select.component";

@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  imports: [CommonModule, SelectModule],
  templateUrl: './custom-select-page.component.html',
  styleUrls: [
    '../../common-page.scss',
    './custom-select-page.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomSelectPageComponent implements OnInit {

  selectedValue: SelectValue<User> = [
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
  ];
  users: User[] = [
    new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
    new User(2, 'Niels Bohr', 'niels', 'Denmark'),
    new User(3, 'Marie Curie', 'marie', 'Poland/French'),
    new User(4, 'Isaac Newton', 'isaac', 'United Kingdom', true)
  ];
  constructor(private cd: ChangeDetectorRef) {
    setTimeout(() => {
      this.selectedValue = new User(3, 'Marie Curie', 'marie', 'Poland/French');
      this.users = [
        new User(1, 'Albert Einstein', 'albert', 'Germany/USA'),
        new User(2, 'Niels Bohr', 'niels', 'Denmark'),
        new User(3, 'Marie Curie', 'marie', 'Poland/French'),
      ];
      this.cd.markForCheck();
    }, 3000);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.selectedValue = new User(3, 'Marie Curie', 'marie', 'Poland/French');
      this.cd.markForCheck();
    }, 500);
  }


  displayWithFn(user: User) {
    return user.name;
  }

  compareWithFn(userLhs: User | null, userRhs: User | null) {
    return userLhs?.id === userRhs?.id;
  }

  onSelectionChanged(value: unknown  | null) {
    console.log('Selected value: ', value);
  }

}
