import { Loader2, Save } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function DashboardFormHeader({
  eyebrow,
  title,
  description,
}: HeaderProps) {
  return (
    <section className="rounded-lg border bg-card p-5 md:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>
      <h1 className="mt-2 max-w-3xl text-2xl font-bold tracking-normal">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

type SectionProps = {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardFormSection({
  step,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className="min-w-0 rounded-lg border bg-card p-5 md:p-6">
      <div className="mb-6 flex min-w-0 items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
          {step}
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-normal">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

type ActionsProps = {
  disabled?: boolean;
  pending?: boolean;
  label: string;
  pendingLabel?: string;
  note: string;
};

export function DashboardFormActions({
  disabled,
  pending,
  label,
  pendingLabel = "Menyimpan...",
  note,
}: ActionsProps) {
  return (
    <div className="sticky bottom-3 z-10 min-w-0 rounded-lg border bg-card/95 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted-foreground">{note}</p>
        <Button type="submit" disabled={disabled} variant="orange">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {label}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
