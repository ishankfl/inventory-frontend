import React, { useState } from 'react';
import '../../styles/form.scss';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ToastNotification from '../common/ToggleNotification'; // remove space at end of path

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
  const [toast, setToast] = useState(null); // <-- control toast here

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
      console.log(response);
      if (response.status === 200) {
        setToken(response.data.token);
        setToast({
          type: 'success',
          message: 'Login successful!',
          duration: 4000,
        });
        setTimeout(() => {
          navigate('/');
        }, 4000); // match the toast duration
      // }

      // setTimeout(() => {

      // }, 2000);
      // navigate('/');
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
  <div className="">
    {toast && (
      <ToastNotification
        key={Date.now()}
        type={toast.type}
        message={toast.message}
        duration={toast.duration}
        onClose={() => setToast(null)}
      />
    )}

    <div className="bg-white container max-w-md w-full p-6 rounded shadow">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        {submitError && <div className="error-msg mb-4">{submitError}</div>}

        <div className="field-group mb-4">
          <label htmlFor="email" className="block font-medium mb-1">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="error-msg text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="field-group mb-6">
          <label htmlFor="password" className="block font-medium mb-1">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="error-msg text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  </div>
);
};

export default Login;
