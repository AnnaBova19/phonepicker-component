import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  phonePickerFormGroup = new FormGroup({
		phoneNumber: new FormControl('', [Validators.required])
	});

  constructor() {}

  ngOnInit () {
  }

  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }

    console.log(f.value.phoneNumber);
  }
}
