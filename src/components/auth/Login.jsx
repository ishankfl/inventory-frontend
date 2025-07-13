import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../../styles/form.scss';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';
import ToastNotification from '../common/ToggleNotification';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await loginApi(values.email, values.password);

        if (response.status === 200) {
          setToken(response.data.token);
          setToast({
            type: 'success',
            message: 'Login successful!',
            duration: 10000,
          });
          setTimeout(() => {
            window.location = '/';
          }, 4000);
        } else {
          setToast({
            type: 'error',
            message: 'Login failed!',
            duration: 3000,
          });
        }
      } catch (error) {
        setToast({
          type: 'error',
          message: 'Invalid email or password.',
          duration: 3000,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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

      <form onSubmit={formik.handleSubmit}>
        <h2>Login</h2>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error-msg" style={{ color: 'red' }}>
              {formik.errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="error-msg" style={{ color: 'red' }}>
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="text-white"
        >
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
