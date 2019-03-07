import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePickerComponent } from './phone-picker.component';

describe('PhonePickerComponent', () => {
  let component: PhonePickerComponent;
  let fixture: ComponentFixture<PhonePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
