"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const BackButton = ({ href, label }) => {
  return (
    <Button variant="link" className="w-full font-normal" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
