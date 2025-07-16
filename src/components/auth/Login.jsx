import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
  <div className="w-64 h-64 bg-blue-300 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
    IMS
  </div>
);

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row ">
          {/* Left side */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center text-white space-y-6">
              <div className="flex justify-center">{<LoginSVG />}</div>
              <h2 className="text-3xl font-bold">Welcome Back!</h2>
              <p className="text-lg opacity-90">Secure access to your Inventory Management System</p>
              <div className="flex items-center justify-center gap-4 text-sm opacity-75">
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
          <div className="lg:w-1/2 p-8 lg:p-16 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                <p className="text-gray-600">Enter your credentials to access your account</p>
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
                    <div className="flex items-center justify-between">
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200">
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

                    <div className="text-center">
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
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
                      <p className="text-xs text-blue-600">
                        Email: demo@example.com<br />
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
