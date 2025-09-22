import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent implements OnInit{
  registrationForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]], 
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if(this.registrationForm.valid){
      console.log(this.registrationForm.value);
    }
  }

  get f() {
    return this.registrationForm.controls;
  }
}
