import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hobbies-form',
  templateUrl: './hobbies-form.component.html',
  styleUrls: ['./hobbies-form.component.css']
})
export class HobbiesFormComponent implements OnInit{

  userForm!: FormGroup;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) { }
  ngOnInit() {

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      hobbies: this.fb.array([], Validators.required)
    });
    this.userForm.get('dateOfBirth')?.valueChanges.subscribe(date => {
      this.updateAge(date);
    });
  }

  get hobbies() {
    return this.userForm.get('hobbies') as FormArray;
  }

  addHobby() {
    this.hobbies.push(this.fb.control(''));
  }

  removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }

  updateAge(date: string) {
    if (date) {
      const age = this.calculateAge(date);
      this.userForm.get('age')?.setValue(age);
    } else {
      this.userForm.get('age')?.setValue('');
    }
  }

  calculateAge(date: string): number {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onSave() {

    const hobbiesArray = this.hobbies.controls;
    let hasEmptyHobby = false;

    for (const hobbyControl of hobbiesArray) {
      if (!hobbyControl.value) {
        hobbyControl.setErrors({ required: true });
        hasEmptyHobby = true;
      }
    }

    if (hasEmptyHobby) {
      this.snackBar.open('Please fill out all hobby fields.', 'Close', {
        duration: 3000,
      });
      console.log('Please fill out all hobby fields');
      return;
    }

    if (this.userForm.valid) {
      this.snackBar.open('Form saved successfully!', 'Close', {
        duration: 3000,
      });
      console.log(this.userForm.getRawValue());
    } else {
      this.snackBar.open('Form is invalid. Please correct the errors and try again.', 'Close', {
        duration: 3000,
      });
      console.log('Form is invalid');
    }
  }
}
