"use client";

import React, { useEffect, useState } from "react";
import InfoBox from "@/components/info_box";
import { Alert, Button, Chip, Typography } from "@material-tailwind/react";
import { FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useWalletCreate } from "@/states/wallet_creation";

const MnemonicPage = () => {
  const [passPhrases, setPassPhrases] = useState<string[] | null>(null);
  const { setStep, walletMnemonic } = useWalletCreate();
  const router = useRouter();

  useEffect(() => {
    if (walletMnemonic.length > 0) {
      setPassPhrases(walletMnemonic);
    } else {
      router.push("/wallet/new");
    }
  }, []);

  if (!passPhrases) return null;

  const onContinue = () => {
    router.push("/wallet/new/verify");
    setStep(3);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-semibold text-center">
        Secret Recovery Phrase
      </div>
      <InfoBox content="This is your recovery phrases for your wallet." />
      <div className="grid grid-cols-4 gap-4">
        {passPhrases?.map((word, index) => (
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
