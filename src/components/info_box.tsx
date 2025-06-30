import { Alert } from "@material-tailwind/react";
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface Props {
  title: string;
}

const InfoBox = ({ title }: Props) => {
  return (
    <Alert
      icon={<FaInfoCircle size={25} />}
      className="rounded-none border-l-4 border-[#FB9E3A] bg-[#FCEF91]/10 font-bold text-md text-[#FB9E3A] select-none"
    >
      {title}
    </Alert>
  );
};

export default InfoBox;
