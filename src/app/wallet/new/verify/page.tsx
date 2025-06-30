"use client";

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

const VerificationPage = () => {
  const passPhrases = localStorage.getItem("mnemonic")?.split(" ");
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
    return options.sort(() => 0.5 - Math.random());
  }

  useEffect(() => {
    if (!passPhrases) {
      window.location.href = "/wallet/new";
    }
  }, [passPhrases]);

  useEffect(() => {
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
  });

  return (
    <div>
      <Card className="w-full max-w-[24rem]" {...({} as any)}>
        <List className="flex-row" {...({} as any)}>
          <ListItem className="p-0" {...({} as any)}>
            <label
              htmlFor="horizontal-list-react"
              className="flex w-full cursor-pointer items-center px-3 py-2 font-black"
            >
              <ListItemPrefix className="mr-3" {...({} as any)}>
                <Radio
                  name="horizontal-list"
                  id="horizontal-list-react"
                  ripple={false}
                  className="hover:before:opacity-0"
                  color="teal"
                  containerProps={{
                    className: "p-0",
                  }}
                  {...({} as any)}
                />
              </ListItemPrefix>
              React.js
            </label>
          </ListItem>
          <ListItem className="p-0" {...({} as any)}>
            <label
              htmlFor="horizontal-list-vue"
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3" {...({} as any)}>
                <Radio
                  name="horizontal-list"
                  id="horizontal-list-vue"
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                  {...({} as any)}
                />
              </ListItemPrefix>
              Vue.js
            </label>
          </ListItem>
        </List>
      </Card>
    </div>
  );
};

export default VerificationPage;
