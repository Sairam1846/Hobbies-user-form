import { Component,OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hobbies-form',
  templateUrl: './hobbies-form.component.html',
  styleUrls: ['./hobbies-form.component.css'],
  providers: [DatePipe]
})
export class HobbiesFormComponent implements OnInit{

  userForm!: FormGroup;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private datePipe: DatePipe) { }
  ngOnInit() {

    // Initialize the form with form controls and validation
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }],
      hobbies: this.fb.array([], Validators.required)
    });


    // Subscribe to changes in the dateOfBirth field to update age automatically
    this.userForm.get('dateOfBirth')?.valueChanges.subscribe(date => {
      this.updateAge(date);
    });
  }


  // Getter for hobbies form array
  get hobbies() {
    return this.userForm.get('hobbies') as FormArray;
  }


  // Method to add a new hobby input field
  addHobby() {
    this.hobbies.push(this.fb.control(''));
  }


  // Method to remove a hobby input field by index
  removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }


  // Method to update the age field based on the date of birth
    updateAge(date: string) {
      if (date) {
        const age = this.calculateAge(date);
        this.userForm.get('age')?.setValue(age);
      } else {
        this.userForm.get('age')?.setValue('');
      }
    }


  // Helper method to calculate age from the date of birth
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


  // Method to handle form submission
  onSave() {

    const hobbiesArray = this.hobbies.controls;
    let hasEmptyHobby = false;


    // Check if any hobby input field is empty
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



     // If form is valid, print the form values
    if (this.userForm.valid) {
      this.snackBar.open('Form saved successfully!', 'Close', {
        duration: 3000,
      });


    const formData = this.userForm.getRawValue();
    formData.dateOfBirth = this.datePipe.transform(formData.dateOfBirth, 'dd-MM-yyyy');
    console.log(formData);
    } else {
      this.snackBar.open('Form is invalid. Please correct the errors and try again.', 'Close', {
        duration: 3000,
      });
      console.log('Form is invalid');
    }
  }
}
