import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterIncome } from './register-income';

describe('RegisterIncome', () => {
  let component: RegisterIncome;
  let fixture: ComponentFixture<RegisterIncome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterIncome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterIncome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
