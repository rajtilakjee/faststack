export type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export function validateAuthForm(values: AuthFormValues): string | null {
  const email = values.email.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }

  if (values.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (values.password.length > 128) {
    return "Password must be at most 128 characters.";
  }

  if (
    values.confirmPassword !== undefined &&
    values.password !== values.confirmPassword
  ) {
    return "Passwords do not match.";
  }

  return null;
}
