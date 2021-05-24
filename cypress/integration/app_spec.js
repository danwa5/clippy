describe('Transform', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.get('#delimiter').should('have.value', 'comma')
    cy.get('#removeBlanks').should('be.checked')
    cy.get('#removeDuplicates').should('be.checked')
    cy.get('#encloseInQuotes').should('not.be.checked')
  })

  it('transforms single-value list', () => {
    cy.get('#input').type('123')
    cy.get('.inputItemCount').should('have.text', '1')

    cy.contains('Transform').click()

    cy.get('#results').should('have.value', '123')
    cy.get('#duplicates').should('have.value', '')
  })

  it('tranforms with "Remove blanks" option only', () => {
    cy.get('#input').type('\n\n  \n123\n\n')
    cy.get('.inputItemCount').should('have.text', '6')

    cy.get('#removeDuplicates').uncheck
    cy.contains('Transform').click()

    cy.get('#results').should('have.value', '123')
    cy.get('#duplicates').should('have.value', '')
  })

  it('transforms with "Remove duplicates" option only', () => {
    cy.get('#input').type('123\n456\n123')
    cy.get('.inputItemCount').should('have.text', '3')

    cy.get('#removeBlanks').uncheck
    cy.contains('Transform').click()

    cy.get('#results').should('have.value', '123,456')
    cy.get('#duplicates').should('have.value', '123')
  })

  it('transforms with "Enclose in quotes" option only', () => {
    cy.get('#input').type('123')
    cy.get('.inputItemCount').should('have.text', '1')

    cy.get('#removeDuplicates').uncheck
    cy.get('#removeBlanks').uncheck
    cy.get('#encloseInQuotes').check({ force: true })
    cy.contains('Transform').click()

    cy.get('#results').should('have.value', "'123'")
    cy.get('#duplicates').should('have.value', "''")
  })

  it('transforms with all options and semicolon delimiter', () => {
    cy.get('#input').type('\n  \n123\n456\n123\n789\n')
    cy.get('.inputItemCount').should('have.text', '7')

    cy.get('#delimiter').select('semicolon')
    cy.get('#encloseInQuotes').check({ force: true })
    cy.contains('Transform').click()

    cy.get('#results').should('have.value', "'123';'456';'789'")
    cy.get('#duplicates').should('have.value', "'123'")
  })
})

describe('Reset', () => {
  beforeEach(() => {
    cy.visit('/')

    cy.get('#input').type('abc')

    cy.contains('Transform').click()

    cy.get('#results').should('have.value', 'abc')
  })

  it('clears all values', () => {
    cy.contains('Reset').click()

    cy.get('#input').should('have.value', '')
    cy.get('#results').should('have.value', '')
    cy.get('#duplicates').should('have.value', '')
    cy.get('.inputItemCount').should('have.text', '0')
  })
})
