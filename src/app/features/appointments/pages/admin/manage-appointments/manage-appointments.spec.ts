import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAppointments } from './manage-appointments';

describe('ManageAppointments', () => {
  let component: ManageAppointments;
  let fixture: ComponentFixture<ManageAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAppointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
