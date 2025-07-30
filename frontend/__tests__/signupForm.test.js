import { getByLabelText, getByPlaceholderText, getByRole, getByText } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { beforeEach } from 'node:test';

const html = 
`
<form id="register-form">
  <input required type="text" name="firstname" id="firstname-input" placeholder="Firstname">
  <input requiredtype="text" name="surname" id="surname-input" placeholder="Surname">
  <input requiredtype="text" name="username" id="username-input" placeholder="Username">
  <input required type="text" name="password" id="password-input" placeholder="Password">
  <input required type="text" name="repeat-password" id="repeat-password-input" placeholder="Repeat Password">
  <select name="role" id="role" required>
    <option value="">Select Role</option>
    <option value="Student">Student</option>
    <option value="Staff">Staff</option>
  </select>
  <button type="submit">Signup</button>
</form>
`

describe('Signup form', () => {
  beforeEach(() => {
    document.body.innerHTML - html;
  });



  
})