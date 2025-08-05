"use client";
// Libraries
import Cookies from "js-cookie";
// Components
import InfoBox from "@/components/info_box";
import PasswordInput from "@/components/pw_input";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import axios from "axios";
// Hooks
import { useRouter } from "next/navigation";
import { useState } from "react";
// Icons
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
// Forms
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const loginSchema = z.object({
  password: z.string().nonempty("Password is required"),
  mnemonic: z.string().nonempty("Mnemonic phrase is required"),
});

type FormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [loginState, setLoginState] = useState("");
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
        Cookies.set("accessToken", response.data.token);
        setLoginState("success");
      } else if (response.status === 404) {
        setLoginState("failed");
        console.error("Login failed:", response.data);
      }
    } catch (error) {
      setLoginState("failed");
      console.error("Failed to login:", error);
    }
    setOpenSuccessDialog(true);
  };

  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  return (
    <>
      <Dialog
        className="p-9"
        open={openSuccessDialog}
        size="sm"
        {...({} as any)}
      >
        <DialogHeader
          className={`flex flex-col gap-3 items-center text-3xl ${
            loginState === "success" ? "text-green-500" : "text-red-500"
          }`}
          {...({} as any)}
        >
          {loginState === "success" ? (
            <>
              <FaCheckCircle size={100} />
              Succesfully Logged In
            </>
          ) : (
            <>
              <FaRegCircleXmark size={100} />
              Login Failed
            </>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-center" {...({} as any)}>
          <Button
            variant="gradient"
            color={loginState === "success" ? "green" : "red"}
            {...({} as any)}
            onClick={() => {
              if (loginState === "success") {
                router.push("/wallet/me");
              } else {
                setOpenSuccessDialog(false);
              }
            }}
          >
            <span>
              {loginState === "success" ? "Continue" : "Let me try again"}
            </span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="h-screen flex flex-col gap-10 items-center justify-center">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-9 flex flex-col items-center gap-5">
            <FiLogIn size={50} />
            <div className="text-3xl font-semibold text-center">LOGIN</div>
            <InfoBox content="Enter your password and mnemonic phrase to login" />
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

          <div className="flex justify-center">
            <Button color="blue" type="submit" {...({} as any)}>
              Continue
            </Button>
          </div>
        </form>
        <div>
          Or{" "}
          <span
            onClick={() => router.push("/wallet/new/pick-pw")}
            className="text-blue-500 cursor-pointer underline hover:text-blue-800"
          >
            Create a new wallet
          </span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
