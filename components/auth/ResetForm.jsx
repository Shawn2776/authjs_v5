"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import CardWrapper from "./CardWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ResetSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { ResetPassword } from "@/lib/actions";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const form = useForm({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      ResetPassword(values).then((data) => {
        setError(data?.error);
        // TODO: Add with email magiLink
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your Password?"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.smith@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
