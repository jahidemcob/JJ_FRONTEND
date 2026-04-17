import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStatus } from './appointment-status';

describe('AppointmentStatus', () => {
  let component: AppointmentStatus;
  let fixture: ComponentFixture<AppointmentStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
