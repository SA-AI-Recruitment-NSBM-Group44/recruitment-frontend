import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../auth/AuthContext.jsx';
import AuthBrandPanel from './AuthBrandPanel.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      navigate(ROLE_HOME[user.role] ?? '/');
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Could not sign in. Is the API running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthBrandPanel />
      <div className="auth-panel">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="sub">Welcome back. Your pipeline is waiting.</p>
          {apiError && <div className="form-alert">{apiError}</div>}
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={form.password} onChange={set('password')} autoComplete="current-password" />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <button className="btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
