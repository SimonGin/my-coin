"use client";

import { Input } from "@material-tailwind/react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps {
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const PasswordInput = ({
  placeholder,
  onChange,
  value,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState("password");

  return (
    <div className="relative w-full">
      <Input
        size="lg"
        label={placeholder}
        type={showPassword}
        icon={
          showPassword === "password" ? (
            <FaEye onClick={() => setShowPassword("text")} />
          ) : (
            <FaEyeSlash onClick={() => setShowPassword("password")} />
          )
        }
        {...({} as any)}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default PasswordInput;
