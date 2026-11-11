import React, { useEffect, useState } from 'react';
import {
  createRoot
} from 'react-dom/client';

import {
  BrowserRouter,
  useNavigate,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import {
  LayoutDashboard,
  FileText,
  Search,
  BriefcaseBusiness,
  Bell,
  UserRound,
  BrainCircuit,
  ShieldCheck,
  Building2,
  LogOut,
  Menu,
  BarChart3,
  Sparkles,
  UploadCloud,
  Target,
  Send
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import './index.css';


const API = 'http://127.0.0.1:8000';


const navByRole = {

  STUDENT: [
    ['Dashboard', '/dashboard', LayoutDashboard],
    ['My Resume', '/resume', FileText],
    ['AI Resume Improver', '/improve', Sparkles],
    ['Find Jobs', '/jobs', Search],
    ['Job Matches', '/matches', Target],
    ['Career Mentor', '/mentor', BrainCircuit],
    ['Applications', '/applications', BriefcaseBusiness],
    ['Notifications', '/notifications', Bell]
  ],

  JOB_SEEKER: [
    ['Dashboard', '/dashboard', LayoutDashboard],
    ['My Resume', '/resume', FileText],
    ['AI Resume Improver', '/improve', Sparkles],
    ['Find Jobs', '/jobs', Search],
    ['Job Matches', '/matches', Target],
    ['Career Mentor', '/mentor', BrainCircuit],
    ['Applications', '/applications', BriefcaseBusiness],
    ['Notifications', '/notifications', Bell]
  ],

  RECRUITER: [
    ['Dashboard', '/dashboard', LayoutDashboard],
    ['Company Profile', '/company', Building2],
    ['Post Job', '/post-job', BriefcaseBusiness],
    ['Applicants', '/applicants', UserRound],
    ['Find Candidates', '/candidates', Search],
    ['Interviews', '/interviews', Target],
    ['Analytics', '/analytics', BarChart3],
    ['Notifications', '/notifications', Bell]
  ],

  ADMIN: [
    ['Dashboard', '/dashboard', LayoutDashboard],
    ['Users', '/admin/users', UserRound],
    ['Jobs', '/admin/jobs', BriefcaseBusiness],
    ['Resumes', '/admin/resumes', FileText],
    ['Analytics', '/analytics', BarChart3],
    ['Announcements', '/admin/announcements', Bell]
  ]

};


function useAuth() {
  return JSON.parse(
    localStorage.getItem('arm_user') || 'null'
  );
}


function Shell({ children }) {

  const user = useAuth();

  const nav = useNavigate();

  const [open, setOpen] = useState(false);

  const items =
    navByRole[user?.role || 'STUDENT'];

  const logout = () => {

    localStorage.removeItem('arm_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('latest_resume_id');

    nav('/');

  };

  return (

    <div className="min-h-screen flex">

      <aside
        className={`sidebar fixed md:static z-20 h-screen w-64 p-5 ${
          open ? 'block' : 'hidden md:block'
        }`}
      >

        <div className="flex items-center gap-3 mb-8">

          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">

            <BrainCircuit />

          </div>

          <div>

            <div className="font-bold text-white">
              CareerAI
            </div>

            <div className="text-xs text-slate-400">
              Resume Intelligence
            </div>

          </div>

        </div>


        <div className="space-y-1">

          {items.map(
            ([label, path, Icon]) => (

              <Link
                key={path}
                onClick={() => setOpen(false)}
                to={path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10"
              >

                <Icon size={18} />

                {label}

              </Link>

            )
          )}

        </div>


        <button
          className="mt-8 flex gap-3 items-center px-3 py-2 text-slate-400"
          onClick={logout}
        >

          <LogOut size={18} />

          Logout

        </button>

      </aside>


      <main className="flex-1 min-w-0">

        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >

            <Menu />

          </button>


          <div className="hidden md:block text-sm muted">
            AI Resume Analyzer & Career Mentor
          </div>


          <div className="flex items-center gap-4">

            <div className="relative">

              <Bell size={20} />

              <span className="absolute -top-2 -right-2 text-[10px] bg-indigo-600 text-white rounded-full px-1.5">
                3
              </span>

            </div>


            <div className="text-right">

              <div className="text-sm font-semibold">
                {user?.name || 'Demo User'}
              </div>

              <div className="text-xs muted">
                {user?.role || 'STUDENT'}
              </div>

            </div>

          </div>

        </header>


        <div className="p-4 md:p-8 max-w-7xl mx-auto">

          {children}

        </div>

      </main>

    </div>

  );

}


function Landing() {

  const nav = useNavigate();

  return (

    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">

      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between">

        <div className="font-bold text-xl">

          Career
          <span className="text-indigo-600">
            AI
          </span>

        </div>


        <button
          className="btn primary"
          onClick={() => nav('/login')}
        >
          Sign in
        </button>

      </nav>


      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">

        <div>

          <span className="inline-flex gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">

            <Sparkles size={16} />

            AI-powered career intelligence

          </span>


          <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-5">

            Build your career with

            <span className="text-indigo-600">
              {' '}resume intelligence.
            </span>

          </h1>


          <p className="text-lg muted mt-5 max-w-xl">

            Analyze your resume, improve it for real opportunities,
            discover career paths and connect with employers —
            all backed by a relational database.

          </p>


          <div className="flex gap-3 mt-8">

            <button
              className="btn primary"
              onClick={() => nav('/login')}
            >
              Analyze My Resume
            </button>


            <button
              className="btn bg-white border"
              onClick={() => nav('/login')}
            >
              Find Jobs
            </button>

          </div>

        </div>


        <div className="card p-6">

          <div className="flex justify-between mb-5">

            <div>

              <div className="muted text-sm">
                Resume health
              </div>

              <div className="text-3xl font-bold">
                82/100
              </div>

            </div>


            <div className="w-16 h-16 rounded-full border-8 border-indigo-500 flex items-center justify-center font-bold">
              82%
            </div>

          </div>


          <div className="space-y-4">

            {[
              ['ATS compatibility', 88],
              ['Skills', 85],
              ['Experience', 78],
              ['Projects', 80]
            ].map(x => (

              <div key={x[0]}>

                <div className="flex justify-between text-sm mb-1">

                  <span>
                    {x[0]}
                  </span>

                  <span>
                    {x[1]}%
                  </span>

                </div>


                <div className="h-2 bg-slate-100 rounded">

                  <div
                    className="h-2 bg-indigo-500 rounded"
                    style={{
                      width: x[1] + '%'
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-5">

        {[
          [
            'AI Resume Analysis',
            'Score, diagnose and improve your resume.'
          ],
          [
            'Smart Job Matching',
            'Compare your skills with real job requirements.'
          ],
          [
            'Recruiter Search',
            'Find candidates using database-backed matching.'
          ]
        ].map(([a, b]) => (

          <div
            className="card p-6"
            key={a}
          >

            <div className="text-xl font-bold">
              {a}
            </div>

            <p className="muted mt-2">
              {b}
            </p>

          </div>

        ))}

      </section>

    </div>

  );

}

function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
     const response = await fetch(
  API + '/api/auth/login',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password
    })
  }
);

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail || 'Invalid email or password'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem(
        'access_token',
        data.access_token
      );

      localStorage.setItem(
        'arm_user',
        JSON.stringify({
          name: data.name,
          role: data.role.toUpperCase()
        })
      );

      nav('/dashboard');

    } catch (err) {
      setError('Cannot connect to backend');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">

      <form
        onSubmit={handleLogin}
        className="card p-8 w-full max-w-md"
      >

        <div className="font-bold text-2xl">
          Welcome back
        </div>

        <p className="muted mt-1 mb-6">
          Sign in to your CareerAI workspace.
        </p>

        <label className="text-sm font-semibold">
          Account role
        </label>

        <select
          className="input mt-2 mb-4"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {[
            'STUDENT',
            'JOB_SEEKER',
            'RECRUITER',
            'ADMIN'
          ].map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="text-sm font-semibold">
          Email
        </label>

        <input
          className="input mt-2 mb-4"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="text-sm font-semibold">
          Password
        </label>

        <input
          className="input mt-2 mb-5"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="text-green-600 text-sm mb-4">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="btn primary w-full"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="text-sm text-center mt-6">
          Don't have an account?
        </div>

        <button
          type="button"
          className="mt-2 text-sm text-indigo-600 w-full"
          onClick={() => nav('/register')}
        >
          Create an account
        </button>

        <button
  type="button"
  className="mt-4 text-sm text-indigo-600 w-full"
  onClick={() => nav('/forgot-password')}
>
  Forgot Password?
</button>

        <button
          type="button"
          className="mt-4 text-sm text-indigo-600 w-full"
          onClick={() => nav('/')}
        >
          ← Back to home
        </button>

      </form>

    </div>
  );
}

function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
  API + '/api/auth/forgot-password',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.trim()
    })
  }
);

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Could not send reset email.');
      } else {
        setMessage(
          data.message ||
          'If an account exists for this email, a password reset link will be sent.'
        );
      }
    } catch (err) {
      setError('Cannot connect to backend.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md"
      >
        <h1 className="font-bold text-2xl">Forgot Password?</h1>

        <p className="muted mt-2 mb-6">
          Enter your registered email address to receive a password reset link.
        </p>

        <label className="text-sm font-semibold">
          Email Address
        </label>

        <input
          className="input mt-2 mb-4 w-full"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-4">{message}</p>
        )}

        <button
          type="submit"
          className="btn primary w-full"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          className="mt-4 text-sm text-indigo-600 w-full"
          onClick={() => nav('/login')}
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}

function ResetPassword() {
  const nav = useNavigate();

  const token = new URLSearchParams(window.location.search).get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Reset link is missing its token.');
        setValidating(false);
        return;
      }

      try {
       const response = await fetch(
  API + '/api/auth/reset-password/validate?token=' +
  encodeURIComponent(token)
);

        const data = await response.json();

        if (!response.ok) {
          setError(data.detail || 'This reset link is invalid or expired.');
        } else {
          setValidToken(true);
        }
      } catch (err) {
        setError('Cannot connect to backend.');
      }

      setValidating(false);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
  API + '/api/auth/reset-password',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: token,
      password: password
    })
  }
);

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Could not reset password.');
      } else {
        setMessage('Password reset successfully. You can now log in.');

        setTimeout(() => {
          nav('/login');
        }, 1500);
      }
    } catch (err) {
      setError('Cannot connect to backend.');
    }

    setLoading(false);
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p>Checking your reset link...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="card p-8 w-full max-w-md"
      >
        <h1 className="font-bold text-2xl">Reset Password</h1>

        <p className="muted mt-2 mb-6">
          Create a new password for your account.
        </p>

        {validToken && (
          <>
            <label className="text-sm font-semibold">
              New Password
            </label>

            <input
              className="input mt-2 mb-4 w-full"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <label className="text-sm font-semibold">
              Confirm New Password
            </label>

            <input
              className="input mt-2 mb-4 w-full"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-4">{message}</p>
        )}

        {validToken && (
          <button
            type="submit"
            className="btn primary w-full"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        )}

        {!validToken && (
          <button
            type="button"
            className="btn primary w-full"
            onClick={() => nav('/forgot-password')}
          >
            Request a New Link
          </button>
        )}
      </form>
    </div>
  );
}

function Register() {
    const nav = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('STUDENT');

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleRegister = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!name.trim()) {
        setError('Please enter your name');
        return;
    }

    if (!email.trim()) {
        setError('Please enter your email address');
        return;
    }

    if (!password) {
        setError('Please enter a password');
        return;
    }

    if (password.length < 8) {
        setError('Password must contain at least 8 characters');
        return;
    }

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    setLoading(true);

    try {
       const response = await fetch(
  API + '/api/auth/register/request-otp',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role.toLowerCase()
    })
  }
);

        const data = await response.json();

        if (!response.ok) {
            setError(
                data.detail || 'Could not send registration OTP'
            );
            setLoading(false);
            return;
        }

        setMessage(
            'OTP sent to your email. Please check your inbox.'
        );
        setOtpSent(true);

    } catch (err) {
        setError('Cannot connect to backend');
    }

    setLoading(false);
};

const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!otp.trim() || otp.length !== 6) {
        setError('Please enter the 6-digit OTP');
        return;
    }

    setLoading(true);

    try {
       const response = await fetch(
  API + '/api/auth/register/verify-otp',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email.trim(),
      otp: otp.trim()
    })
  }
);

        const data = await response.json();

        if (!response.ok) {
            setError(
                data.detail || 'Invalid or expired OTP'
            );
            setLoading(false);
            return;
        }

        setMessage(
            'Account created successfully! Redirecting to login...'
        );

        setTimeout(() => {
            nav('/login');
        }, 1500);

    } catch (err) {
        setError('Cannot connect to backend');
    }

    setLoading(false);
};
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">

            <form
                onSubmit={handleRegister}
                className="card p-8 w-full max-w-md"
            >

                <div className="font-bold text-2xl">
                    Create your account
                </div>

                <p className="muted mt-1 mb-6">
                    Join your CareerAI workspace.
                </p>

                <label className="text-sm font-semibold">
                    Name
                </label>

                <input
                    className="input mt-2 mb-4"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label className="text-sm font-semibold">
                    Email
                </label>

                <input
                    className="input mt-2 mb-4"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className="text-sm font-semibold">
                    Password
                </label>

                <input
                    className="input mt-2 mb-4"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label className="text-sm font-semibold">
                    Confirm Password
                </label>

                <input
                    className="input mt-2 mb-4"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <label className="text-sm font-semibold">
                    Account Role
                </label>

                <select
                    className="input mt-2 mb-5"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="STUDENT">
                        Student
                    </option>

                    <option value="JOB_SEEKER">
                        Job Seeker
                    </option>

                    <option value="RECRUITER">
                        Recruiter
                    </option>
                </select>

                {error && (
                    <div className="text-red-600 text-sm mb-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="text-green-600 text-sm mb-4">
                        {message}
                    </div>
                )}
  
                {otpSent && (
    <div className="mt-5">
        <label className="text-sm font-semibold">
            Enter OTP
        </label>

        <input
            className="input mt-2 mb-3"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
                setOtp(
                    e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6)
                )
            }
        />

        <button
            type="button"
            className="btn primary w-full"
            onClick={handleVerifyOtp}
            disabled={loading}
        >
            {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
    </div>
)}

               {!otpSent && (
    <button
        type="submit"
        className="btn primary w-full"
        disabled={loading}
    >
        {loading ? 'Creating...' : 'Create Account'}
    </button>
)} 

                <div className="text-sm text-center mt-5">
                    Already have an account?
                </div>

                <button
                    type="button"
                    className="mt-2 text-sm text-indigo-600 w-full"
                    onClick={() => nav('/login')}
                >
                    Login
                </button>

                <button
                    type="button"
                    className="mt-4 text-sm text-indigo-600 w-full"
                    onClick={() => nav('/')}
                >
                    ← Back to home
                </button>

            </form>

        </div>
    );
}

function Dashboard() {
  const user = useAuth();

  const [announcements, setAnnouncements] = React.useState([]);

  const [stats, setStats] = React.useState({
    users: 0,
    jobs: 0,
    resumes: 0,
    applications: 0,
    avg_resume_score: 0,
    active_jobs: 0,
    applicants: 0,
    resume_views: 0,
    interviews: 0
  });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
fetch(API + '/api/dashboard/stats', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to load dashboard statistics');
        }

        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Dashboard stats error:', err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const role = user?.role?.toLowerCase();

    if (role !== 'student' && role !== 'job_seeker') {
      return;
    }

    const token = localStorage.getItem('access_token');

    fetch(API + '/api/announcements', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to load announcements');
        }

        return res.json();
      })
      .then((data) => {
        setAnnouncements(data);
      })
      .catch((err) => {
        console.error('Announcements error:', err);
      });
  }, [user]);

  const role = user?.role?.toLowerCase();

  if (loading) {
    return (
      <div className="page">
        <h1>Dashboard</h1>
        <p className="muted">Loading dashboard...</p>
      </div>
    );
  }

  /* =========================
     ADMIN DASHBOARD
     ========================= */

  if (role === 'admin') {
    return (
      <div className="page">
        <div className="mb-6">
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Monitor and manage the AI Resume Analyzer & Career Mentor platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="muted text-sm">
              Total Users
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.users || 0}
            </div>

            <div className="text-sm muted mt-2">
              Registered platform users
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Total Jobs
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.jobs || 0}
            </div>

            <div className="text-sm muted mt-2">
              Jobs posted on platform
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Total Resumes
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.resumes || 0}
            </div>

            <div className="text-sm muted mt-2">
              Resumes uploaded
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Applications
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.applications || 0}
            </div>

            <div className="text-sm muted mt-2">
              Total job applications
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">
          <div className="card p-5">
            <div className="muted text-sm">
              Active Jobs
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.active_jobs || 0}
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Interviews
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.interviews || 0}
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Platform Resume Quality
            </div>

            <div className="text-3xl font-black mt-2">
              {Math.round(stats.avg_resume_score || 0)}
              <span className="text-lg">/100</span>
            </div>
          </div>
        </div>

        <div className="card p-6 mt-5">
          <h2 className="text-xl font-bold">
            Platform Overview
          </h2>

          <p className="muted text-sm mt-1">
            System-wide activity across users, jobs, resumes and applications.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-sm muted">
                Users
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.users || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-sm muted">
                Jobs
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.jobs || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-sm muted">
                Resumes
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.resumes || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-sm muted">
                Applications
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.applications || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 mt-5">
          <h2 className="text-xl font-bold">
            Admin Actions
          </h2>

          <p className="muted text-sm mt-1">
            Manage platform resources from the administrator navigation.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <div className="p-4 rounded-xl border border-slate-200">
              <div className="font-bold">
                Manage Users
              </div>

              <p className="text-sm muted mt-1">
                View registered students, job seekers, recruiters and admins.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="font-bold">
                Manage Jobs
              </div>

              <p className="text-sm muted mt-1">
                Monitor jobs posted by recruiters.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="font-bold">
                Manage Resumes
              </div>

              <p className="text-sm muted mt-1">
                Review uploaded resumes and analysis scores.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 mt-5">
          <h2 className="text-xl font-bold">
            System Overview
          </h2>

          <p className="muted text-sm mt-2">
            The platform connects candidates, recruiters and administrators
            through resume analysis, job matching, applications,
            interviews and career guidance.
          </p>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold">
              Administrator View
            </div>

            <p className="text-sm muted mt-1">
              Use the administrator navigation to manage users, jobs, resumes,
              analytics and announcements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     RECRUITER DASHBOARD
     ========================= */

  if (role === 'recruiter') {
    return (
      <div className="page">
        <div className="mb-6">
          <h1>Recruiter Dashboard</h1>

          <p className="muted">
            Manage your jobs, applicants and interviews.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card p-5">
            <div className="muted text-sm">
              Active Jobs
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.active_jobs || 0}
            </div>

            <div className="text-sm muted mt-2">
              Currently active job postings
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Applicants
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.applicants || 0}
            </div>

            <div className="text-sm muted mt-2">
              Candidates who applied
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Resume Views
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.resume_views || 0}
            </div>

            <div className="text-sm muted mt-2">
              Candidate resume views
            </div>
          </div>

          <div className="card p-5">
            <div className="muted text-sm">
              Interviews
            </div>

            <div className="text-3xl font-black mt-2">
              {stats.interviews || 0}
            </div>

            <div className="text-sm muted mt-2">
              Scheduled interviews
            </div>
          </div>
        </div>

        <div className="card p-6 mt-5">
          <h2 className="text-xl font-bold">
            Recruitment Overview
          </h2>

          <p className="muted text-sm mt-1">
            Manage your complete recruitment process from job posting to
            candidate interviews.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold">
                Job Postings
              </div>

              <p className="text-sm muted mt-1">
                Create and manage job opportunities for candidates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold">
                Candidate Applications
              </div>

              <p className="text-sm muted mt-1">
                Review applications and update candidate status.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold">
                Interviews
              </div>

              <p className="text-sm muted mt-1">
                Schedule and manage candidate interviews.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 mt-5">
          <h2 className="text-xl font-bold">
            Recruitment Activity
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            <div className="p-4 rounded-xl border border-slate-200">
              <div className="text-sm muted">
                Applicants
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.applicants || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="text-sm muted">
                Interviews
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.interviews || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200">
              <div className="text-sm muted">
                Resume Views
              </div>

              <div className="text-2xl font-black mt-1">
                {stats.resume_views || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     STUDENT / JOB SEEKER
     ========================= */

  return (
    <div className="page">
      <div className="mb-6">
        <h1>
          Welcome, {user?.name || 'Candidate'}
        </h1>

        <p className="muted">
          Build your resume, discover relevant jobs and improve your career
          opportunities.
        </p>
      </div>

      {announcements.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-lg">
                Announcements Announcements
              </div>

              <p className="muted text-sm mt-1">
                Important updates and opportunities for you.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.announcement_id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base">
                      {announcement.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-2 leading-6">
                      {announcement.message}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold capitalize">
                      {announcement.category
                        ? announcement.category.replace(/_/g, ' ')
                        : 'Notice'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 mt-3">
                  Published{' '}
                  {announcement.created_at
                    ? new Date(
                        announcement.created_at
                      ).toLocaleDateString()
                    : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="muted text-sm">
            Active Jobs
          </div>

          <div className="text-3xl font-black mt-2">
            {stats.active_jobs || 0}
          </div>

          <div className="text-sm muted mt-2">
            Jobs available on the platform
          </div>
        </div>

        <div className="card p-5">
          <div className="muted text-sm">
            Applications
          </div>

          <div className="text-3xl font-black mt-2">
            {stats.applicants || 0}
          </div>

          <div className="text-sm muted mt-2">
            Applications submitted
          </div>
        </div>

        <div className="card p-5">
          <div className="muted text-sm">
            Resume Views
          </div>

          <div className="text-3xl font-black mt-2">
            {stats.resume_views || 0}
          </div>

          <div className="text-sm muted mt-2">
            Recruiter resume activity
          </div>
        </div>

        <div className="card p-5">
          <div className="muted text-sm">
            Interviews
          </div>

          <div className="text-3xl font-black mt-2">
            {stats.interviews || 0}
          </div>

          <div className="text-sm muted mt-2">
            Interview opportunities
          </div>
        </div>
      </div>

      <div className="card p-6 mt-5">
        <div className="font-bold text-lg">
          Career Career Dashboard
        </div>

        <p className="muted text-sm mt-1">
          Use your resume, job matching and career tools to improve your
          opportunities.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold">
              Resume Analyzer
            </div>

            <p className="text-sm muted mt-1">
              Analyze your resume and identify areas for improvement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold">
              AI Resume Improver
            </div>

            <p className="text-sm muted mt-1">
              Improve your resume while keeping your real information intact.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold">
              Job Matching
            </div>

            <p className="text-sm muted mt-1">
              Find jobs that match your skills and resume.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="font-bold">
              Career Mentor
            </div>

            <p className="text-sm muted mt-1">
              Get career guidance and identify skills to learn next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Jobs() {

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState('');


 useEffect(() => {
  fetch(API + '/api/jobs')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load jobs');
      }
      return response.json();
    })
    .then(setJobs)
    .catch(error => {
      console.error('Jobs error:', error);
    });
}, []);


  const filteredJobs = jobs.filter(job => {

    const value = (

      job.title + ' ' +
      job.description + ' ' +
      job.location + ' ' +
      job.industry

    ).toLowerCase();

    return value.includes(
      search.toLowerCase()
    );

  });


  return (

    <>

      <PageTitle
        title="Find Jobs"
        sub="Search opportunities and compare them with your resume."
      />


      <div className="card p-4 mb-5 flex gap-3">

        <Search />

        <input
          className="outline-none w-full"
          placeholder="Search jobs, skills, companies or locations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

      </div>


      <div className="grid lg:grid-cols-2 gap-4">

        {filteredJobs.map(j => (

          <div
            className="card p-5"
            key={j.job_id}
          >

            <div className="flex justify-between">

              <div>

                <div className="text-xl font-bold">
                  {j.title}
                </div>

                <div className="muted">
                  {j.industry} · {j.location}
                </div>

              </div>

            </div>


            <p className="muted mt-4">
              {j.description}
            </p>


            <div className="flex gap-2 mt-5">

              <Link
                to="/matches"
                className="btn primary"
              >
                Match Resume
              </Link>

              <button className="btn border">
                Save
              </button>

            </div>

          </div>

        ))}

      </div>


      {filteredJobs.length === 0 && (

        <div className="card p-8 text-center">

          <div className="font-bold">
            No jobs found
          </div>

          <p className="muted mt-2">
            Try a different search.
          </p>

        </div>

      )}

    </>

  );

}

function Resume() {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);


  const selectFile = (selectedFile) => {

    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    setError('');
    setFile(selectedFile);
    setResult(null);

  };


  const upload = async () => {

    if (!file) {
      setError('Please select a resume first.');
      return;
    }

    setError('');
    setLoading(true);

    try {

      const token =
        localStorage.getItem('access_token');

      if (!token) {
        setError('Please login again.');
        setLoading(false);
        return;
      }

      const fd = new FormData();

      fd.append('file', file);

     const r = await fetch(
  API + '/api/resumes/upload',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: fd
  }
);

      const x = await r.json();

      if (!r.ok) {
        setError(
          x.detail ||
          'Resume upload failed.'
        );
        setLoading(false);
        return;
      }

      localStorage.setItem(
        'latest_resume_id',
        x.resume_id
      );

    const a = await fetch(
  API + `/api/resumes/${x.resume_id}/analyze`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

      const analysis = await a.json();

      if (!a.ok) {
        setError(
          analysis.detail ||
          'Resume analysis failed.'
        );
        setLoading(false);
        return;
      }

      setResult(analysis);

    } catch (err) {

      setError(
        'Cannot connect to backend.'
      );

    }

    setLoading(false);

  };


  const scoreColor = (score) => {

    if (score >= 80)
      return 'text-emerald-600';

    if (score >= 60)
      return 'text-amber-500';

    return 'text-red-500';

  };


  const progressColor = (score) => {

    if (score >= 80)
      return 'bg-emerald-500';

    if (score >= 60)
      return 'bg-amber-500';

    return 'bg-red-500';

  };


  const scoreItems = result
    ? [
        ['ATS Compatibility', result.ats_score],
        ['Skills', result.skills_score],
        ['Experience', result.experience_score],
        ['Education', result.education_score],
        ['Projects', result.projects_score],
        ['Formatting', result.formatting_score],
        ['Keywords', result.keyword_score]
      ]
    : [];


  return (

    <>

      <PageTitle
        title="Resume Intelligence"
        sub="Upload your resume and get an AI-powered professional analysis."
      />


      {/* Top Information Cards */}

      <div className="grid md:grid-cols-3 gap-5 mb-5">

        <div className="card p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
              <UploadCloud
                size={22}
                className="text-indigo-600"
              />
            </div>

            <div>

              <div className="font-bold">
                Upload Resume
              </div>

              <div className="text-xs text-slate-500">
                PDF, DOC or DOCX
              </div>

            </div>

          </div>

        </div>


        <div className="card p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>

            <div>

              <div className="font-bold">
                ATS Analysis
              </div>

              <div className="text-xs text-slate-500">
                Check recruiter compatibility
              </div>

            </div>

          </div>

        </div>


        <div className="card p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
              <span className="text-xl">✦</span>
            </div>

            <div>

              <div className="font-bold">
                Career Insights
              </div>

              <div className="text-xs text-slate-500">
                Find areas to improve
              </div>

            </div>

          </div>

        </div>

      </div>



      <div className="grid xl:grid-cols-5 gap-5">


        {/* LEFT - UPLOAD */}

        <div className="xl:col-span-2 card p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-xl font-bold">
                Upload Resume
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Upload your latest resume for analysis.
              </p>

            </div>

            <div className="text-2xl">
              Resume
            </div>

          </div>


          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              dragging
                ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => {
              setDragging(false);
            }}
            onDrop={(e) => {

              e.preventDefault();

              setDragging(false);

              const droppedFile =
                e.dataTransfer.files[0];

              selectFile(droppedFile);

            }}
          >

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto">

              <UploadCloud
                size={32}
                className="text-indigo-600"
              />

            </div>


            <div className="font-bold text-lg mt-5">

              {dragging
                ? 'Drop your resume here'
                : 'Drag & drop your resume'}

            </div>


            <p className="text-sm text-slate-500 mt-2">

              or select a file from your computer

            </p>


            <p className="text-xs text-slate-400 mt-2">

              Maximum recommended size: 5 MB

            </p>


            <label className="btn primary inline-flex items-center gap-2 mt-6 cursor-pointer">

              <UploadCloud size={17} />

              Choose Resume

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  selectFile(
                    e.target.files[0]
                  );
                }}
              />

            </label>


            {/* Selected File */}

            {file && (

              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">

                    Resume

                  </div>


                  <div className="flex-1 min-w-0">

                    <div className="font-semibold text-sm truncate">

                      {file.name}

                    </div>

                    <div className="text-xs text-slate-500 mt-1">

                      {(file.size / 1024 / 1024).toFixed(2)} MB

                    </div>

                  </div>


                  <button
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setError('');
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >

                    Remove

                  </button>

                </div>

              </div>

            )}


            {/* Error */}

            {error && (

              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">

                {error}

              </div>

            )}


            <button
              onClick={upload}
              disabled={loading || !file}
              className="btn primary w-full mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="animate-spin">
                    â—Œ
                  </span>

                  Analyzing Resume...

                </span>
              ) : (

                'Analyze Resume'

              )}

            </button>


            <div className="flex items-center justify-center gap-5 mt-5 text-xs text-slate-400">

              <span>✓ Secure upload</span>

              <span>✓ AI analysis</span>

              <span>✓ ATS insights</span>

            </div>

          </div>


          {/* What Analysis Includes */}

          <div className="mt-6">

            <div className="font-bold text-sm">
              What you'll get
            </div>


            <div className="grid grid-cols-2 gap-3 mt-3">

              {[
                'Overall Score',
                'ATS Compatibility',
                'Skills Analysis',
                'Experience Review',
                'Project Review',
                'Keyword Analysis'
              ].map(item => (

                <div
                  key={item}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >

                  <span className="text-emerald-500 font-bold">
                    ✓
                  </span>

                  {item}

                </div>

              ))}

            </div>

          </div>

        </div>



        {/* RIGHT - ANALYSIS */}

        <div className="xl:col-span-3">


          {!result ? (

            <div className="card p-8 h-full flex flex-col justify-center">

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">

                <span className="text-3xl">
                  ✦
                </span>

              </div>


              <h2 className="text-2xl font-bold">
                Resume Intelligence
              </h2>


              <p className="text-slate-500 mt-2 max-w-xl">

                Your resume analysis will appear here after
                you upload and analyze your resume.

                We evaluate your resume across ATS compatibility,
                skills, experience, education, projects,
                formatting and keywords.

              </p>


              <div className="grid sm:grid-cols-2 gap-4 mt-7">

                {[
                  ['Career Goals', 'ATS Score', 'Recruiter compatibility'],
                  ['AI', 'Skills', 'Technical skill coverage'],
                  ['Jobs', 'Experience', 'Experience strength'],
                  ['Education', 'Education relevance'],
  ['Career', 'Projects', 'Project quality'],
  ['Keywords', 'Important keywords']
].map(item => (
                  <div
                    key={item[1]}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >

                    <div className="text-xl">
                      {item[0]}
                    </div>

                    <div className="font-semibold text-sm mt-2">
                      {item[1]}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {item[2]}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ) : (

            <div className="space-y-5">


              {/* SCORE HEADER */}

              <div className="card p-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">


                  <div>

                    <div className="text-sm font-semibold text-indigo-600">
                      RESUME ANALYSIS COMPLETE
                    </div>

                    <h2 className="text-2xl font-bold mt-1">
                      Your Resume Score
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Here is a detailed breakdown of your resume.
                    </p>

                  </div>


                  <div className="flex items-center gap-5">


                    <div className="text-center">

                      <div className="text-xs text-slate-500">
                        Overall
                      </div>

                      <div
                        className={`text-5xl font-black mt-1 ${scoreColor(result.overall_score)}`}
                      >

                        {result.overall_score}

                        <span className="text-lg text-slate-400">
                          /100
                        </span>

                      </div>

                    </div>


                    <div className="h-14 w-px bg-slate-200" />


                    <div className="text-center">

                      <div className="text-xs text-slate-500">
                        ATS
                      </div>

                      <div
                        className={`text-3xl font-black mt-1 ${scoreColor(result.ats_score)}`}
                      >

                        {result.ats_score}%

                      </div>

                    </div>

                  </div>

                </div>


                <div className="mt-6">

                  <div className="flex justify-between text-xs text-slate-500 mb-2">

                    <span>
                      Resume strength
                    </span>

                    <span className="font-semibold">
                      {result.overall_score}/100
                    </span>

                  </div>


                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${progressColor(result.overall_score)}`}
                      style={{
                        width: `${result.overall_score}%`
                      }}
                    />

                  </div>

                </div>

              </div>



              {/* SCORE BREAKDOWN */}

              <div className="card p-6">

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h3 className="text-lg font-bold">
                      Score Breakdown
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      See how each section contributes to your score.
                    </p>

                  </div>

                  <div className="text-xl">
                    Analytics
                  </div>

                </div>


                <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">

                  {scoreItems.map(item => {

                    const score =
                      Number(item[1] || 0);

                    return (

                      <div key={item[0]}>

                        <div className="flex justify-between text-sm mb-2">

                          <span className="font-medium">
                            {item[0]}
                          </span>

                          <span
                            className={`font-bold ${scoreColor(score)}`}
                          >
                            {score}%
                          </span>

                        </div>


                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${progressColor(score)}`}
                            style={{
                              width: `${Math.min(
                                Math.max(score, 0),
                                100
                              )}%`
                            }}
                          />

                        </div>

                      </div>

                    );

                  })}

                </div>

              </div>



              {/* SUGGESTIONS */}

              {result.suggestions?.length > 0 && (

                <div className="card p-6">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      Tip
                    </div>

                    <div>

                      <h3 className="text-lg font-bold">
                        Improvement Suggestions
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Prioritized recommendations to strengthen your resume.
                      </p>

                    </div>

                  </div>


                  <div className="space-y-3 mt-5">

                    {result.suggestions.map(
                      (suggestion, index) => {

                        const priority =
                          String(
                            suggestion[2] || ''
                          ).toLowerCase();

                        const priorityClass =
                          priority === 'high'
                            ? 'bg-red-50 border-red-100 text-red-700'
                            : priority === 'medium'
                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700';


                        return (

                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${priorityClass}`}
                          >

                            <div className="flex items-start justify-between gap-4">

                              <div>

                                <div className="font-semibold">
                                  {suggestion[0]}
                                </div>

                                <div className="text-sm mt-1 opacity-90">
                                  {suggestion[1]}
                                </div>

                              </div>


                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/70">
                                {suggestion[2] || 'Normal'}
                              </span>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                </div>

              )}



              {/* DETECTED SKILLS */}

              {result.skills?.length > 0 && (

                <div className="card p-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-lg font-bold">
                        Detected Skills
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Technical and professional skills identified in your resume.
                      </p>

                    </div>

                    <div className="text-xl">
                      AI
                    </div>

                  </div>


                  <div className="flex flex-wrap gap-2 mt-5">

                    {result.skills.map(skill => (

                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium"
                      >

                        {skill}

                      </span>

                    ))}

                  </div>

                </div>

              )}



              {/* NEXT STEP */}

              <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">

                    Career

                  </div>


                  <div>

                    <h3 className="font-bold text-lg">
                      Ready for the next step?
                    </h3>

                    <p className="text-sm text-slate-600 mt-1">
                      Use these insights to improve your resume,
                      then explore matching jobs and career opportunities.
                    </p>

                  </div>

                </div>

              </div>


            </div>

          )}

        </div>

      </div>

    </>

  );

}

function PageTitle({ title, sub }) {

  return (

    <div className="mb-7">

      <h1 className="text-3xl font-black">
        {title}
      </h1>

      <p className="muted mt-1">
        {sub}
      </p>

    </div>

  );

}

function JobMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const resumeId = localStorage.getItem('latest_resume_id');

        if (!resumeId) {
          setError('Please upload and analyze a resume first.');
          return;
        }

        const jobsResponse = await fetch(
          'http://127.0.0.1:8000/api/jobs'
        );

        if (!jobsResponse.ok) {
          throw new Error(
            `Could not load jobs. Server returned ${jobsResponse.status}.`
          );
        }

        const jobData = await jobsResponse.json();

        if (!Array.isArray(jobData)) {
          throw new Error('Unexpected jobs response from backend.');
        }

        const results = await Promise.all(
          jobData.map(async (job) => {
            try {
              const response = await fetch(
                'http://127.0.0.1:8000/api/job-match',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    resume_id: Number(resumeId),
                    job_id: job.job_id,
                  }),
                }
              );

              if (!response.ok) {
                return null;
              }

              const data = await response.json();

              return {
                ...job,
                ...data,
              };
            } catch {
              return null;
            }
          })
        );

        const validResults = results
          .filter((job) => job !== null)
          .sort(
            (a, b) =>
              Number(b.match_percentage || 0) -
              Number(a.match_percentage || 0)
          );

        if (!cancelled) {
          setMatches(validResults);

          if (jobData.length > 0 && validResults.length === 0) {
            setError(
              'Jobs were found, but their resume matches could not be calculated. Check the backend job-match endpoint.'
            );
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof TypeError
              ? 'Cannot connect to backend. Make sure FastAPI is running at http://127.0.0.1:8000.'
              : err.message || 'Could not load job matches.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const getMatchColor = (match) => {
    if (match >= 80) {
      return {
        text: 'text-emerald-600',
        bg: 'bg-emerald-500',
        light: 'bg-emerald-50',
        border: 'border-emerald-100',
        label: 'Excellent Match',
      };
    }

    if (match >= 60) {
      return {
        text: 'text-amber-600',
        bg: 'bg-amber-500',
        light: 'bg-amber-50',
        border: 'border-amber-100',
        label: 'Good Match',
      };
    }

    return {
      text: 'text-red-500',
      bg: 'bg-red-500',
      light: 'bg-red-50',
      border: 'border-red-100',
      label: 'Needs Improvement',
    };
  };

  const excellentMatches = matches.filter(
    (job) => Number(job.match_percentage || 0) >= 80
  ).length;

  const goodMatches = matches.filter((job) => {
    const score = Number(job.match_percentage || 0);
    return score >= 60 && score < 80;
  }).length;

  return (
    <>
      <PageTitle
        title="Job Matches"
        sub="Discover opportunities ranked by how closely they match your resume and skills."
      />

      {!loading && !error && matches.length > 0 && (
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                🎯
              </div>
              <div>
                <div className="text-xs text-slate-500">Jobs Analyzed</div>
                <div className="text-2xl font-black mt-1">
                  {matches.length}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                ⭐
              </div>
              <div>
                <div className="text-xs text-slate-500">
                  Excellent Matches
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {excellentMatches}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                👍
              </div>
              <div>
                <div className="text-xs text-slate-500">Good Matches</div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {goodMatches}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="card p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl animate-pulse">
              🎯
            </div>

            <div className="font-bold text-xl mt-5">
              Finding your best matches...
            </div>

            <p className="text-sm text-slate-500 mt-2 max-w-md">
              We are comparing your resume against available jobs and
              calculating your skill compatibility.
            </p>

            <div className="w-full max-w-md h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
              <div className="h-full w-2/3 bg-indigo-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="card p-6 border border-red-100 bg-red-50">
          <div className="flex items-start gap-3">
            <div className="text-xl">⚠️</div>
            <div>
              <div className="font-bold text-red-700">
                Something went wrong
              </div>
              <div className="text-sm text-red-600 mt-1">{error}</div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-3xl">
            🔎
          </div>

          <div className="font-bold text-xl mt-5">
            No job matches found
          </div>

          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Try adding more relevant skills to your resume or check again
            when new jobs are posted.
          </p>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="space-y-5">
          {matches.map((job) => {
            const match = Math.min(
              100,
              Math.max(0, Number(job.match_percentage || 0))
            );

            const colors = getMatchColor(match);

            return (
              <div
                className="card p-6 hover:shadow-md transition-shadow"
                key={job.job_id}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-2xl">
                      💼
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold">{job.title}</h2>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${colors.light} ${colors.text} border ${colors.border}`}
                        >
                          {colors.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 mt-2">
                        <span>
                          📍 {job.location || 'Location not specified'}
                        </span>
                        <span>
                          💼 {job.employment_type || 'Full-time'}
                        </span>
                      </div>

                      {job.industry && (
                        <div className="text-sm text-slate-500 mt-2">
                          Industry: {job.industry}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:min-w-[190px]">
                    <div className="flex-1 lg:flex-none">
                      <div className="text-xs text-slate-500">
                        Resume Match
                      </div>
                      <div
                        className={`text-4xl font-black mt-1 ${colors.text}`}
                      >
                        {match}%
                      </div>
                    </div>

                    <div
                      className={`w-16 h-16 shrink-0 rounded-full border-4 flex items-center justify-center text-sm font-bold ${colors.border} ${colors.text}`}
                    >
                      {match}%
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Compatibility</span>
                    <span className={`font-bold ${colors.text}`}>
                      {match}/100
                    </span>
                  </div>

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.bg}`}
                      style={{ width: `${match}%` }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-7">
                  <div
                    className={`p-5 rounded-2xl ${colors.light} border ${colors.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        ✓
                      </div>
                      <div className="font-bold">Matching Skills</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.matching_skills?.length ? (
                        job.matching_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-100 text-emerald-700 text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No matching skills found.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        ⚠️
                      </div>
                      <div className="font-bold text-red-700">
                        Missing Skills
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.missing_skills?.length ? (
                        job.missing_skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-red-100 text-red-700 text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-emerald-600 font-semibold">
                          All required skills found
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {job.missing_keywords?.length > 0 && (
                  <div className="mt-5 p-5 rounded-2xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                        🔑
                      </div>
                      <div>
                        <div className="font-bold text-amber-800">
                          Missing Keywords
                        </div>
                        <div className="text-xs text-amber-700 mt-0.5">
                          Include these only when they truthfully describe
                          your experience or skills.
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.missing_keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1.5 rounded-lg bg-white border border-amber-100 text-amber-700 text-xs font-semibold"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                      💡
                    </div>

                    <div>
                      <div className="font-bold text-sm">Recommendation</div>
                      <p className="text-sm text-slate-600 mt-1 leading-6">
                        {match >= 80
                          ? 'Excellent match! Your resume strongly aligns with this opportunity.'
                          : match >= 60
                          ? 'Good match. Review the missing skills and keywords before applying.'
                          : 'Low match. Consider strengthening relevant skills and resume keywords before applying.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const loadCandidates = async (value = '') => {
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Please log in again as a recruiter.');
    }

    const response = await fetch(
      `${API}/api/recruiter/candidates?search=${encodeURIComponent(value)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Invalid backend response (${response.status}).`
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data.detail || `Could not load candidates (${response.status}).`
      );
    }

    if (!Array.isArray(data)) {
      throw new Error('Unexpected candidates response from backend.');
    }

    setCandidates(data);
  } catch (error) {
    console.error('Find Candidates error:', error);
    setError(error.message || 'Could not connect to backend.');
    setCandidates([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    loadCandidates(value);
  };

  if (loading) {
    return (
      <div className="card p-8">
        Loading candidates...
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Find Candidates"
        sub="Search candidates using names, emails, skills, or resume content."
      />

      <div className="card p-6 mb-6">
        <div className="flex gap-3">
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, email, skill..."
            className="input flex-1"
          />

          <button
            className="btn"
            onClick={() => loadCandidates(search)}
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="font-bold text-lg">
            No candidates found
          </div>

          <p className="muted mt-2">
            Try searching for another name, email, or skill.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {candidates.map(candidate => (
            <div
              key={candidate.application_id}
              className="card p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                  <div className="font-bold text-xl">
                    {candidate.candidate_name}
                  </div>

                  <div className="muted mt-1">
                    {candidate.candidate_email}
                  </div>

                  <div className="font-semibold mt-4">
                    {candidate.job_title}
                  </div>

                  <div className="muted text-sm mt-1">
                    Resume: {candidate.resume_name}
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">

                  <span className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium">
                    {candidate.status}
                  </span>

                  <button
                    className="btn"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    View Resume
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">

          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-xl">

            <div className="p-6 border-b flex items-center justify-between">

              <div>
                <div className="text-xl font-bold">
                  {selectedCandidate.candidate_name}
                </div>

                <div className="muted text-sm mt-1">
                  {selectedCandidate.candidate_email}
                </div>
              </div>

              <button
                className="text-2xl"
                onClick={() => setSelectedCandidate(null)}
              >
                Ã—
              </button>

            </div>

            <div className="p-6 overflow-y-auto max-h-[65vh]">

              <div className="grid md:grid-cols-2 gap-4 mb-6">

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="muted text-sm">
                    Applied Job
                  </div>

                  <div className="font-semibold mt-1">
                    {selectedCandidate.job_title}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="muted text-sm">
                    Application Status
                  </div>

                  <div className="font-semibold mt-1 capitalize">
                    {selectedCandidate.status}
                  </div>
                </div>

              </div>

              <div>
                <div className="font-bold text-lg mb-3">
                  Resume
                </div>

                <div className="p-5 rounded-xl border bg-slate-50 whitespace-pre-line text-sm leading-6">
                  {selectedCandidate.resume_text}
                </div>
              </div>

            </div>

            <div className="p-5 border-t flex justify-end">
              <button
                className="btn"
                onClick={() => setSelectedCandidate(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

function ResumeImprover() {
  const [result, setResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const improve = async () => {
    const resumeId = localStorage.getItem("latest_resume_id");
    const token = localStorage.getItem("access_token");

    setError("");
    setResult(null);

    if (!token) {
      setError("Please log in first.");
      return;
    }

    if (!resumeId || !Number.isInteger(Number(resumeId))) {
      setError("Please upload a resume and select a valid resume first.");
      return;
    }

    setLoading(true);

    try {
      const query = new URLSearchParams({
        job_description: jobDescription,
      });

      const response = await fetch(
        `${API}/api/resumes/${Number(resumeId)}/improve?${query.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { detail: text };
        }
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Resume improvement API was not found. Check whether POST /api/resumes/{resume_id}/improve exists in FastAPI /docs."
          );
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Your session may have expired or you do not have permission. Please log in again."
          );
        }

        throw new Error(
          data.detail || `Could not improve resume. Error ${response.status}`
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Cannot connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const skills = Array.isArray(result?.skills)
    ? result.skills
    : [];

  const notes = Array.isArray(result?.improvement_notes)
    ? result.improvement_notes
    : [];

  return (
    <>
      <PageTitle
        title="AI Resume Improver"
        sub="Improve your resume wording and tailor it to a target job."
      />

      <div className="card p-6 mb-5 bg-gradient-to-r from-indigo-50 via-white to-purple-50 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl">
            ✨
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              AI Career Assistant
            </div>

            <h2 className="text-2xl font-black mt-1">
              Make your resume stand out
            </h2>

            <p className="text-sm text-slate-600 mt-2">
              Get suggestions for clearer wording and relevant skills without
              inventing qualifications or experience.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-bold text-xl mb-2">
            Target a Job Role
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            Paste the job description to get more relevant suggestions.
            This field is optional.
          </p>

          <label className="font-semibold text-sm">
            Job Description
          </label>

          <textarea
            className="input mt-3 w-full min-h-56 resize-y"
            placeholder="Example: We are looking for a Python Backend Developer with experience in FastAPI, PostgreSQL, REST APIs and Git."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="flex justify-between items-center gap-3 mt-3">
            <span className="text-xs text-slate-400">
              {jobDescription.length} characters
            </span>

            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription("")}
                className="text-xs font-semibold text-slate-500 hover:text-red-500"
              >
                Clear description
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              <div className="font-semibold">
                Something went wrong
              </div>
              <div className="mt-1 break-words">
                {error}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={improve}
            disabled={loading}
            className="btn primary w-full sm:w-auto mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Improving Resume..." : "✨ Improve My Resume"}
          </button>

          {loading && (
            <div className="mt-5 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="text-sm font-semibold text-indigo-700">
                Reviewing your resume...
              </div>
              <div className="text-xs text-indigo-600 mt-1">
                Checking wording, skills and job relevance.
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-lg">
            Truth Protection
          </h2>

          <div className="mt-5 space-y-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="font-semibold text-emerald-700">
                ✓ No fake qualifications
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Do not add degrees or experience you do not have.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="font-semibold text-emerald-700">
                ✓ Skills based on your resume
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Review all suggested skills for accuracy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="font-semibold text-indigo-700">
                ✓ Job-focused suggestions
              </div>
              <p className="text-xs text-indigo-700 mt-1">
                Use a job description to tailor recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-5">
          <div className="card p-6">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Improvement Complete
            </div>

            <h2 className="text-2xl font-black mt-1">
              Your Resume Improvement Plan
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Review the suggestions and verify that they accurately describe
              your experience.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-xl">
              Improved Professional Summary
            </h3>

            <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-100">
              {result.summary || result.improved_summary || (
                <span className="text-slate-500">
                  The backend did not return a summary. Check its response
                  schema.
                </span>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-xl">
              Relevant Skills
            </h3>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-semibold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted mt-4">
                No skills were returned by the backend.
              </p>
            )}
          </div>

          {notes.length > 0 && (
            <div className="card p-6">
              <h3 className="font-bold text-xl">
                Improvement Recommendations
              </h3>

              <div className="space-y-3 mt-4">
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span className="font-bold mr-2">
                      {index + 1}.
                    </span>
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6 bg-emerald-50 border border-emerald-100">
            <h3 className="font-bold text-lg text-emerald-700">
              Review Before Using
            </h3>
            <p className="text-sm text-emerald-700 mt-2">
              Verify every suggested statement before copying it into your
              resume. This page displays suggestions returned by your backend;
              it does not automatically update or download your original file.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function CareerMentor() {
  const [resumeId] = useState(
    localStorage.getItem("latest_resume_id")
  );

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      if (!resumeId) {
        setError("Upload and analyze your resume first.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/api/resumes/${encodeURIComponent(resumeId)}/analyze`,
          { method: "POST" }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.detail ||
            data.message ||
            `Resume analysis failed (${response.status}).`
          );
        }

        // Accept common response formats.
        const rawSkills =
          data.skills ??
          data.extracted_skills ??
          data.analysis?.skills ??
          [];

        const normalizedSkills = Array.isArray(rawSkills)
          ? rawSkills
              .map((skill) => {
                if (typeof skill === "string") return skill.trim();

                if (skill && typeof skill === "object") {
                  return String(
                    skill.name ?? skill.skill ?? skill.skill_name ?? ""
                  ).trim();
                }

                return "";
              })
              .filter(Boolean)
          : [];

        if (!cancelled) {
          setSkills([...new Set(normalizedSkills)]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Could not load resume skills."
          );
          setSkills([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  const skillNames = skills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const has = (...names) =>
    names.some((name) => skillNames.includes(name));

  const hasPython = has("python");
  const hasFastAPI = has("fastapi", "fast api");
  const hasSQL = has("sql");
  const hasPostgreSQL = has("postgresql", "postgres");
  const hasJavaScript = has("javascript", "js");
  const hasReact = has("react", "react.js");
  const hasJava = has("java");
  const hasAWS = has("aws", "amazon web services");
  const hasDocker = has("docker");
  const hasGit = has("git");

  let careerTitle = "Software Developer";
  let careerIcon = "🎯";
  let careerDescription =
    "Build practical projects, strengthen your programming foundation, and gain hands-on development experience.";

  if (
    hasPython &&
    hasFastAPI &&
    (hasSQL || hasPostgreSQL)
  ) {
    careerTitle = "Python Backend Engineer";
    careerIcon = "🐍";
    careerDescription =
      "Your Python, API and database skills support a backend engineering path. Focus next on authentication, testing, deployment and system design.";
  } else if (hasJavaScript && hasReact) {
    careerTitle = "Frontend / Full-Stack Engineer";
    careerIcon = "💻";
    careerDescription =
      "Your JavaScript and React skills support frontend development. Strengthen API integration, databases, authentication and deployment.";
  } else if (hasJava && (hasSQL || hasPostgreSQL)) {
    careerTitle = "Java Backend Developer";
    careerIcon = "☕";
    careerDescription =
      "Your Java and database skills can support backend development. Consider learning Spring Boot, REST APIs, testing and security.";
  } else if (hasPython) {
    careerTitle = "Python Software Developer";
    careerIcon = "🐍";
    careerDescription =
      "Your Python skills can support software development, automation, data engineering or AI/ML. Build practical projects to explore these paths.";
  }

  const skillsToLearn = [];

  if (hasPython && !hasFastAPI) {
    skillsToLearn.push("FastAPI & REST API development");
  }

  if (!hasSQL && !hasPostgreSQL) {
    skillsToLearn.push("SQL & relational database design");
  }

  if (!hasDocker) {
    skillsToLearn.push("Docker & containerization");
  }

  if (!hasAWS) {
    skillsToLearn.push("AWS & cloud deployment");
  }

  if (!hasGit) {
    skillsToLearn.push("Git & professional version control");
  }

  skillsToLearn.push("System design & backend architecture");

  const projects = [
    {
      title: "Production-style REST API",
      description:
        "Build an API with authentication, validation, error handling and PostgreSQL."
    },
    {
      title: "Full-stack Job Portal",
      description:
        "Create an application using React, backend APIs and PostgreSQL."
    },
    {
      title: "JWT Authentication System",
      description:
        "Build secure login, registration and role-based access."
    },
    {
      title: "Cloud Deployment Project",
      description:
        "Containerize an application and deploy it using a cloud platform."
    }
  ];

  const certifications = [
    { title: "AWS Cloud Practitioner", level: "Beginner" },
    { title: "Python Programming", level: "Beginner" },
    {
      title: "PostgreSQL / Database Fundamentals",
      level: "Intermediate"
    },
    {
      title: "Docker & Containerization",
      level: "Intermediate"
    }
  ];

  let nextGoal =
    "Build and deploy a production-style application.";

  if (!hasDocker) {
    nextGoal =
      "Learn Docker and containerize a FastAPI + PostgreSQL application.";
  } else if (!hasAWS) {
    nextGoal =
      "Learn cloud deployment and deploy one of your projects.";
  } else {
    nextGoal =
      "Strengthen system design and build a scalable backend application.";
  }

  return (
    <>
      <PageTitle
        title="Career Mentor"
        sub="Personalized career guidance based on your resume and detected skills."
      />

      {!resumeId && (
        <div className="card p-5 mb-6 bg-amber-50 border border-amber-100">
          <h3 className="font-bold text-amber-800">
            Upload your resume first
          </h3>
          <p className="text-sm text-amber-700 mt-2">
            Upload and analyze a resume to receive personalized
            career recommendations.
          </p>
        </div>
      )}

      {error && (
        <div className="card p-5 mb-6 bg-red-50 border border-red-100">
          <p className="font-bold text-red-700">
            Could not load resume skills
          </p>
          <p className="text-sm text-red-700 mt-2">{error}</p>
          <p className="text-xs text-red-600 mt-2">
            Check the resume analysis endpoint in your backend.
          </p>
        </div>
      )}

      {loading ? (
        <div className="card p-10 text-center">
          <div className="text-3xl">🎯</div>
          <h2 className="font-bold text-xl mt-4">
            Loading your career profile...
          </h2>
        </div>
      ) : (
        <>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                  {careerIcon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-indigo-600 uppercase">
                    Recommended Career Path
                  </div>
                  <h2 className="font-black text-2xl mt-1">
                    {careerTitle}
                  </h2>
                </div>
              </div>

              <div className="mt-6 p-5 rounded-2xl bg-slate-50">
                <p className="text-sm text-slate-600 leading-6">
                  {careerDescription}
                </p>

                <h3 className="text-xs font-bold text-slate-500 uppercase mt-5">
                  Skills supporting this path
                </h3>

                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.length > 0 ? (
                    skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-white border rounded-lg text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">
                      {error
                        ? "Skills could not be loaded."
                        : "No skills detected yet. Analyze your resume first."}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase">
                Profile Snapshot
              </h3>
              <div className="text-3xl font-black mt-2">
                {skills.length}
              </div>
              <p className="text-sm text-slate-500">
                skills detected
              </p>

              <div className="mt-6">
                <p className="text-sm text-slate-500">
                  Technical foundation
                </p>
                <p className="font-bold mt-1">
                  {skills.length >= 8
                    ? "Strong"
                    : skills.length >= 4
                    ? "Growing"
                    : "Starting"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 mt-5">
                <p className="text-xs font-bold text-indigo-700">
                  Career direction
                </p>
                <p className="font-semibold text-indigo-900 mt-1">
                  {careerTitle}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6 mt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg">
                  Current Technical Skills
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Skills detected from your analyzed resume.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-bold">
                {skills.length} skills
              </span>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-2 bg-indigo-50 text-indigo-700 border rounded-xl text-sm font-semibold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-5 p-4 rounded-xl bg-slate-50 text-sm text-slate-500">
                {error
                  ? "Resume skills are unavailable until the API issue is fixed."
                  : "No skills detected yet. Analyze your resume first."}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="font-bold text-xl">
              Career Development Roadmap
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Recommended areas to strengthen your profile.
            </p>

            <div className="grid lg:grid-cols-3 gap-5">
              <div className="card p-6">
                <div className="text-2xl">📚</div>
                <h3 className="font-bold text-lg mt-4">
                  Skills to Learn
                </h3>
                <div className="mt-5 space-y-3">
                  {skillsToLearn.map((skill, index) => (
                    <div key={skill} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-700">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <div className="text-2xl">🏅</div>
                <h3 className="font-bold text-lg mt-4">
                  Recommended Certifications
                </h3>
                <div className="mt-5 space-y-4">
                  {certifications.map((cert) => (
                    <div
                      key={cert.title}
                      className="p-3 rounded-xl bg-slate-50 border"
                    >
                      <div className="font-semibold text-sm">
                        {cert.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {cert.level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <div className="text-2xl">🚀</div>
                <h3 className="font-bold text-lg mt-4">
                  Recommended Projects
                </h3>
                <div className="mt-5 space-y-4">
                  {projects.map((project) => (
                    <div key={project.title}>
                      <div className="font-semibold text-sm">
                        {project.title}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-5">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 mt-6 border border-indigo-100 bg-indigo-50">
            <div className="text-xs font-bold text-indigo-600 uppercase">
              Recommended Next Goal
            </div>
            <h3 className="font-bold text-lg mt-2">{nextGoal}</h3>
            <p className="text-sm text-slate-500 mt-2">
              Step 1 → Build → Deploy
            </p>
          </div>

          <div className="card p-5 mt-6 bg-slate-50 border">
            <h3 className="font-bold text-sm">
              Resume-based guidance
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-5">
              Recommendations are based on skills returned by your
              resume analysis. They do not guarantee a job or interview.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Resume ID: {resumeId || "Upload a resume first"}
            </p>
          </div>
        </>
      )}
    </>
  );
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE = `${API}/api`;

  const getToken = () => localStorage.getItem("access_token");

  const readResponse = async (response) => {
    const text = await response.text();

    if (!text) return {};

    try {
      return JSON.parse(text);
    } catch {
      return { detail: text };
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("Please log in to view your applications.");
        return;
      }

      const [applicationsResponse, jobsResponse] = await Promise.all([
        fetch(`${API_BASE}/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE}/jobs`),
      ]);

      const applicationsData = await readResponse(
        applicationsResponse
      );

      const jobsData = await readResponse(jobsResponse);

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsData.detail || "Could not load applications."
        );
      }

      if (!jobsResponse.ok) {
        throw new Error(
          jobsData.detail || "Could not load available jobs."
        );
      }

      setApplications(
        Array.isArray(applicationsData)
          ? applicationsData
          : applicationsData.applications || []
      );

      setJobs(
        Array.isArray(jobsData)
          ? jobsData
          : jobsData.jobs || []
      );
    } catch (e) {
      setError(
        e.message || "Could not connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    setMessage("");
    setError("");

    try {
      const token = getToken();
      const resumeId = localStorage.getItem("latest_resume_id");

      if (!token) {
        setError("Please log in before applying for a job.");
        return;
      }

      if (!resumeId || !Number.isInteger(Number(resumeId))) {
        setError("Please upload a resume before applying for a job.");
        return;
      }

      setApplyingJobId(jobId);

      const response = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: Number(jobId),
          resume_id: Number(resumeId),
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not apply for this job."
        );
      }

      setMessage(
        data.message || "Application submitted successfully!"
      );

      await loadData();
    } catch (e) {
      setError(
        e.message || "Could not connect to backend."
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="card p-8">
        Loading applications...
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Applications"
        sub="Track your job applications and application status."
      />

      {message && (
        <div className="mb-5 p-4 rounded-xl bg-green-50 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <div className="card p-6 mb-6">
        <div className="font-bold text-xl mb-5">
          Available Jobs
        </div>

        {jobs.length === 0 ? (
          <p className="muted">
            No jobs available right now.
          </p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const alreadyApplied = applications.some(
                (app) =>
                  Number(app.job_id) === Number(job.job_id)
              );

              return (
                <div
                  key={job.job_id}
                  className="p-5 rounded-xl border"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="font-bold text-lg">
                        {job.title}
                      </div>

                      <div className="muted text-sm mt-1">
                        {job.location || "Location not specified"}
                        {" · "}
                        {job.employment_type ||
                          "Employment type not specified"}
                      </div>

                      <div className="text-sm mt-3 whitespace-pre-line">
                        {job.description ||
                          "No job description provided."}
                      </div>
                    </div>

                    {alreadyApplied ? (
                      <span className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium">
                        Applied ✓
                      </span>
                    ) : (
                      <button
                        className="btn"
                        disabled={applyingJobId !== null}
                        onClick={() => applyForJob(job.job_id)}
                      >
                        {applyingJobId === job.job_id
                          ? "Applying..."
                          : "Apply"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card p-6">
        <div className="font-bold text-xl mb-5">
          My Applications
        </div>

        {applications.length === 0 ? (
          <p className="muted">
            You have not applied to any jobs yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.application_id}
                className="p-5 rounded-xl border"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg">
                      {app.job_title ||
                        `Job #${app.job_id}`}
                    </div>

                    <div className="muted text-sm mt-1">
                      Application #{app.application_id}
                    </div>

                    {app.applied_at && (
                      <div className="muted text-xs mt-2">
                        Applied on{" "}
                        {new Date(
                          app.applied_at
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-sm">
                    {app.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = `${API}/api`;

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Please log in to view your notifications.");
          return;
        }

        const response = await fetch(`${API_BASE}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();

        let data = {};

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = { detail: text };
          }
        }

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not load notifications."
          );
        }

        setNotifications(
          Array.isArray(data) ? data : data.notifications || []
        );
      } catch (e) {
        setError(e.message || "Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  if (loading) {
    return <div className="card p-8">Loading notifications...</div>;
  }

  return (
    <>
      <PageTitle
        title="Notifications"
        sub="Stay updated about your applications and career activity."
      />

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {!error && notifications.length === 0 ? (
        <div className="card p-8 text-center">
          <Bell
            size={40}
            className="mx-auto mb-3 text-slate-400"
          />

          <div className="font-bold text-lg">No notifications</div>

          <p className="muted mt-2">
            You are all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              className="card p-5"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Bell size={20} className="text-indigo-600" />
                </div>

                <div className="min-w-0">
                  <div className="font-bold">
                    {notification.title || "Notification"}
                  </div>

                  <div className="text-sm mt-1 whitespace-pre-line">
                    {notification.message || notification.body || ""}
                  </div>

                  <div className="muted text-xs mt-3">
                    {notification.created_at
                      ? new Date(
                          notification.created_at
                        ).toLocaleString()
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
function RecruiterDashboard() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(null);

  const loadApplicants = async () => {
  setLoading(true);
  setError('');

  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Please login again as a recruiter.');
    }

    const response = await fetch(
      `${API}/api/recruiter/applicants`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data.detail || `Failed to load applicants (${response.status}).`
      );
    }

    if (!Array.isArray(data)) {
      throw new Error('Unexpected applicants response from backend.');
    }

    setApplicants(data);
  } catch (error) {
    console.error('Applicants loading error:', error);
    setError(error.message || 'Could not load applicants.');
    setApplicants([]);
  } finally {
    setLoading(false);
  }
};
  
  const updateStatus = async (applicationId, status) => {
  setUpdating(applicationId);
  setError('');
  setMessage('');

  try {
    const token = localStorage.getItem('access_token');

    if (!token) {
      throw new Error('Please login again as a recruiter.');
    }

    const response = await fetch(
      `${API}/api/recruiter/applicants/${applicationId}/status?status=${encodeURIComponent(status)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    );

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }
    }

    if (!response.ok) {
      throw new Error(
        data.detail || `Could not update status (${response.status}).`
      );
    }

    setMessage(
      `Application #${applicationId} updated to ${status}.`
    );

    await loadApplicants();
  } catch (error) {
    console.error('Update applicant status error:', error);
    setError(error.message || 'Could not update application status.');
  } finally {
    setUpdating(null);
  }
};

  useEffect(() => {
    loadApplicants();
  }, []);

  if (loading) {
    return (
      <div className="card p-8">
        Loading applicants...
      </div>
    );
  }

  const activeApplications = applicants.filter(
    a =>
      a.status === 'applied' ||
      a.status === 'shortlisted' ||
      a.status === 'interview'
  ).length;

  return (
    <>
      <PageTitle
        title="Recruiter Dashboard"
        sub="View and manage applicants for your job postings."
      />

      {message && (
        <div className="mb-5 p-4 rounded-xl bg-green-50 text-green-700">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mb-5 p-4 rounded-xl bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-5 mb-6">

        <div className="card p-6">
          <div className="muted text-sm">
            Total Applicants
          </div>

          <div className="text-3xl font-bold mt-2">
            {applicants.length}
          </div>
        </div>

        <div className="card p-6">
          <div className="muted text-sm">
            Applications
          </div>

          <div className="text-3xl font-bold mt-2">
            {applicants.length}
          </div>
        </div>

        <div className="card p-6">
          <div className="muted text-sm">
            Active Applications
          </div>

          <div className="text-3xl font-bold mt-2">
            {activeApplications}
          </div>
        </div>

      </div>

      <div className="card p-6">

        <div className="font-bold text-xl mb-5">
          Applicants
        </div>

        {applicants.length === 0 ? (

          <p className="muted">
            No applicants yet.
          </p>

        ) : (

          <div className="space-y-4">

            {applicants.map(app => (

              <div
                key={app.application_id}
                className="p-5 rounded-xl border"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <div className="font-bold text-lg">
                      {app.applicant_name}
                    </div>

                    <div className="muted text-sm mt-1">
                      {app.applicant_email}
                    </div>
                  </div>

                  <select
                    value={app.status}
                    disabled={updating === app.application_id}
                    onChange={e =>
                      updateStatus(
                        app.application_id,
                        e.target.value
                      )
                    }
                    className="input text-sm"
                  >

                    <option value="applied">
                      Applied
                    </option>

                    <option value="shortlisted">
                      Shortlisted
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                    <option value="interview">
                      Interview
                    </option>

                  </select>

                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-5 text-sm">

                  <div>
                    <div className="muted">
                      Job
                    </div>

                    <div className="font-semibold mt-1">
                      {app.job_title}
                    </div>
                  </div>

                  <div>
                    <div className="muted">
                      Resume
                    </div>

                    <div className="font-semibold mt-1">
                      {app.resume_name}
                    </div>
                  </div>

                  <div>
                    <div className="muted">
                      Application ID
                    </div>

                    <div className="font-semibold mt-1">
                      #{app.application_id}
                    </div>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
} 

function Interviews() {
  const [interviews, setInterviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [reschedulingId, setReschedulingId] = React.useState(null);
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');
  const [newMeetingLink, setNewMeetingLink] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState(false);

  const API = 'http://127.0.0.1:8000/api/recruiter/interviews';

  const getToken = () => localStorage.getItem('access_token');

  const loadInterviews = async () => {
    setLoading(true);
    setError('');

    const token = getToken();

    if (!token) {
      setError('Please log in again to view interviews.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Failed to load interviews.');
      }

      const data = await res.json();

      // Support either an array or a wrapped API response.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.interviews)
        ? data.interviews
        : Array.isArray(data.data)
        ? data.data
        : null;

      if (!list) {
        throw new Error(
          'Unexpected response from the interviews API. Check the backend response.'
        );
      }

      setInterviews(list);
    } catch (err) {
      setError(err.message || 'Unable to load interviews.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadInterviews();
  }, []);

  const formatDate = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return 'Date unavailable';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date || Number.isNaN(new Date(date).getTime())) {
      return 'Time unavailable';
    }

    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startReschedule = (interview) => {
    const date = new Date(interview.scheduled_date);

    if (Number.isNaN(date.getTime())) {
      alert('The existing interview date is invalid.');
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    setReschedulingId(interview.interview_id);
    setNewDate(`${year}-${month}-${day}`);
    setNewTime(`${hours}:${minutes}`);
    setNewMeetingLink(interview.meeting_link || '');
  };

  const cancelReschedule = () => {
    setReschedulingId(null);
    setNewDate('');
    setNewTime('');
    setNewMeetingLink('');
  };

  const saveReschedule = async (interviewId) => {
    if (!newDate || !newTime) {
      alert('Please select a new date and time.');
      return;
    }

    const scheduledDate = `${newDate}T${newTime}:00`;
    const token = getToken();

    if (!token) {
      alert('Please log in again.');
      return;
    }

    const params = new URLSearchParams();
    params.append('scheduled_date', scheduledDate);
    params.append('meeting_link', newMeetingLink);

    setActionLoading(true);

    try {
      const res = await fetch(
        `${API}/${interviewId}/reschedule?${params.toString()}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Failed to reschedule interview.');
      }

      alert('Interview rescheduled successfully.');
      cancelReschedule();
      await loadInterviews();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelInterview = async (interviewId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this interview?'
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      alert('Please log in again.');
      return;
    }

    setActionLoading(true);

    try {
      const res = await fetch(`${API}/${interviewId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || 'Failed to cancel interview.');
      }

      alert('Interview cancelled successfully.');
      await loadInterviews();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const scheduledCount = interviews.filter(
    (item) => item.status === 'scheduled'
  ).length;

  const onlineCount = interviews.filter(
    (item) =>
      item.interview_type === 'online' &&
      item.status !== 'cancelled'
  ).length;

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '20px'
  };

  const buttonStyle = {
    background: '#111827',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Interviews</h1>
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h1 style={{ marginBottom: '6px' }}>Interviews</h1>
          <p style={{ color: '#64748b', marginTop: 0 }}>
            Manage and track your scheduled candidate interviews.
          </p>
        </div>

        <button
          onClick={loadInterviews}
          disabled={loading || actionLoading}
          style={buttonStyle}
        >
          Refresh Interviews
        </button>
      </div>

      {error && (
        <div
          style={{
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '16px',
            marginTop: '20px'
          }}
        >
          <p style={{ marginTop: 0 }}>{error}</p>
          <button
            onClick={loadInterviews}
            style={{
              ...buttonStyle,
              background: '#b91c1c'
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!error && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '18px',
              margin: '28px 0'
            }}
          >
            <div style={cardStyle}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                Total Interviews
              </div>
              <div style={{ fontSize: '30px', fontWeight: '700', marginTop: '8px' }}>
                {interviews.length}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                Scheduled
              </div>
              <div style={{ fontSize: '30px', fontWeight: '700', marginTop: '8px' }}>
                {scheduledCount}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                Online Interviews
              </div>
              <div style={{ fontSize: '30px', fontWeight: '700', marginTop: '8px' }}>
                {onlineCount}
              </div>
            </div>
          </div>

          {interviews.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '50px 20px'
              }}
            >
              <h2>No interviews found</h2>
              <p style={{ color: '#64748b' }}>
                No interview records were returned for your recruiter
                account.
              </p>
              <p style={{ color: '#64748b' }}>
                Go to Applicants, select a candidate, and schedule an
                interview. Then refresh this page.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ marginBottom: '16px' }}>
                All Interviews
              </h2>

              <div style={{ display: 'grid', gap: '18px' }}>
                {interviews.map((interview) => (
                  <div
                    key={interview.interview_id}
                    style={{
                      ...cardStyle,
                      padding: '24px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '20px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                            marginBottom: '8px'
                          }}
                        >
                          <h3 style={{ margin: 0 }}>
                            {interview.candidate_name || 'Candidate'}
                          </h3>

                          <span
                            style={{
                              background:
                                interview.status === 'cancelled'
                                  ? '#fee2e2'
                                  : '#dcfce7',
                              color:
                                interview.status === 'cancelled'
                                  ? '#b91c1c'
                                  : '#166534',
                              padding: '5px 10px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {interview.status || 'Unknown'}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 5px', color: '#475569' }}>
                          {interview.candidate_email || 'No email available'}
                        </p>

                        <p style={{ margin: 0, fontWeight: '600' }}>
                          {interview.job_title || 'Job title unavailable'}
                        </p>
                      </div>

                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '12px',
                          padding: '12px 16px'
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          Interview Date
                        </div>
                        <strong>
                          {formatDate(interview.scheduled_date)}
                        </strong>
                        <div style={{ fontSize: '14px', color: '#475569', marginTop: '3px' }}>
                          {formatTime(interview.scheduled_date)}
                        </div>
                      </div>
                    </div>

                    {reschedulingId === interview.interview_id ? (
                      <div
                        style={{
                          marginTop: '22px',
                          padding: '20px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <h3 style={{ marginTop: 0 }}>
                          Reschedule Interview
                        </h3>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '15px'
                          }}
                        >
                          <div>
                            <label>New Date</label>
                            <input
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                marginTop: '6px',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>

                          <div>
                            <label>New Time</label>
                            <input
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                marginTop: '6px',
                                boxSizing: 'border-box'
                              }}
                            />
                          </div>
                        </div>

                        <div style={{ marginTop: '15px' }}>
                          <label>Meeting Link</label>
                          <input
                            type="url"
                            value={newMeetingLink}
                            onChange={(e) => setNewMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px',
                              marginTop: '6px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '18px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <button
                            onClick={() => saveReschedule(interview.interview_id)}
                            disabled={actionLoading}
                            style={buttonStyle}
                          >
                            {actionLoading ? 'Saving...' : 'Save Changes'}
                          </button>

                          <button
                            onClick={cancelReschedule}
                            disabled={actionLoading}
                            style={{
                              ...buttonStyle,
                              background: '#ffffff',
                              color: '#334155',
                              border: '1px solid #cbd5e1'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '22px',
                          paddingTop: '18px',
                          borderTop: '1px solid #f1f5f9',
                          gap: '15px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span
                          style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            padding: '7px 12px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          {interview.interview_type || 'Interview'}
                        </span>

                        {interview.status !== 'cancelled' ? (
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {interview.meeting_link && (
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  ...buttonStyle,
                                  textDecoration: 'none',
                                  display: 'inline-block'
                                }}
                              >
                                Join Meeting
                              </a>
                            )}

                            <button
                              onClick={() => cancelInterview(interview.interview_id)}
                              disabled={actionLoading}
                              style={{
                                ...buttonStyle,
                                background: '#ffffff',
                                color: '#dc2626',
                                border: '1px solid #fecaca'
                              }}
                            >
                              Cancel Interview
                            </button>

                            <button
                              onClick={() => startReschedule(interview)}
                              disabled={actionLoading}
                              style={{
                                ...buttonStyle,
                                background: '#ffffff',
                                color: '#111827',
                                border: '1px solid #cbd5e1'
                              }}
                            >
                              Reschedule
                            </button>
                          </div>
                        ) : (
                          <strong style={{ color: '#dc2626' }}>
                            Interview cancelled
                          </strong>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Analytics() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('arm_user') || '{}');

    console.log('Logged-in user:', user);
    console.log('Logged-in role:', user.role);
    const endpoint =
  user.role?.toLowerCase() === 'admin'
    ? 'http://127.0.0.1:8000/api/dashboard/stats'
    : 'http://127.0.0.1:8000/api/recruiter/analytics';

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || 'Failed to load analytics');
        }

        return res.json();
      })
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Analytics error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Analytics</h1>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Analytics</h1>
        <p>{error}</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('arm_user') || '{}');

  if (user.role?.toLowerCase() === 'admin') {
    return (
      <div className="page">
        <h1>Platform Analytics</h1>
        <p>System-wide analytics from PostgreSQL.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Active Jobs</h3>
            <strong>{data.active_jobs ?? 0}</strong>
          </div>

          <div className="stat-card">
            <h3>Applicants</h3>
            <strong>{data.applicants ?? 0}</strong>
          </div>

          <div className="stat-card">
            <h3>Interviews</h3>
            <strong>{data.interviews ?? 0}</strong>
          </div>

          <div className="stat-card">
            <h3>Resume Views</h3>
            <strong>{data.resume_views ?? 0}</strong>
          </div>
        </div>

        <div className="card">
          <h2>Administrator Analytics</h2>
          <p>
            This dashboard provides a system-level view of jobs,
            applicants, interviews and resume activity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Recruitment Analytics</h1>
      <p>Recruitment analytics from PostgreSQL.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Jobs</h3>
          <strong>{data.total_jobs ?? 0}</strong>
        </div>

        <div className="stat-card">
          <h3>Active Jobs</h3>
          <strong>{data.active_jobs ?? 0}</strong>
        </div>

        <div className="stat-card">
          <h3>Total Applicants</h3>
          <strong>{data.total_applicants ?? 0}</strong>
        </div>
      </div>

      <div className="card">
        <h2>Applications by Status</h2>

        {data.applications_by_status?.length === 0 ? (
          <p>No application data available.</p>
        ) : (
          data.applications_by_status?.map((item) => (
            <div
              key={item.status}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}
            >
              <span>{item.status}</span>
              <strong>{item.count}</strong>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>Applicants by Job</h2>

        {data.applicants_by_job?.length === 0 ? (
          <p>No job applicant data available.</p>
        ) : (
          data.applicants_by_job?.map((item) => (
            <div
              key={item.job_title}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}
            >
              <span>{item.job_title}</span>
              <strong>{item.applicants}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch('api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || 'Failed to load users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin users error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Manage Users</h1>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Manage Users</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Manage Users</h1>
      <p>Monitor registered users.</p>

      <div className="card">
        <h2>Registered Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminJobs() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch('api/jobs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || 'Failed to load jobs');
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin jobs error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Manage Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Manage Jobs</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Manage Jobs</h1>
      <p>Monitor jobs posted on the platform.</p>

      <div className="card">
        <h2>Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Job Title</th>
                <th>Location</th>
                <th>Employment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.job_id}</td>
                  <td>{job.title}</td>
                  <td>{job.location || '-'}</td>
                  <td>{job.employment_type || '-'}</td>
                  <td>
                    {job.status
                      ? job.status.charAt(0).toUpperCase() +
                        job.status.slice(1).toLowerCase()
                      : 'Published'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminResumes() {
  const [resumes, setResumes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch('api/admin/resumes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || 'Failed to load resumes');
        }
        return res.json();
      })
      .then((data) => {
        setResumes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin resumes error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Manage Resumes</h1>
        <p>Loading resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Manage Resumes</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Manage Resumes</h1>
      <p>Monitor resumes uploaded to the platform.</p>

      <div className="card">
        <h2>Uploaded Resumes</h2>

        {resumes.length === 0 ? (
          <p>No resumes found.</p>
        ) : (
          <table>
            <thead>
  <tr>
    <th>ID</th>
    <th>Candidate</th>
    <th>Resume Name</th>
    <th>File Type</th>
    <th>Score</th>
    <th>Status</th>
    <th>Uploaded</th>
  </tr>
</thead>

<tbody>
  {resumes.map((resume) => (
    <tr key={resume.resume_id}>
      <td>{resume.resume_id}</td>
      <td>{resume.candidate_name || '-'}</td>
      <td>{resume.resume_name || '-'}</td>
      <td>{resume.file_type || '-'}</td>
      <td>
        {resume.overall_score !== null &&
        resume.overall_score !== undefined
          ? `${Math.round(resume.overall_score)}/100`
          : 'Not analyzed'}
      </td>
      <td>{resume.status || '-'}</td>
      <td>
        {resume.uploaded_at
          ? new Date(resume.uploaded_at).toLocaleDateString()
          : '-'}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
}

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);

  const [form, setForm] = React.useState({
    title: '',
    message: '',
    category: 'notice',
    target_role: '',
    expires_at: ''
  });

  const [publishing, setPublishing] = React.useState(false);
  const [publishError, setPublishError] = React.useState('');

  const handlePublish = async () => {
    if (!form.title.trim()) {
      setPublishError('Title is required');
      return;
    }

    if (!form.message.trim()) {
      setPublishError('Message is required');
      return;
    }

    setPublishing(true);
    setPublishError('');

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          category: form.category,
          target_role: form.target_role || 'all',
          expires_at: form.expires_at || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Failed to publish announcement'
        );
      }

      setAnnouncements((prev) => [data, ...prev]);

      setForm({
        title: '',
        message: '',
        category: 'notice',
        target_role: '',
        expires_at: ''
      });

      setShowForm(false);
      setPublishError('');
    } catch (err) {
      console.error('Publish announcement error:', err);
      setPublishError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('access_token');

    fetch('api/admin/announcements', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text();
          throw new Error(
            body || 'Failed to load announcements'
          );
        }

        return res.json();
      })
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Admin announcements error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Announcements</h1>
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Announcements</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Announcements</h1>

      <p>
        Manage platform announcements and notifications.
      </p>

      <div className="card">

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h2>Platform Announcements</h2>

            <p>
              Create and manage announcements for platform users.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setPublishError('');
            }}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showForm
              ? 'Close Form'
              : '+ Create Announcement'}
          </button>
        </div>

        {showForm && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '10px'
            }}
          >
            <h3>Create Announcement</h3>

            <div style={{ marginTop: '16px' }}>

              <label>Title</label>

              <input
                type="text"
                placeholder="Enter announcement title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  marginBottom: '14px'
                }}
              />

              <label>Message</label>

              <textarea
                placeholder="Enter announcement message"
                rows="4"
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  marginBottom: '14px'
                }}
              />

              <label>Category</label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  marginBottom: '14px'
                }}
              >
                <option value="placement">
                  Placement
                </option>

                <option value="internship">
                  Internship
                </option>

                <option value="event">
                  Event
                </option>

                <option value="recruitment_drive">
                  Recruitment Drive
                </option>

                <option value="platform">
                  Platform
                </option>

                <option value="notice">
                  Notice
                </option>
              </select>

              <label>Target Role</label>

              <select
                value={form.target_role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    target_role: e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  marginBottom: '14px'
                }}
              >
                <option value="">
                  All Users
                </option>

                <option value="student">
                  Students
                </option>

                <option value="job_seeker">
                  Job Seekers
                </option>

                <option value="recruiter">
                  Recruiters
                </option>
              </select>

              <label>Expiry Date</label>

              <input
                type="date"
                value={form.expires_at}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expires_at: e.target.value
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '6px',
                  marginBottom: '14px'
                }}
              />

              {publishError && (
                <p
                  style={{
                    color: 'red',
                    marginTop: '10px'
                  }}
                >
                  {publishError}
                </p>
              )}

              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  marginTop: '18px',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: publishing
                    ? 'not-allowed'
                    : 'pointer',
                  fontWeight: '600'
                }}
              >
                {publishing
                  ? 'Publishing...'
                  : 'Publish Announcement'}
              </button>

            </div>
          </div>
        )}

        <div style={{ marginTop: '28px' }}>

          {announcements.length === 0 ? (
            <p>No announcements found.</p>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Category</th>
                  <th>Target Role</th>
                  <th>Created</th>
                  <th>Expires</th>
                </tr>
              </thead>

              <tbody>
                {announcements.map((announcement) => (
                  <tr
                    key={announcement.announcement_id}
                  >
                    <td>
                      {announcement.announcement_id}
                    </td>

                    <td>
                      {announcement.title}
                    </td>

                    <td>
                      {announcement.message}
                    </td>

                    <td>
                      {announcement.category || '-'}
                    </td>

                    <td>
                      {announcement.target_role || 'All'}
                    </td>

                    <td>
                      {announcement.created_at
                        ? new Date(
                            announcement.created_at
                          ).toLocaleDateString()
                        : '-'}
                    </td>

                    <td>
                      {announcement.expires_at
                        ? new Date(
                            announcement.expires_at
                          ).toLocaleDateString()
                        : 'No expiry'}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

      </div>
    </div>
  );
}

function CompanyProfile() {

  const user = useAuth();

  return (
    <div className="page">
      <PageTitle
        title="Company Profile"
        sub="View your company information and recruiter profile."
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Building2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">TechNova Solutions</h2>
              <p className="muted">Software · Hyderabad</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <div className="muted text-sm">Company Name</div>
              <div className="font-semibold mt-1">TechNova Solutions</div>
            </div>
            <div>
              <div className="muted text-sm">Industry</div>
              <div className="font-semibold mt-1">Software</div>
            </div>
            <div>
              <div className="muted text-sm">Location</div>
              <div className="font-semibold mt-1">Hyderabad</div>
            </div>
            <div>
              <div className="muted text-sm">Website</div>
              <div className="font-semibold mt-1">https://technova.example.com</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="muted text-sm">Company Description</div>
            <p className="mt-2 leading-7">
              A software company focused on modern web and AI solutions.
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="font-bold text-lg">Recruiter Profile</div>
          <div className="mt-5 space-y-4">
            <div>
              <div className="muted text-sm">Recruiter</div>
              <div className="font-semibold mt-1">{user?.name || 'HR Manager'}</div>
            </div>
            <div>
              <div className="muted text-sm">Designation</div>
              <div className="font-semibold mt-1">HR Manager</div>
            </div>
            <div>
              <div className="muted text-sm">Role</div>
              <div className="font-semibold mt-1">Recruiter</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostJob() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: 'Hyderabad',
    employment_type: 'full_time',
    experience_required: 0,
    industry: 'Software',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Job title and job description are required.');
      return;
    }

    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('Please log in again using your recruiter account.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/jobs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...form,
            title: form.title.trim(),
            description: form.description.trim(),
            experience_required: Number(form.experience_required),
          }),
        }
      );

      const text = await response.text();
      let data = null;

      if (text.trim()) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Backend returned an invalid response (${response.status}).`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Could not publish job (${response.status}).`
        );
      }

      setMessage('Job published successfully.');

      setForm({
        title: '',
        description: '',
        location: 'Hyderabad',
        employment_type: 'full_time',
        experience_required: 0,
        industry: 'Software',
      });
    } catch (err) {
      console.error('Publish Job error:', err);

      setError(
        err instanceof TypeError
          ? 'Could not connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000.'
          : err.message || 'Could not publish job.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <PageTitle
        title="Post Job"
        sub="Create a job opportunity and publish it for candidates."
      />

      <form onSubmit={submit} className="card p-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold">Job Title</label>
            <input
              className="input w-full mt-2"
              placeholder="e.g. Python Backend Developer"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Industry</label>
            <input
              className="input w-full mt-2"
              value={form.industry}
              onChange={(e) => update('industry', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Location</label>
            <input
              className="input w-full mt-2"
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              Employment Type
            </label>
            <select
              className="input w-full mt-2"
              value={form.employment_type}
              onChange={(e) =>
                update('employment_type', e.target.value)
              }
            >
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">
              Experience Required (years)
            </label>
            <input
              className="input w-full mt-2"
              type="number"
              min="0"
              value={form.experience_required}
              onChange={(e) =>
                update('experience_required', e.target.value)
              }
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold">
            Job Description
          </label>
          <textarea
            className="input w-full mt-2"
            rows="8"
            placeholder="Describe responsibilities, required skills, technologies, qualifications and other job details."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </div>

        {message && (
          <p className="text-green-600 mt-4 font-semibold">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 mt-4 font-semibold">
            {error}
          </p>
        )}

        <button
          className="btn primary mt-5"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Job'}
        </button>
      </form>
    </div>
  );
}
function Placeholder({ title, desc }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Landing />}
      />


      <Route
        path="/login"
        element={<Login />}
      />

      <Route
  path="/register"
  element={<Register />}
/>
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

      <Route
        path="*"
        element={

          <Shell>

            <Routes>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/company"
                element={<CompanyProfile />}
              />

              <Route
                path="/post-job"
                element={<PostJob />}
              />

              <Route
  path="/admin/users"
  element={<AdminUsers />}
/>

              <Route 
  path="/admin/jobs" 
  element={<AdminJobs />} 
/>

<Route 
  path="/admin/announcements" 
  element={<AdminAnnouncements />} 
/>

                <Route 
  path="/admin/resumes" 
  element={<AdminResumes />} 
/>

              <Route
                path="/jobs"
                element={<Jobs />}
              />


              <Route
                path="/resume"
                element={<Resume />}
              />
              
              <Route path="/notifications" element={<Notifications />} />

              <Route path="/improve" element={<ResumeImprover/>}/>


              <Route path="/matches" element={<JobMatches/>}/>


              <Route path="/mentor" element={<CareerMentor/>}/>

              <Route path="/applications"element={<Applications/>}/>



              <Route path="/applicants" element={<RecruiterDashboard/>}/>

              <Route path="/candidates" element={<Candidates />} />


              <Route
                path="/candidates"
                element={
                  <Placeholder
                    title="Find Candidates"
                    desc="Search database-backed candidate profiles using skills or a complete job description."
                  />
                }
              />

              <Route path="/interviews" element={<Interviews />} />



              <Route
                path="/analytics"
                element={<Analytics />}
              />


              <Route
                path="/notifications"
                element={
                  <Placeholder
                    title="Notifications"
                    desc="Database-backed alerts and announcements."
                  />
                }
              />


              <Route
                path="*"
                element={<Dashboard />}
              />

            </Routes>

          </Shell>

        }

      />

    </Routes>

  );

}


createRoot(
  document.getElementById('root')
).render(

  <BrowserRouter>

    <App />

  </BrowserRouter>

);
