import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import '../../styles/form.scss';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';
import ToastNotification from '../common/ToggleNotification';
import FormInput from '../common/FormInput';
// import FormInput from '../common/FormInput'; // Adjust path as needed

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [toast, setToast] = React.useState(null);

  return (
    <>
      {toast && (
        <ToastNotification
          key={Date.now()}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
      <div className="!bg-white container">
        <div className='absolute  '>

        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
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
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>


              <h2>Login</h2>

              <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                required
                error={touched.email && errors.email ? errors.email : ''}
              />

              <div className="mt-4">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  required
                  error={touched.password && errors.password ? errors.password : ''}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </>

  );
};

export default Login;
