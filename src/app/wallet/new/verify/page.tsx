"use client";

import { z } from "zod";
import axios from "axios";
import InfoBox from "@/components/info_box";
import RadioChoiceBox from "@/components/radio_choice_box";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useWalletCreate } from "@/states/wallet_creation";
import { maskedKey } from "@/utils";

const createValidationSchema = (challenges: any[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  challenges.forEach((_, idx) => {
    shape[idx] = z
      .string({ required_error: "Please select an answer for the word" })
      .min(1, "Please select an answer");
  });
  return z.object(shape);
};

const VerificationPage = () => {
  const { setStep, walletPw, walletMnemonic } = useWalletCreate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [privateKey, setPrivateKey] = useState<string>("");
  const router = useRouter();

  // When user selects an answer:
  const handleSelect = (challengeIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [challengeIndex]: value }));
  };

  function getRandomIndices(count: number, max: number): number[] {
    const indices = new Set<number>();
    while (indices.size < count) {
      const rand = Math.floor(Math.random() * max);
      indices.add(rand);
    }
    return Array.from(indices);
  }

  function getRandomOptions(correctWord: string, allWords: string[]): string[] {
    const distractors = allWords.filter((w) => w !== correctWord);
    const shuffled = distractors.sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [...shuffled, correctWord];
    return options.sort(() => 0.5 - Math.random());
  }

  const [errors, setErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    setStep(3);
    if (!walletMnemonic) {
      router.replace("/wallet/new");
    } else {
      const selectedIndices = getRandomIndices(3, 12);
      const challenges = selectedIndices.map((index) => {
        const correct = walletMnemonic?.[index];
        const options = getRandomOptions(correct as string, walletMnemonic!);
        return {
          index: index + 1, // display as 1-based index (1–12)
          correct,
          options,
        };
      });
      setChallenges(challenges);
      console.log(challenges);
    }
  }, [router]);

  const handleSubmit = async () => {
    const schema = createValidationSchema(challenges);
    const result = schema.safeParse(answers);

    if (!result.success) {
      const formattedErrors: Record<number, string> = {};
      const issues = result.error.format();

      Object.entries(issues).forEach(([key, value]) => {
        if (key !== "_errors") {
          const idx = parseInt(key);
          if (
            typeof value === "object" &&
            value !== null &&
            "_errors" in value &&
            Array.isArray(value._errors) &&
            value._errors.length > 0
          ) {
            formattedErrors[idx] = value._errors[0];
          }
        }
      });

      setErrors(formattedErrors);
      return;
    }

    // No errors — clear previous errors
    setErrors({});

    const allCorrect = challenges.every((c, idx) => answers[idx] === c.correct);
    if (allCorrect) {
      setStep(4);
      try {
        const response = await axios.post("/api/wallet", {
          mnemonic: walletMnemonic.join(" "),
          password: walletPw,
        });

        // Success response
        console.log("Wallet created successfully:", response.data);
        if (response.status === 200) {
          setPrivateKey(response.data.privateKey);
          setOpenDialog(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Some answers are incorrect.");
    }
  };

  const [openDialog, setOpenDialog] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  return (
    <>
      <Dialog className="p-9" open={openDialog} size="sm" {...({} as any)}>
        <DialogHeader
          className="flex flex-col gap-3 items-center text-green-500 text-3xl"
          {...({} as any)}
        >
          <FaCheckCircle size={100} />
          Congratulations
        </DialogHeader>
        <DialogBody className="text-center" {...({} as any)}>
          You're all set! You can now start using your wallet.
        </DialogBody>
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex w-full max-w-[24rem]">
            <Input
              value={maskedKey(privateKey)}
              disabled
              className="pr-20"
              {...({} as any)}
            />
            <Button
              size="sm"
              color={"gray"}
              className="!absolute right-1 top-1 rounded"
              {...({} as any)}
              onClick={() => {
                navigator.clipboard
                  .writeText(privateKey)
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 3000);
                  })
                  .catch((err) => {
                    console.error("Failed to copy!", err);
                  });
              }}
            >
              {copied ? <TbCopyCheckFilled size={20} /> : <TbCopy size={20} />}
            </Button>
          </div>
          <Alert color="amber" className="font-semibold">
            This is your private key. Please make sure to save your private key
            somewhere safe.
          </Alert>
        </div>

        <DialogFooter className="flex justify-center" {...({} as any)}>
          <Button variant="gradient" color="green" {...({} as any)}>
            <span>Great</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-semibold text-center">Verification</div>
        <InfoBox content="Let's make sure your recovery phrase is securely saved" />
        {challenges.map((challenge: any, idx: number) => (
          <div className="flex flex-col gap-2" key={`challenge-${idx}`}>
            <div className="flex gap-3 justify-center">
              <Chip
                color="teal"
                value={String(challenge.index).padStart(2, "0")}
                size="lg"
                className="text-lg mx-4"
              />
              <RadioChoiceBox
                groupName={`challenge-${idx}`}
                choices={challenge.options}
                onSelect={(value) => {
                  handleSelect(idx, value);
                  setErrors((prev) => ({ ...prev, [idx]: "" }));
                }}
              />
            </div>
            {errors[idx] && (
              <div className="text-red-500 text-sm font-medium text-center">
                {errors[idx]}
              </div>
            )}
          </div>
        ))}
        <Alert variant="ghost" icon={<FaInfoCircle size={25} />}>
          <Typography className="font-medium" {...({} as any)}>
            To protect your wallet, we need to verify that you've backed up your
            recovery phrase correctly. Please confirm your backup by selecting
            the correct words in the next step.
          </Typography>
        </Alert>
        <div className="flex justify-between">
          <Button color="blue" {...({} as any)} onClick={() => router.back()}>
            Back
          </Button>
          <Button color="blue" onClick={handleSubmit} {...({} as any)}>
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;
