import React, { useState } from 'react';
import '../../styles/form.scss'
import { loginApi } from '../../api/user';
import userEvent from '@testing-library/user-event';
import { setToken } from '../../utils/tokenutils';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('')
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await loginApi(email, password);
    if (response.status === 200) {
      console.log(response);
      setToken(response.data.token)
      console.log("Login successful");
      window.location='/'
      return;

    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Invalid email or password.");
      setError('Invalid email or password.');
    } else {
        
      setError('An unexpected error occurred');

      console.log("An unexpected error occurred:", error.message);
    }
  }
};


  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
                <div>
          <label className='error-msg'>{error}</label>
       
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
