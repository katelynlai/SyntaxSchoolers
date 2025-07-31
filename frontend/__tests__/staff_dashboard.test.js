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
    let openModalMock; // openModal is a JavaScript function defined in staff_dashboard.js
    // deals with interactivity on the staff_dashboard.html page

    beforeEach(() => {
    document.documentElement.innerHTML = html.toString();  // Load HTML into the DOM

    openModalMock = jest.fn();
    global.openModal = openModalMock;    
    });

    test('clicking "Edit Level 2" calls openModal with "edit-sentences"', () => {
        const editLevel2 = [...document.querySelectorAll('.dashboard-card')]
            .find(card => card.textContent.includes('Edit Level 2'));

        expect(editLevel2).toBeTruthy();

        editLevel2.click();
        expect(openModalMock).toHaveBeenCalledWith('edit-sentences');
    });

    test('clicking "Edit Level 3" calls openModal with "edit-sentences"', () => {
    const editLevel3 = [...document.querySelectorAll('.dashboard-card')]
        .find(card => card.textContent.includes('Edit Level 3'));

        expect(editLevel3).toBeTruthy();

        editLevel3.click();
        expect(openModalMock).toHaveBeenCalledWith('edit-sentences');
    });

    test('clicking "Level 3 Sentence List" calls openModal with "all-sentences"', () => {
    const level3List = [...document.querySelectorAll('.dashboard-card')]
        .find(card => card.textContent.includes('Level 3 Sentence List'));

        expect(level3List).toBeTruthy();

        level3List.click();
        expect(openModalMock).toHaveBeenCalledWith('all-sentences');
    })
})