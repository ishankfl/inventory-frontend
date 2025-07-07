import React, { useState } from 'react';
import '../../styles/form.scss';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ToastNotification from '../common/ToggleNotification';

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
  const [toast, setToast] = useState(null);

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
        setToast({
          type: 'success',
          message: 'Login successful!',
          duration: 4000,
        });
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        setSubmitError('Login failed. Please try again.');
        setToast({
          type: 'error',
          message: 'Login failed!',
          duration: 3000,
        });
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
        setToast({
          type: 'error',
          message: 'Invalid email or password.',
          duration: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="!bg-white container">
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {submitError && (
          <label className="error-msg" style={{ color: 'red' }}>
            {submitError}
          </label>
        )}

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-msg" style={{ color: 'red' }}>
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
