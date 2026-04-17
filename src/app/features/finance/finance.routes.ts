import { Routes } from '@angular/router';

import { TransactionList } from './pages/transaction-list/transaction-list';
import { RegisterIncome } from './pages/register-income/register-income';
import { RegisterExpense } from './pages/register-expense/register-expense';

export const FINANCE_ROUTES: Routes = [
  { path: '', component: TransactionList },
  { path: 'RegistarIngreso', component: RegisterIncome },
  { path: 'RegistrarEgreso', component: RegisterExpense } 
];  