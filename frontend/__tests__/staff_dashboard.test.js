/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(
  path.resolve(__dirname, '../staff_dashboard/staff_dashboard.html'),
  'utf8'
);

describe('Staff Dashboard Edit Buttons', () => {
    let openModalMock;

    beforeEach(() => {
    document.documentElement.innerHTML = html.toString();  // Load HTML into the DOM

    })
})