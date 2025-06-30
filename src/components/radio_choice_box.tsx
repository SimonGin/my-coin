import React from "react";

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";

interface Props {
  choices: string[];
  questionNumber: number;
}

const RadioChoiceBox = ({ choices, questionNumber }: Props) => {
  return (
    <Card className="w-full max-w-[24rem]" {...({} as any)}>
      <List className="flex-row" {...({} as any)}>
        {choices.map((choice) => (
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
              {choice}
            </label>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default RadioChoiceBox;
