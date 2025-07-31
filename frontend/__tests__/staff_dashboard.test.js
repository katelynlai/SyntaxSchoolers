/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(
  path.resolve(__dirname, '../staff_dashboard/staff_dashboard.html'),
  'utf8'
);

describe('Staff Dashboard Edit Buttons', () => {
    let openModalMockEdit; // openModal is a JavaScript function defined in staff_dashboard.js
    // deals with interactivity on the staff_dashboard.html page

    beforeEach(() => { // Jest runs block of code before every test
        document.documentElement.innerHTML = html.toString();  // Load HTML into the DOM for testing
        // things like button clicks and visibility of elements

        openModalMockEdit = jest.fn(); //creates a mock function         
        global.openModal = openModalMockEdit; // attaches mock function to global window scope   
    });

    test('clicking "Edit Level 1" calls openModal with "edit-words"', () => { // tests Edit Level 1 modal
        const editLevel1 = [...document.querySelectorAll('.dashboard-card')] // uses spread operator to convert to array so find can be used
            .find(card => card.textContent.trim().includes('Edit Level 1')); //find searches for card displaying text

        expect(editLevel1).toBeTruthy(); //asserts that matching element is found

        editLevel1.click(); // simulates clicking dashboard card
        expect(openModalMockEdit).toHaveBeenCalledWith('edit-words'); 
    });

    test('clicking "Edit Level 2" calls openModal with "edit-sentences"', () => { // tests Edit Level 2 modal
    const editLevel2 = [...document.querySelectorAll('.dashboard-card')]
        .find(card => card.textContent.trim().includes('Edit Level 2'));

        expect(editLevel2).toBeTruthy();

        editLevel2.click();
        expect(openModalMockEdit).toHaveBeenCalledWith('edit-sentences');
    });

    test('clicking "Edit Level 3" calls openModal with "edit-sentences"', () => { // tests Edit Level 3 modal
    const editLevel3 = [...document.querySelectorAll('.dashboard-card')]
        .find(card => card.textContent.trim().includes('Edit Level 3'));

        expect(editLevel3).toBeTruthy();

        editLevel3.click();
        expect(openModalMockEdit).toHaveBeenCalledWith('edit-sentences');
    });
})

describe('Staff Dashboard View Buttons', () => {
    let openModalMockView;

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
        openModalMockView = jest.fn();
        global.openModal = openModalMockView;
    });

    test('clicking "Level 1 Word List" calls openModal with "current-words"', () => { // tests Level 1 Word List modal
        const listLevel1 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.trim().includes('Level 1 Word List'));
        expect(listLevel1).toBeTruthy();
        listLevel1.click();
        expect(openModalMockView).toHaveBeenCalledWith('current-words');
    });

    test('clicking "Level 2 Sentence List" calls openModal with "all-sentences"', () => { // tests Level 2 sentence list modal
        const listLevel2 = [...document.querySelectorAll('.dashboard-card')]
            .filter(card => card.textContent.trim().includes('Level 2 Sentence List'))[0]; // First occurence
        expect(listLevel2).toBeTruthy();
        listLevel2.click();
        expect(openModalMockView).toHaveBeenCalledWith('all-sentences');
    });

    test('clicking "Level 3 Sentence List" calls openModal with "all-sentences"', () => { // tests Level 3 sentence list modal
        const listLevel3 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.trim().includes('Level 3 Sentence List'));   
        expect(listLevel3).toBeTruthy();
        listLevel3.click();
        expect(openModalMockView).toHaveBeenCalledWith('all-sentences')
    });

})