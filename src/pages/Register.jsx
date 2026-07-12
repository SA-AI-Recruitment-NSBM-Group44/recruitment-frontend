import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, ROLE_HOME } from '../auth/AuthContext.jsx';
import AuthBrandPanel from './AuthBrandPanel.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirm: '', role: 'Candidate'
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 3) next.fullName = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role
      });
      navigate(ROLE_HOME[user.role] ?? '/');
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Could not create the account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <AuthBrandPanel />
      <div className="auth-panel">
        <div className="auth-card">
          <h2>Create your account</h2>
          <p className="sub">Pick your role — the portal adapts to it.</p>
          {apiError && <div className="form-alert">{apiError}</div>}
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" value={form.fullName} onChange={set('fullName')} autoComplete="name" />
              {errors.fullName && <div className="error">{errors.fullName}</div>}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="field">
              <label htmlFor="role">I am a</label>
              <select id="role" value={form.role} onChange={set('role')}>
                <option value="Candidate">Candidate — looking for jobs</option>
                <option value="Recruiter">Recruiter — hiring talent</option>
                <option value="HiringManager">Hiring manager — making decisions</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="field">
              <label htmlFor="confirm">Confirm password</label>
              <input id="confirm" type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
              {errors.confirm && <div className="error">{errors.confirm}</div>}
            </div>
            <button className="btn-primary" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          </form>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
