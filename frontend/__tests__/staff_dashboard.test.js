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

    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();  // Load HTML into the DOM

        openModalMockEdit = jest.fn();
        global.openModal = openModalMockEdit;    
    });

    test('clicking "Edit Level 1" calls openModal with "edit-words"', () => {
        const editLevel1 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.trim().includes('Edit Level 1'));

        expect(editLevel1).toBeTruthy();

        editLevel1.click();
        expect(openModalMockEdit).toHaveBeenCalledWith('edit-words');
    });

    test('clicking "Edit Level 2" calls openModal with "edit-sentences"', () => {
    const editLevel2 = [...document.querySelectorAll('.dashboard-card')]
        .find(card => card.textContent.trim().includes('Edit Level 2'));

        expect(editLevel2).toBeTruthy();

        editLevel2.click();
        expect(openModalMockEdit).toHaveBeenCalledWith('edit-sentences');
    });

    test('clicking "Edit Level 3" calls openModal with "edit-sentences"', () => {
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

    test('clicking "Level 1 Word List" calls openModal with "current-words"', () => {
        const listLevel1 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.trim().includes('Level 1 Word List'));
        expect(listLevel1).toBeTruthy();
        listLevel1.click();
        expect(openModalMockView).toHaveBeenCalledWith('current-words');
    });

    test('clicking "Level 2 Sentence List" calls openModal with "all-sentences"', () => {
        const listLevel2 = [...document.querySelectorAll('.dashboard-card')]
            .filter(card => card.textContent.trim().includes('Level 2 Sentence List'))[0]; // First occurence
        expect(listLevel2).toBeTruthy();
        listLevel2.click();
        expect(openModalMockView).toHaveBeenCalledWith('all-sentences');
    });

    test('clicking "Level 3 Sentence List" calls openModal with "all-sentences"', () => {
        const listLevel3 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.trim().includes('Level 3 Sentence List'));   // Second occurence
        expect(listLevel3).toBeTruthy();
        listLevel3.click();
        expect(openModalMockView).toHaveBeenCalledWith('all-sentences')
    });

})