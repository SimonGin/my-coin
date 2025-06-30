"use client";

import React from "react";
import InfoBox from "@/components/info_box";
import { Alert, Button, Chip, Typography } from "@material-tailwind/react";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

const MnemonicPage = () => {
  const passPhrases = localStorage.getItem("mnemonic");

  const router = useRouter();

  const onContinue = () => {
    router.push("/wallet/new/verify");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-semibold text-center">
        Secret Recovery Phrase
      </div>
      <InfoBox title="This is your recovery phrases for your wallet." />
      <div className="grid grid-cols-4 gap-4">
        {passPhrases?.split(" ").map((word, index) => (
          <Chip
            key={index}
            color="teal"
            value={`${word}`}
            size="lg"
            icon={
              <div className="text-sm flex items-center justify-center">
                {index + 1}
              </div>
            }
          />
        ))}
      </div>
      <Alert variant="ghost" icon={<FaInfoCircle size={25} />}>
        <Typography className="font-medium" {...({} as any)}>
          Best practices for recovery phrase are to write it down on paper and
          store it somewhere secure. Resist temptation to email it to yourself
          or screenshot it.
        </Typography>
      </Alert>
      <div className="flex justify-center">
        <Button color="blue" onClick={onContinue} {...({} as any)}>
          I wrote them down
        </Button>
      </div>
    </div>
  );
};

export default MnemonicPage;
