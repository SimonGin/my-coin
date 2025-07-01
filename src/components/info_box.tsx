import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface Props {
  content: string;
}

const InfoBox = ({ content }: Props) => {
  return (
    <>
      <div className="p-4 border-l-4 border-[#FB9E3A] w-full flex items-center gap-2 bg-[#FCEF91]/10 font-bold text-md text-[#FB9E3A]">
        <FaInfoCircle size={25} />
        <h1>{content}</h1>
      </div>
    </>
  );
};

export default InfoBox;
