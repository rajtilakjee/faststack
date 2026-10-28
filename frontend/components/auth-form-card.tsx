import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormCard({
  title,
  description,
  children,
  footer,
}: AuthFormCardProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">{footer}</div> : null}
    </div>
  );
}
