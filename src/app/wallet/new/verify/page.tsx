"use client";

import { z } from "zod";
import InfoBox from "@/components/info_box";
import RadioChoiceBox from "@/components/radio_choice_box";
import { Alert, Button, Chip, Typography } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useWalletCreate } from "@/states/wallet_creation";

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
  const { walletPw, walletMnemonic } = useWalletCreate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
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

  const handleSubmit = () => {
    const schema = createValidationSchema(challenges);
    const result = schema.safeParse(answers);

    if (!result.success) {
      const formattedErrors: Record<number, string> = {};
      const issues = result.error.format();

      Object.entries(issues).forEach(([key, value]) => {
        // Skip the "_errors" key
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
      console.log("All answers are correct!");
    } else {
      console.log("Some answers are incorrect.");
    }
  };

  return (
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
          recovery phrase correctly. Please confirm your backup by selecting the
          correct words in the next step.
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
  );
};

export default VerificationPage;
