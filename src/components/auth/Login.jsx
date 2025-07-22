import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ArrowRight } from 'lucide-react';
import ToastNotification from '../common/ToggleNotification';
import FormInput from '../common/FormInput';
import { loginApi } from '../../api/user';
import { setToken } from '../../utils/tokenutils';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const loginUser = async (email, password, setToast) => {
  try {
    const response = await loginApi(email, password);

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
  }
};

const LoginSVG = () => (
  <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-blue-300 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
    IMS
  </div>
);

const Login = () => {
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

      <div className="min-h-screen flex items-center justify-center lg:px-4 sm:px-0 lg:py-8 sm:mx-0 ">
        <div className="w-full max-w-6xl bg-white lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left side */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-6 sm:p-12 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center text-white space-y-6 px-4">
              <div className="flex justify-center">
                <LoginSVG />
              </div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                Welcome Back!
              </h2>
              <p className="text-base sm:text-lg opacity-90 max-w-xs mx-auto">
                Secure access to your Inventory Management System
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm opacity-75 max-w-xs mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>Real-time Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="lg:w-1/2 p-6 sm:p-16 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8 px-2 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  Sign In
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Enter your credentials to access your account
                </p>
              </div>

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await loginUser(values.email, values.password, setToast);
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
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email"
                      required
                      error={touched.email && errors.email ? errors.email : ''}
                    />
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
                    <div className="flex items-center justify-between text-sm">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-500 transition-colors duration-200"
                      >
                        Forgot password?
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    <div className="text-center text-sm sm:text-base">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => console.log('Navigate to signup')}
                          className="text-white-600 hover:text-white-500 font-semibold transition-colors duration-200 hover:underline"
                        >
                          Sign up here
                        </button>
                      </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs sm:text-sm">
                      <p className="text-blue-800 font-medium mb-2">Demo Credentials:</p>
                      <p className="text-blue-600">
                        Email: demo@example.com
                        <br />
                        Password: password
                      </p>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
