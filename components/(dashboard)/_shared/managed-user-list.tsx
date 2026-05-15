"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableQueryParams } from "@/hooks/use-data-table-query-params";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile: {
    institution?: string;
    origin?: string;
    birth_date?: string;
    group_type?: string;
  };
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

type FilterOptions = Record<
  string,
  {
    placeholder: string;
    options: { label: string; value: string }[];
  }
>;

type Props<TUser extends ManagedUser> = {
  users: TUser[];
  meta: Meta;
  isLoading?: boolean;
  roleLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
  filterOptions?: FilterOptions;
  showGroup?: boolean;
  renderAction: (user: TUser) => React.ReactNode;
};

export function ManagedUserList<TUser extends ManagedUser>({
  users,
  meta,
  isLoading = false,
  roleLabel,
  searchPlaceholder,
  emptyTitle,
  emptyDescription,
  filterOptions,
  showGroup = false,
  renderAction,
}: Props<TUser>) {
  const { page, search, filters, updateQuery, resetFilters } =
    useDataTableQueryParams();
  const isFirstPage = page === 1;
  const isLastPage = page === meta.total_pages || users.length === 0;

  return (
    <section className="min-w-0 space-y-4">
      <div className="rounded-lg border bg-card p-4 md:p-5">
        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => updateQuery("search", event.target.value)}
              className="h-10 min-w-0 pl-9"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            {filterOptions &&
              Object.entries(filterOptions).map(([key, config]) => (
                <Select
                  key={key}
                  value={filters?.[key] || ""}
                  onValueChange={(value) => updateQuery(key, value)}
                >
                  <SelectTrigger className="h-10 w-full sm:w-[220px]">
                    <SelectValue placeholder={config.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}

            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="h-10 justify-center"
            >
              <SlidersHorizontal className="size-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: Math.min(meta.limit, 6) }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      ) : users.length ? (
        <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              roleLabel={roleLabel}
              showGroup={showGroup}
              action={renderAction(user)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-card p-8 text-center">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:p-5">
        <span>
          Halaman {page} dari {meta.total_pages} · {meta.total} data
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateQuery("page", String(page - 1))}
            disabled={isFirstPage}
          >
            <ChevronLeft className="size-4" />
            Sebelumnya
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateQuery("page", String(page + 1))}
            disabled={isLastPage}
          >
            Selanjutnya
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function UserCard({
  user,
  roleLabel,
  showGroup,
  action,
}: {
  user: ManagedUser;
  roleLabel: string;
  showGroup: boolean;
  action: React.ReactNode;
}) {
  return (
    <article className="group min-w-0 rounded-lg border bg-card p-4 transition hover:border-primary/25 hover:bg-muted/20">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11 border">
            <AvatarFallback className="text-sm font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold leading-6">
              {user.name || "Tanpa nama"}
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{user.email || "-"}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">{action}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">{roleLabel}</Badge>
        {showGroup && (
          <Badge variant="outline">
            {getGroupLabel(user.profile.group_type)}
          </Badge>
        )}
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <CardFact
          icon={<Phone className="size-4" />}
          label="Telepon"
          value={user.phone || "-"}
        />
        <CardFact
          icon={<MapPin className="size-4" />}
          label="Asal"
          value={user.profile.origin || "-"}
        />
        <CardFact label="Institusi" value={user.profile.institution || "-"} />
        <CardFact
          label="Tanggal lahir"
          value={formatDate(user.profile.birth_date)}
        />
      </div>
    </article>
  );
}

function UserCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="size-11 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-8 w-8" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="mt-5 grid gap-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

function CardFact({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-md border bg-background px-3 py-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon && <span className="text-primary">{icon}</span>}
        {label}
      </div>
      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-sm">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function getInitials(name?: string) {
  if (!name) return "UG";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID");
}

function getGroupLabel(groupType?: string) {
  if (groupType === "mahasiswa_gunadarma") return "Mahasiswa Gunadarma";
  if (groupType === "mahasiswa_non_gunadarma") return "Mahasiswa Non Gunadarma";
  return "Umum";
}
