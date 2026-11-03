"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-context";

function getInitial(name: string | null, email: string): string {
  const source = name?.trim() || email;
  return source.charAt(0).toUpperCase();
}

/**
 * GitHub-style avatar menu. Only Logout for now — as more account features
 * land (profile, bookings, settings), add them as DropdownMenuItems here.
 */
export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name ?? user.email}
            width={36}
            height={36}
            className="rounded-full border border-zinc-200 size-9 object-cover"
          />
        ) : (
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {getInitial(user.name, user.email)}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
          <span className="text-sm font-semibold text-foreground truncate">
            {user.name ?? "Scoutripper user"}
          </span>
          <span className="text-xs text-zinc-400 truncate">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
