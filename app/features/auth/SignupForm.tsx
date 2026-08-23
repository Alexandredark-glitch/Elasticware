import { useId, useState, type FormEvent } from "react";
import { cn } from "../../lib/utils";
import { Form, useActionData, useNavigation, Link } from "react-router";

export function SignupForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; agree?: string }>({});
  
  const actionData = useActionData<{ error?: string; message?: string }>();
const navigation = useNavigation();
const isSubmitting = navigation.state === "submitting";



  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    else if (name.trim().length < 2) e.name = "Name is too short";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) e.password = "Use letters and numbers";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    if (!agree) e.agree = "Please accept the terms";
    setErrors(e);
    return !e.name && !e.email && !e.password && !e.confirm && !e.agree;
  }

  function handleSubmit(ev: FormEvent<HTMLFormElement>) {
  if (!validate()) ev.preventDefault();
}

  const inputBase = "w-full rounded-xl border bg-charcoal-800 px-4 py-3 text-sm text-cream-100 placeholder:text-charcoal-400 transition-colors focus:outline-none focus:ring-2";
  const errClass = "border-accent-500/60 focus:ring-accent-500/40";
  const okClass = "border-charcoal-600 focus:border-teal-500/60 focus:ring-teal-500/30";
  const errText = (id: string, msg?: string) => msg ? <p id={id} role="alert" className="mt-1.5 text-xs text-accent-400">{msg}</p> : null;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl bg-charcoal-800 border border-charcoal-700 overflow-hidden">
        <div className="p-7">
          <h1 className="font-heading text-2xl font-bold text-cream-100 mb-1">Create account</h1>
          <p className="text-sm text-charcoal-400 mb-6">Start managing support tickets</p>
          {actionData?.error && (
  <div className="mb-4 px-3 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20">
    <p className="text-xs text-accent-400">{actionData.error}</p>
  </div>
)}
{actionData?.message && (
  <div className="mb-4 px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
    <p className="text-xs text-teal-400">{actionData.message}</p>
  </div>
)}

          <Form method="post" onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor={nameId} className="mb-1.5 block text-sm font-medium text-charcoal-200">Full name</label>
              <input id={nameId} name="name" type="text" autoComplete="name" value={name}
                onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${nameId}-err` : undefined}
                className={cn(inputBase, errors.name ? errClass : okClass)} placeholder="Jane Doe" />
              {errText(`${nameId}-err`, errors.name)}
            </div>
            <div>
              <label htmlFor={emailId} className="mb-1.5 block text-sm font-medium text-charcoal-200">Email</label>
              <input id={emailId} name="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${emailId}-err` : undefined}
                className={cn(inputBase, errors.email ? errClass : okClass)} placeholder="you@example.com" />
              {errText(`${emailId}-err`, errors.email)}
            </div>
            <div>
              <label htmlFor={passwordId} className="mb-1.5 block text-sm font-medium text-charcoal-200">Password</label>
              <input id={passwordId} name="password" type="password" autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? `${passwordId}-err` : undefined}
                className={cn(inputBase, errors.password ? errClass : okClass)} placeholder="At least 8 characters" />
              {errText(`${passwordId}-err`, errors.password)}
            </div>
            <div>
              <label htmlFor={confirmId} className="mb-1.5 block text-sm font-medium text-charcoal-200">Confirm password</label>
              <input id={confirmId} name="confirmPassword" type="password" autoComplete="new-password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} aria-invalid={Boolean(errors.confirm)}
                aria-describedby={errors.confirm ? `${confirmId}-err` : undefined}
                className={cn(inputBase, errors.confirm ? errClass : okClass)} placeholder="Re-enter password" />
              {errText(`${confirmId}-err`, errors.confirm)}
            </div>
            <label className="flex items-start gap-2.5 text-sm text-charcoal-300">
              <input type="checkbox" name="terms" checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-charcoal-500 bg-charcoal-700 text-accent-500 focus:ring-accent-500/40" />
              <span>I agree to the <Link to="/soon" className="text-teal-400 hover:text-teal-300 focus-ring rounded">Terms</Link> and <Link to="/soon" className="text-teal-400 hover:text-teal-300 focus-ring rounded">Privacy Policy</Link></span>
            </label>
            {errText("agree-err", errors.agree)}
            <button type="submit" disabled={isSubmitting}
              className={cn("w-full rounded-xl py-3 text-sm font-semibold text-white transition-all focus-ring",
                "bg-teal-500 hover:bg-teal-600 active:scale-[0.99]", isSubmitting && "opacity-60 cursor-not-allowed")}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </Form>

          <p className="mt-5 text-center text-sm text-charcoal-400">
            Have an account? <Link to="/login" className="font-semibold text-accent-400 hover:text-accent-300 focus-ring rounded">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
