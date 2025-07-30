"use client";

import { z } from "zod";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useWallet } from "@/states/wallet";
import { useRouter } from "next/navigation";

const INPUT_CLASSNAME =
  "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10";

const sendingCoinSchema = z.object({
  receiverAddress: z.string().nonempty("Receiver's address is required"),
  amount: z
    .number({
      required_error: "Please input an amount",
      invalid_type_error: "Amount must be a number",
    })
    .refine((val) => val > 0, {
      message: "Amount must be greater than zero",
    }),
  privateKey: z
    .string()
    .nonempty("Private key is required to make a transaction"),
});

type FormData = z.infer<typeof sendingCoinSchema>;

const SendCoinPage = () => {
  const { walletAddress } = useWallet();
  const [mining, setMining] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(sendingCoinSchema),
  });

  const onSubmit = (data: FormData) => {
    try {
      setMining(true);
      const response = axios.post("http://localhost:3000/api/send", {
        from: walletAddress,
        to: data.receiverAddress,
        amount: data.amount,
        privateKey: data.privateKey,
      });
      response.then(() => {
        setMining(false);
        setOpenDialog(true);
      });
    } catch (error) {
      console.error("Failed to send transaction:", error);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Dialog className="p-9" open={openDialog} size="sm" {...({} as any)}>
        <DialogHeader
          className="flex flex-col gap-3 items-center text-green-500 text-3xl"
          {...({} as any)}
        >
          <FaCheckCircle size={100} />
          Transaction successful completed
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
              setOpenDialog(false);

              router.push("/wallet/me");
            }}
          >
            <span>Okay</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="p-5">
        <Button
          variant="gradient"
          color="gray"
          {...({} as any)}
          onClick={() => {
            router.push("/wallet/me");
          }}
        >
          <IoIosArrowBack size={20} />
        </Button>
      </div>
      <form
        className="p-10 flex justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card
          className="border border-gray-300 shadow-sm w-full max-w-md bg-white/95 backdrop-blur-sm"
          {...({} as any)}
        >
          <CardBody className="p-6 flex flex-col gap-5" {...({} as any)}>
            <div className="self-center">
              <FaMoneyBillTransfer size={50} />
            </div>
            <h1 className="text-2xl text-center font-semibold">Sending coin</h1>

            {/* Receiver Address Field */}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-12 gap-4 items-center">
                <h1 className="col-span-3">To</h1>
                <div className="col-span-9">
                  <Input
                    placeholder="Receiver's address"
                    className={INPUT_CLASSNAME}
                    labelProps={{ className: "hidden" }}
                    containerProps={{ className: "min-w-[100px]" }}
                    {...register("receiverAddress")}
                    {...({} as any)}
                  />
                </div>
              </div>
              {errors.receiverAddress && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <p className="px-2 text-red-500 text-sm col-span-9">
                    {errors.receiverAddress.message}
                  </p>
                </div>
              )}
            </div>

            {/* Amount Field */}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-12 gap-4 items-center">
                <h1 className="col-span-3">Amount</h1>
                <div className="col-span-9">
                  <Input
                    type="number"
                    step="0.000001"
                    placeholder="Amount"
                    className={INPUT_CLASSNAME}
                    labelProps={{ className: "hidden" }}
                    containerProps={{ className: "min-w-[100px]" }}
                    {...register("amount", { valueAsNumber: true })}
                    {...({} as any)}
                  />
                </div>
              </div>
              {errors.amount && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <p className="px-2 text-red-500 text-sm col-span-9">
                    {errors.amount.message}
                  </p>
                </div>
              )}
            </div>

            {/* Private Key Field */}
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-12 gap-4 items-center">
                <h1 className="col-span-3">Sign with</h1>
                <div className="col-span-9">
                  <Input
                    type="password"
                    placeholder="Your private key"
                    className={INPUT_CLASSNAME}
                    labelProps={{ className: "hidden" }}
                    containerProps={{ className: "min-w-[100px]" }}
                    {...register("privateKey")}
                    {...({} as any)}
                  />
                </div>
              </div>
              {errors.privateKey && (
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3"></div>
                  <p className="px-2 text-red-500 text-sm col-span-9">
                    {errors.privateKey.message}
                  </p>
                </div>
              )}
            </div>
            {mining ? (
              <div className="flex justify-center">
                <Spinner {...({} as any)} />
              </div>
            ) : (
              <div className="flex justify-center">
                <Button color="blue" type="submit" {...({} as any)}>
                  Send Transaction
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      </form>
    </>
  );
};

export default SendCoinPage;
