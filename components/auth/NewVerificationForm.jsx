"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./CardWrapper";
import { BeatLoader, PacmanLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { NewVerification } from "@/lib/actions";
import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";

export const NewVerificationForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Token not found!");
      return;
    }

    // Send a POST request to the server to confirm the email
    // Redirect to the login page
    NewVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your Verfication"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex flex-col items-center justify-center w-full">
        {!success && !error && <BeatLoader size={15} loading={true} />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
