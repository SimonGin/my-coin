import React, { useState, forwardRef } from "react";
import { Input } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <Input
          size="lg"
          {...({} as any)}
          type={showPassword ? "text" : "password"}
          label={label}
          icon={
            showPassword ? (
              <FaEyeSlash
                onClick={() => setShowPassword(false)}
                className="cursor-pointer"
              />
            ) : (
              <FaEye
                onClick={() => setShowPassword(true)}
                className="cursor-pointer"
              />
            )
          }
          ref={ref}
          {...rest} // forward name, onChange, etc.
        />
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
