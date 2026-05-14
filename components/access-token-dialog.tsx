"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type JWTPayload = {
  exp: number;
};

export function AccessTokenDialog() {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          setIsExpired(true);
        }
      } catch (error) {
        console.error("❌ Gagal decode token:", error);
        setIsExpired(true);
      }
    }
  }, []);

  const handleRedirect = () => {
    Cookies.remove("access_token");
    window.location.href = "/auth/sign-in";
  };

  return (
    <Dialog open={isExpired}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-orange-600 flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Sesi Kamu Telah Habis
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Silakan signin kembali untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>
        <Button variant={"orange"} className="w-full" onClick={handleRedirect}>
          Signin Ulang
        </Button>
      </DialogContent>
    </Dialog>
  );
}
