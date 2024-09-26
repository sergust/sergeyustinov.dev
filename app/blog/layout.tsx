"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderBlog from "./_assets/components/HeaderBlog";
import Footer from "@/components/Footer";
import React from "react";

export default function LayoutBlog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const shouldRedirect = true;

    if (shouldRedirect) {
      router.back();
    }
  }, [router]);

  return (
    <div>
      <Suspense>
        <HeaderBlog />
      </Suspense>
      <main className="min-h-screen max-w-6xl mx-auto p-8">{children}</main>
      <div className="h-24" />
      <Footer />
    </div>
  );
}
