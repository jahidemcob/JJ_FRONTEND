/// <reference types="cypress" />

describe('Login de usuario - Admin', () => {
  it('debe redirigir al dashboard de admin', () => {

    cy.visit('http://localhost:4200/login');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('123456');

    cy.get('button[type="submit"]').click();
    cy.contains('Administrador').should('be.visible');

  });
});