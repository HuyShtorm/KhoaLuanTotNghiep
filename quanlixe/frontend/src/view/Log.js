import React from 'react';
import '../css/App.css';

const LogForm = () => {
  return (
    <div>
      <form className="Register-form">
        <h2>Đăng Nhập</h2>
        <label>
          Name:
          <input type="text" name="name" />
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

export default LogForm;