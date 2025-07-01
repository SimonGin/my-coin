"use client";

import React, { useState } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";

interface Props {
  choices: string[];
  groupName: string; // unique per question
  onSelect?: (value: string) => void; // optional callback to parent
}

const RadioChoiceBox = ({ choices, groupName, onSelect }: Props) => {
  const [selected, setSelected] = useState<string>("");

  const handleChange = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <Card className="w-full max-w-[24rem]" {...({} as any)}>
      <List className="flex-row" {...({} as any)}>
        {choices.map((choice, index) => {
          const id = `${groupName}-option-${index}`;
          return (
            <ListItem className="p-0" key={id} {...({} as any)}>
              <label
                htmlFor={id}
                className="flex w-full cursor-pointer items-center px-3 py-2 font-black"
              >
                <ListItemPrefix className="mr-3" {...({} as any)}>
                  <Radio
                    name={groupName}
                    id={id}
                    value={choice}
                    checked={selected === choice}
                    onChange={() => handleChange(choice)}
                    ripple={false}
                    className="hover:before:opacity-0"
                    color="teal"
                    containerProps={{
                      className: "p-0",
                    }}
                    {...({} as any)}
                  />
                </ListItemPrefix>
                {choice}
              </label>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
};

export default RadioChoiceBox;
