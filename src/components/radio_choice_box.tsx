import React from "react";

interface Props {
  choices: string[];
  questionNumber: number;
}

const RadioChoiceBox = ({ choices, questionNumber }: Props) => {
  return (
    // <Card className="rounded-md border bg-white p-4 shadow-sm max-w-xl">
    //   <CardContent className="flex items-center gap-6">
    //     <span className="font-semibold text-sm text-gray-800">
    //       {questionNumber.toString()}.
    //     </span>
    //     <RadioGroup className="flex items-center gap-6">
    //       {choices.map((choice, index) => (
    //         <div key={choice} className="flex items-center space-x-2">
    //           <RadioGroupItem value={choice} id={choice + questionNumber} />
    //           <Label
    //             htmlFor={choice + questionNumber}
    //             className="text-sm text-slate-700"
    //           >
    //             {choice}
    //           </Label>
    //         </div>
    //       ))}
    //     </RadioGroup>
    //   </CardContent>
    // </Card>
    <></>
  );
};

export default RadioChoiceBox;
