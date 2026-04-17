import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedServices } from './assigned-services';

describe('AssignedServices', () => {
  let component: AssignedServices;
  let fixture: ComponentFixture<AssignedServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedServices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
