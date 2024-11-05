"use client";

import Link from "next/link";
import { useAnalytics } from "@/lib/analytics";
import React from "react";

interface CallToActionLinkProps {
  children: React.ReactNode;
  className?: string;
}

const CallToActionLink = ({ children, className }: CallToActionLinkProps) => {
  const { trackCallClick } = useAnalytics();

  return (
    <Link
      href="https://cal.com/sergustinov/15-minutes-chat"
      target="_blank"
      rel="noopener noreferrer"
      referrerPolicy="no-referrer"
      onClick={trackCallClick}
      className={className}
    >
      {children}
    </Link>
  );
};

export default CallToActionLink;
