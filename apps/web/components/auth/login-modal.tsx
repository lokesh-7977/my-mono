"use client";

import { useState } from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { useAuth } from "@/lib/auth/auth-context";

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <Dialog
      open={isLoginModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeLoginModal();
          setError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-sm rounded-2xl p-6 gap-0 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <DialogHeader className="items-center text-center gap-2 p-0">
          <Image
            src="/scoutripper-logo-dark.png"
            alt="Scoutripper"
            width={130}
            height={38}
            className="mb-2"
          />
          <DialogTitle className="text-[22px] font-bold text-foreground font-bricolage-grotesque leading-tight">
            Welcome to Scoutripper
          </DialogTitle>
          <p className="text-[15px] font-medium text-zinc-400 leading-relaxed">
            Sign in to book treks, save your favourite trails, and track your
            adventures.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-6">
          <div className="flex justify-center">
            <GoogleLogin
              width="296"
              shape="pill"
              onSuccess={async (credentialResponse) => {
                setError(null);

                if (!credentialResponse.credential) {
                  setError("Google did not return a valid credential.");
                  return;
                }

                try {
                  setIsSigningIn(true);
                  await loginWithGoogle(credentialResponse.credential);
                } catch {
                  setError("Login failed. Please try again.");
                } finally {
                  setIsSigningIn(false);
                }
              }}
              onError={() => {
                setError("Google sign-in failed. Please try again.");
              }}
            />
          </div>

          {isSigningIn && (
            <p className="text-sm font-medium text-zinc-400 text-center">
              Signing you in…
            </p>
          )}

          {error && (
            <p className="text-sm font-medium text-red-500 text-center">
              {error}
            </p>
          )}

          <p className="text-xs font-medium text-zinc-400 text-center leading-relaxed">
            By continuing, you agree to Scoutripper&apos;s Terms of Service
            and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
