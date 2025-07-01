"use client";

import InfoBox from "@/components/info_box";
import PasswordInput from "@/components/pw_input";
import { Alert, Button, Typography } from "@material-tailwind/react";
import React from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaInfoCircle } from "react-icons/fa";
import * as bip39 from "bip39";

const passwordSchema = z
  .object({
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Must be at least 8 characters")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[0-9]/, "Must contain number")
      .regex(/[^a-zA-Z0-9]/, "Must contain special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof passwordSchema>;

const PickPasswordPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: FormData) => {
    const mnemonic = bip39.generateMnemonic();
    localStorage.setItem("mnemonic", mnemonic);
    router.push("/wallet/new/mnemonic");
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="text-2xl font-semibold text-center">Pick a Password</div>
      <InfoBox content="This password will be used to unlock your wallet" />
      <div className="w-full flex flex-col gap-1">
        <PasswordInput label="Password" {...register("password")} />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>
      <div className="w-full flex flex-col gap-1">
        <PasswordInput
          label="Confirm Password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Alert variant="ghost" icon={<FaInfoCircle size={25} />}>
        <Typography className="font-medium" {...({} as any)}>
          Ensure that these requirements are met:
        </Typography>
        <ul className="mt-2 ml-2 list-inside list-disc">
          <li>At least 8 characters (and up to 100 characters)</li>
          <li>At least one lowercase character</li>
          <li>At least one uppercase character</li>
          <li>Inclusion of at least one special character, e.g., ! @ # ?</li>
        </ul>
      </Alert>
      <div className="flex justify-center">
        <Button color="blue" type="submit" {...({} as any)}>
          Continue
        </Button>
      </div>
    </form>
  );
};

export default PickPasswordPage;
