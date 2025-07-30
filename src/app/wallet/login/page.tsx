"use client";

import InfoBox from "@/components/info_box";
import PasswordInput from "@/components/pw_input";
import { useWallet } from "@/states/wallet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
// Icons
import { FaCheckCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import z from "zod";

const loginSchema = z.object({
  password: z.string().nonempty("Password is required"),
  mnemonic: z.string().nonempty("Mnemonic phrase is required"),
});

type FormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const { setWalletAddress } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/wallet/login",
        {
          password: data.password,
          mnemonic: data.mnemonic,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setOpenSuccessDialog(true);
      } else {
        console.error("Login failed:", response.data);
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);

  return (
    <>
      <Dialog
        className="p-9"
        open={openSuccessDialog}
        size="sm"
        {...({} as any)}
      >
        <DialogHeader
          className="flex flex-col gap-3 items-center text-green-500 text-3xl"
          {...({} as any)}
        >
          <FaCheckCircle size={100} />
          Succesfully Logged In
        </DialogHeader>
        <DialogBody className="text-center" {...({} as any)}>
          The amount of coin has been sent to the receiver's address
        </DialogBody>

        <DialogFooter className="flex justify-center" {...({} as any)}>
          <Button
            variant="gradient"
            color="green"
            {...({} as any)}
            onClick={() => {
              router.push("/wallet/me");
            }}
          >
            <span>Okay</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="h-screen flex flex-col gap-10 items-center justify-center">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-5">
            <FiLogIn size={50} />
            <div className="text-3xl font-semibold text-center">LOGIN</div>
          </div>
          <div className="w-full flex flex-col gap-1">
            <PasswordInput label="Password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-1">
            <PasswordInput label="Mnemonic Phrase" {...register("mnemonic")} />
            {errors.mnemonic && (
              <p className="text-red-500 text-sm">{errors.mnemonic.message}</p>
            )}
          </div>
          <InfoBox content="This password will be used to unlock your wallet" />
          <div className="flex justify-center">
            <Button color="blue" type="submit" {...({} as any)}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
