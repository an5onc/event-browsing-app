import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface CreateAccountValues {
  email: string;
  password: string;
}

export interface CreateAccountProps {
  onSuccess?: (values: CreateAccountValues) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * CreateAccount
 * Minimal, self-contained signup form for Bear ID accounts.
 * Hook up to your AuthContext/API in the onSubmit handler.
 */
const ALLOWED_DOMAINS = ['bears.unco.edu', 'unco.edu'];

const sendVerification = async (email: string) => {
  try {
    await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new Error('Failed to send verification email.');
  }
};

const CreateAccountForm: React.FC<CreateAccountProps> = ({ onSuccess, onCancel, className = '' }) => {
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  useEffect(() => {
    // If navigation provided a freshSignup flag, clear any previous values
    // and prevent showing prior credentials.
    if ((location.state as any)?.freshSignup) {
      setEmail('');
      setPassword('');
      setConfirm('');
    }
  }, [location.state]);

  const pwRules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPwValid = Object.values(pwRules).every(Boolean);

  const validate = (): string | null => {
    let formErr: string | null = null;

    // Email
    if (!email.trim()) {
      setEmailErr('Email is required.');
      formErr = formErr || 'Fix errors and try again.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setEmailErr('Enter a valid email address.');
      formErr = formErr || 'Fix errors and try again.';
    } else {
      const domain = email.trim().split('@')[1]?.toLowerCase();
      if (!ALLOWED_DOMAINS.includes(domain)) {
        setEmailErr('Use your official UNCO Bear email (…@bears.unco.edu).');
        formErr = formErr || 'Fix errors and try again.';
      } else {
        setEmailErr(null);
      }
    }

    // Password
    if (!isPwValid) {
      setPasswordErr('Password does not meet requirements.');
      formErr = formErr || 'Fix errors and try again.';
    } else {
      setPasswordErr(null);
    }

    // Confirm
    if (confirm !== password) {
      formErr = formErr || 'Fix errors and try again.';
    }

    return formErr;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) { setError(msg); return; }
    setError(null);
    setSubmitting(true);
    try {
      // TODO: integrate with AuthContext/API here to create account
      // Example:
      // await auth.signUp({ email, password });
      await new Promise(res => setTimeout(res, 400));

      // Send verification email
      try {
        await sendVerification(email.trim());
        setVerificationSent(true);
        onSuccess?.({ email: email.trim(), password });
      } catch {
        setError('Could not send verification email. Please try again.');
      }
    } catch (err) {
      setError('Could not create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setSendingVerification(true);
    try {
      await sendVerification(email.trim());
    } catch {
      setError('Could not send verification email. Please try again.');
    } finally {
      setSendingVerification(false);
    }
  };

  if (verificationSent) {
    return (
      <div className={`max-w-md ${className}`}>
        <h1 className="text-2xl font-semibold mb-4 text-brand-blue">Verify your email</h1>
        <div className="mb-4 rounded border border-green-300 bg-green-50 p-3 text-green-700">
          A verification email has been sent to <strong>{email.trim()}</strong>. Please check your UNCO inbox and click the link to activate your account.
        </div>
        {error && (
          <div className="mb-4 rounded border border-brand-gold/60 bg-brand-butter p-3 text-brand-blue">{error}</div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-brand-gold text-brand-blue hover:bg-brand-honeycomb focus:outline-none focus:ring-2 focus:ring-brand-gold"
            onClick={onResend}
            disabled={sendingVerification}
          >
            {sendingVerification ? 'Resending…' : 'Resend verification email'}
          </button>
          {onCancel && (
            <button type="button" className="px-4 py-2 rounded-md border border-brand-bluegrey text-brand-blue hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-gold" onClick={onCancel}>Cancel</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`max-w-md ${className}`} noValidate autoComplete="off">

      {error && (
        <div className="mb-4 rounded border border-brand-gold/60 bg-brand-butter p-3 text-brand-blue">{error}</div>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1 text-brand-bluegrey">Email</label>
        <input
          id="email"
          name="signup-email"
          type="email"
          autoComplete="off"
          className="w-full rounded border border-brand-bluegrey px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
          placeholder="you@bears.unco.edu"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
          required
        />
        {emailErr && <p className="mt-1 text-xs text-red-600">{emailErr}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-1 text-brand-bluegrey">Password</label>
        <div className="relative">
          <input
            id="password"
            name="new-password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            className="w-full rounded border border-brand-bluegrey px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPasswordErr(null); if (confirm) {} }}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:underline"
            onClick={() => setShowPwd(v => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        </div>
        <ul className="mt-2 text-xs space-y-1">
          <li className={pwRules.length ? 'text-green-600' : 'text-brand-bluegrey'}>• At least 8 characters</li>
          <li className={pwRules.upper ? 'text-green-600' : 'text-brand-bluegrey'}>• One uppercase letter</li>
          <li className={pwRules.lower ? 'text-green-600' : 'text-brand-bluegrey'}>• One lowercase letter</li>
          <li className={pwRules.digit ? 'text-green-600' : 'text-brand-bluegrey'}>• One number</li>
          <li className={pwRules.special ? 'text-green-600' : 'text-brand-bluegrey'}>• One symbol (!@#$…)</li>
        </ul>
        {passwordErr && <p className="mt-1 text-xs text-red-600">{passwordErr}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="confirm" className="block text-sm font-medium mb-1 text-brand-bluegrey">Confirm password</label>
        <input
          id="confirm"
          name="new-password-confirm"
          type={showPwd ? 'text' : 'password'}
          autoComplete="new-password"
          className="w-full rounded border border-brand-bluegrey px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); }}
          required
        />
        {confirm !== password && confirm && (
          <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${isPwValid && !emailErr && confirm === password && email.trim() ? 'bg-brand-gold text-brand-blue hover:bg-brand-honeycomb' : 'bg-brand-light text-brand-bluegrey cursor-not-allowed'}`} 
          disabled={!isPwValid || !!emailErr || confirm !== password || !email.trim() || submitting}
        >
          {submitting ? 'Creating…' : 'Create account'}
        </button>
        {onCancel && (
          <button type="button" className="px-4 py-2 rounded-md border border-brand-bluegrey text-brand-blue hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-gold" onClick={onCancel}>Cancel</button>
        )}
      </div>

      <p className="mt-4 text-xs text-brand-bluegrey">
            By creating an account you agree to the{' '}
            <a className="font-semibold ml-1" href="https://www.unco.edu/student-affairs/policy/" target="_blank" rel="noopener noreferrer">
              UNC Guidelines & Policies
            </a>{' '}
            and{' '}
            <a className="font-semibold ml-1" href="https://www.unco.edu/trustees/board-policy-manual.aspx" target="_blank" rel="noopener noreferrer">
              UNC Board Policy Manual
            </a>. You also agree to receive emails related to your account and events. You can opt out at any time via your account settings or by clicking the "unsubscribe" link in any email.      
        </p>
    </form>
  );
};

const CreateAccountPage: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-brand-blue via-brand-blue to-brand-bluegrey/10 pt-16 pb-12 min-h-screen">
      <div className="mx-auto max-w-xl px-4">
        <div className="bg-white rounded-lg border border-brand-light shadow-md p-6">
          <h1 className="text-3xl font-bold text-brand-blue mb-2">Create Account</h1>
          <p className="text-sm text-brand-bluegrey mb-4">Use your Bear email to sign up.</p>
          <CreateAccountForm />
        </div>
      </div>
    </section>
  );
};

export default CreateAccountPage;
