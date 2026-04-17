import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterExpense } from './register-expense';

describe('RegisterExpense', () => {
  let component: RegisterExpense;
  let fixture: ComponentFixture<RegisterExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
