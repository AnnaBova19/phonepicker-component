import { Component, OnInit, Input, forwardRef } from '@angular/core';

import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { phoneNumberValidator } from '../../phone-number-validator';
import * as lpn from 'google-libphonenumber';

import { SelectItem } from 'primeng/api';

import { CountriesService } from '../../../services/countries/countries.service';

@Component({
  selector: 'app-phone-picker',
  templateUrl: './phone-picker.component.html',
  styleUrls: ['./phone-picker.component.scss'],
  providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PhonePickerComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useValue: phoneNumberValidator,
			multi: true,
		}
	]
})
export class PhonePickerComponent implements OnInit, ControlValueAccessor {

	@Input() value = '';
	@Input() enablePlaceholder = true;
	@Input() enableAutoCountrySelect = false;

	phoneNumber = '';
	phoneUtil = lpn.PhoneNumberUtil.getInstance();
	disabled = false;

  allCountries: SelectItem[];
  selectedCountry: SelectItem;

  onTouched = () => {};
  propagateChange = (_: any) => {};

  constructor(
		private countriesService: CountriesService,
  ) {}

  ngOnInit() {
		this.getCountries();
  }

  async getCountries () {
    await this.countriesService.getCountries()
      .subscribe(result => {
				this.allCountries = result.map(res => {
          return { 
						label: res.name, 
						value: {
							name: res.name.toString(),
							alpha2Code: res.alpha2Code.toString(),
							callingCodes: res.callingCodes || '',
							placeHolder: this.getPhoneNumberPlaceHolder(res.alpha2Code.toUpperCase())
						}
					};
				});
        this.selectedCountry = this.allCountries[0];
      }, err => {
        console.log(err);
      });   
	}
	
	protected getPhoneNumberPlaceHolder(countryCode: string): string {
		try {
			return this.phoneUtil.format(this.phoneUtil.getExampleNumber(countryCode), lpn.PhoneNumberFormat.NATIONAL);
		} catch (e) {
			return e;
		}
	}

  public onPhoneNumberChange(): void {
		this.value = this.phoneNumber;

		let number: lpn.PhoneNumber;
		try {
			number = this.phoneUtil.parse(this.phoneNumber, this.selectedCountry.value.alpha2Code.toUpperCase());
		} catch (e) {
		}

		let countryCode = this.selectedCountry.value.alpha2Code;
		if (this.enableAutoCountrySelect) {
			countryCode = number && number.getCountryCode()
				? this.getCountryIsoCode(number.getCountryCode(), number)
				: this.selectedCountry.value.alpha2Code;
			if (countryCode !== this.selectedCountry.value.alpha2Code) {
				const newCountry = this.allCountries.find(c => c.value.alpha2Code === countryCode);
				if (newCountry) {
					this.selectedCountry = newCountry;
				}
			}
		}
		countryCode = countryCode ? countryCode : this.selectedCountry.value.alpha2Code;

		this.propagateChange({
			number: this.value,
			internationalNumber: number ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL) : '',
			nationalNumber: number ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL) : '',
			countryCode: countryCode.toUpperCase()
		});
  }
  
	public onCountrySelect(event, el): void {
    this.selectedCountry = event;
    
		if (this.phoneNumber.length > 0) {
			this.value = this.phoneNumber;

			let number: lpn.PhoneNumber;
			try {
				number = this.phoneUtil.parse(this.phoneNumber, this.selectedCountry.value.alpha2Code.toUpperCase());
			} catch (e) {
			}

			this.propagateChange({
				number: this.value,
				internationalNumber: number ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.INTERNATIONAL) : '' ,
				nationalNumber: number ? this.phoneUtil.format(number, lpn.PhoneNumberFormat.NATIONAL) : '',
				countryCode: this.selectedCountry.value.alpha2Code.toUpperCase()
			});
    }
    
    window.setTimeout(() => {
      el.focus();
    }, 0);
	}

  public onInputKeyPress(event): void {
		const pattern = /[0-9\+\-\ ]/;
		const inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	writeValue(obj: any): void {
		if (obj) {
			this.phoneNumber = obj;
			setTimeout(() => {
				this.onPhoneNumberChange();
			}, 1);
		}
	}

  registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
  
  private getCountryIsoCode(countryCode: number, number: lpn.PhoneNumber): string | undefined {
		const rawNumber = number.values_['2'].toString();
		const countries = this.allCountries.filter(c => c.value.callingCodes === countryCode.toString());
		const mainCountry = countries.find(c => c.value.callingCodes === undefined);
		const secondaryCountries = countries.filter(c => c.value.callingCodes !== undefined);
		let matchedCountry = mainCountry ? mainCountry.value.alpha2Code : undefined;

		secondaryCountries.forEach(country => {
			country.value.callingCodes.forEach(areaCode => {
				if (rawNumber.startsWith(areaCode)) {
					matchedCountry = country.value.alpha2Code;
				}
			});
		});

		return matchedCountry;
	}
}
