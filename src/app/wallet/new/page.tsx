"use client";

import RadioChoiceBox from "@/components/radio_choice_box";
import PasswordInput from "@/components/pw_input";
import React, { useState } from "react";
import * as bip39 from "bip39";
import { Alert, Button } from "@material-tailwind/react";
import { FaInfoCircle } from "react-icons/fa";
import InfoBox from "@/components/info_box";

const createWalletPage = () => {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passPhrases, setPassPhrases] = useState<string[]>();
  const [challenges, setChallenges] = useState<any>();

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
    return options.sort(() => 0.5 - Math.random()); // shuffle
  }

  const goToStepOne = () => {
    const mnemonic = bip39.generateMnemonic();
    setPassPhrases(mnemonic.split(" "));
    setStep(1);
  };

  const goToStepTwo = () => {
    const selectedIndices = getRandomIndices(3, 12);
    const challenges = selectedIndices.map((index) => {
      const correct = passPhrases?.[index];
      const options = getRandomOptions(correct as string, passPhrases!);
      return {
        index: index + 1, // display as 1-based index (1–12)
        correct,
        options,
      };
    });
    setChallenges(challenges);
    setStep(2);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="max-w-3xl">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-semibold">Pick a Password</div>
            <InfoBox title="This password will be used to unlock your wallet" />
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-2xl font-semibold">Write down these words</div>
            <InfoBox
              title="These are the recovery phrases for your wallet. You and you
                alone have access to them. It can be use to restore your wallet."
            />
            <div></div>
          </div>
        )}
        {step === 2 && (
          <div className="text-2xl font-semibold">Verification</div>
        )}

        <div className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button color="blue" {...({} as any)} onClick={goToStepOne}>
                Continue
              </Button>
            </>
          )}
          {step === 1 && (
            <>
              {/* <Card className="p-5 bg-[#4E6688] mx-auto ">
                <CardContent className="grid grid-cols-4 gap-7">
                  {passPhrases?.map((phrase, index) => (
                    <div
                      key={index}
                      className="font-black text-xl text-[#E3EEB2]"
                    >
                      <label className="block">
                        <span className="text-xl">
                          {index + 1}. {phrase}
                        </span>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card> */}
              <Button color="yellow" onClick={goToStepTwo} {...({} as any)}>
                I wrote them down
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <p>Please select the correct phrase based on the numbers</p>
              <div className="flex flex-col gap-5">
                {challenges?.map((challenge: any) => (
                  <RadioChoiceBox
                    key={challenge.index}
                    questionNumber={challenge.index}
                    choices={challenge.options}
                  />
                ))}
              </div>
              <div className="my-4 flex justify-between">
                <Button color="blue" {...({} as any)} onClick={goToStepOne}>
                  Back
                </Button>
                <Button color="blue" {...({} as any)} onClick={goToStepOne}>
                  Verify
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default createWalletPage;
