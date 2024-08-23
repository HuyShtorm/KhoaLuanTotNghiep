import React from 'react';
import '../css/App.css';

const RegisterForm = () => {
  return (
    <div>
      <form className="Register-form">
        <h2>Register</h2>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;