import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { writeAccess } from "../access";
import { authenticateAccount, createAccount } from "../accounts";

function PasswordField({ id, label, value, onChange, visible, onToggle, autoComplete }) {
  return (
    <div className="login-password-field">
      <label className="login-label text-sm font-bold" htmlFor={id}>{label}</label>
      <span className="login-password-control">
        <input
          id={id}
          className="login-input w-full rounded-lg border px-3 py-2.5 pr-12 font-normal"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength="8"
          value={value}
          onChange={onChange}
          required
        />
        <button
          className="login-password-toggle"
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={onToggle}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="m3 3 18 18" />}
          </svg>
        </button>
      </span>
    </div>
  );
}

function Login() {
  const [role, setRole] = useState("client");
  const [mode, setMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [clientConfirmPassword, setClientConfirmPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const password = role === "admin" ? adminPassword : clientPassword;
  const setPassword = role === "admin" ? setAdminPassword : setClientPassword;
  const confirmPassword = role === "admin" ? adminConfirmPassword : clientConfirmPassword;
  const setConfirmPassword = role === "admin" ? setAdminConfirmPassword : setClientConfirmPassword;
  const isClientSignup = role === "client" && mode === "signup";
  const isAdminSignup = role === "admin" && mode === "signup";
  const isSignup = isClientSignup || isAdminSignup;

  const selectRole = nextRole => {
    setRole(nextRole);
    setMode("login");
    setClientPassword("");
    setAdminPassword("");
    setClientConfirmPassword("");
    setAdminConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
  };

  const toggleSignupMode = () => {
    setMode(current => current === "signup" ? "login" : "signup");
    setClientPassword("");
    setAdminPassword("");
    setClientConfirmPassword("");
    setAdminConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
  };

  const submit = async event => {
    event.preventDefault();
    setError("");

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      if (isSignup) {
        const account = await createAccount({
          role,
          username,
          email: isClientSignup ? email : "",
          password
        });
        writeAccess({ role: account.role, email: account.email });
        navigate(account.role === "admin" ? "/requests.html" : "/index.html");
        return;
      }

      const account = await authenticateAccount({
        role,
        identifier: role === "client" ? identifier : username,
        password
      });
      writeAccess({ role: account.role, email: account.email });
      navigate(account.role === "admin" ? "/requests.html" : "/index.html");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to complete sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page mx-auto w-full max-w-md px-5 py-10">
      <section className="login-card rounded-3xl p-6 soft-shadow sm:p-8">
        <div className="login-brand">
          <img className="login-logo" src={logo} alt="Doc Lui Veterinary Clinic logo" />
          <strong className="login-brand-name">DOC LUI</strong>
          <span className="login-brand-caption">VETERINARY CLINIC</span>
        </div>
        <h1 className="login-title mt-2 text-2xl font-black">Welcome back</h1>
        <p className="login-description mt-1 text-sm">Sign in to continue to your portal.</p>

        <div className="login-role-switch mt-5 grid grid-cols-2 rounded-xl p-1" aria-label="Choose account type">
          <button
            className={role === "client" ? "active" : ""}
            type="button"
            aria-pressed={role === "client"}
            onClick={() => selectRole("client")}
          >
            Client
          </button>
          <button
            className={role === "admin" ? "active" : ""}
            type="button"
            aria-pressed={role === "admin"}
            onClick={() => selectRole("admin")}
          >
            Admin
          </button>
        </div>

        {error && (
          <p className="login-error mt-4 rounded-lg px-3 py-2 text-sm" role="alert">
            {error}
          </p>
        )}
        <form className="login-form mt-5 grid gap-4" onSubmit={submit}>
          {isSignup && (
            <>
              <label className="login-label text-sm font-bold">
                Username
                <input
                  className="login-input mt-1 w-full rounded-lg border px-3 py-2.5 font-normal"
                  autoComplete="username"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  required
                />
              </label>
              {isClientSignup && (
                <label className="login-label text-sm font-bold">
                  Email
                  <input
                    className="login-input mt-1 w-full rounded-lg border px-3 py-2.5 font-normal"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </label>
              )}
            </>
          )}

          {role === "client" && !isClientSignup && (
            <label className="login-label text-sm font-bold">
              Username or email
              <input
                className="login-input mt-1 w-full rounded-lg border px-3 py-2.5 font-normal"
                autoComplete="username"
                value={identifier}
                onChange={event => setIdentifier(event.target.value)}
                required
              />
            </label>
          )}

          {role === "admin" && (
            <label className="login-label text-sm font-bold">
              Username
              <input
                className="login-input mt-1 w-full rounded-lg border px-3 py-2.5 font-normal"
                autoComplete="username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                required
              />
            </label>
          )}

          <PasswordField
            id="login-password"
            label="Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            visible={showPassword}
            onToggle={() => setShowPassword(current => !current)}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />

          {isSignup && (
            <PasswordField
              id="login-confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(current => !current)}
              autoComplete="new-password"
            />
          )}

          <button className="login-submit rounded-lg px-4 py-3 text-sm font-bold" type="submit" disabled={busy}>
            {busy
              ? "Please wait..."
              : isSignup
                ? isAdminSignup ? "Create admin account" : "Create client account"
                : "Log in"}
          </button>
        </form>

        {(role === "client" || role === "admin") && (
          <button className="login-mode-toggle mt-4 text-sm font-bold" type="button" onClick={toggleSignupMode}>
            {mode === "signup"
              ? "Already have an account? Log in"
              : role === "admin"
                ? "New admin? Create an account"
                : "New client? Create an account"}
          </button>
        )}

        {isAdminSignup && (
          <p className="login-demo-note mt-4 text-xs leading-5">
            Your password is stored as a salted hash.
          </p>
        )}
      </section>
    </main>
  );
}

export default Login;
