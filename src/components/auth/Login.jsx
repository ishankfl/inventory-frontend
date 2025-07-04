import React, { useState } from 'react';
import '../../styles/form.scss';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await schema.validate(values, { abortEarly: false });
      const response = await loginApi(values.email, values.password);
      if (response.status === 200) {
        setToken(response.data.token);
        navigate('/');
      } else {
        setSubmitError('Login failed. Please try again.');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        setSubmitError('Invalid email or password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container ">
      
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {submitError && <div className="error-msg">{submitError}</div>}

        <div className="field-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="field-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="error-msg">{errors.password}</p>}
        </div>
<br></br>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
