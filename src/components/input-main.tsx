import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getNestedError } from "@/utils/getNestedError";
import type {
  Control,
  FieldErrors,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import { Input } from "./ui/input";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Assuming Lucide icons are used

type InputSize = "sm" | "md" | "lg";

type InputMainProps<T extends object> = React.ComponentProps<typeof Input> & {
  id: string;
  name: Path<T>;
  label?: string;
  placeholder: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
  isMaxLength?: boolean;
  maxCountLength?: number;
  sizeInput?: InputSize;
  fullWidth?: boolean;
  className?: string;
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

export function InputMain<T extends object>({
  id,
  name,
  label,
  placeholder,
  control,
  errors,
  register,
  isMaxLength,
  maxCountLength = 500,
  sizeInput = "md",
  fullWidth,
  type,
  className,
}: InputMainProps<T>) {
  const value = useWatch({ control, name }) ?? "";
  const errorMessage = getNestedError(errors, name)?.message;
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <Input
          id={id}
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          maxLength={maxCountLength}
          className={cn(
            "mt-2",
            sizeStyles[sizeInput],
            fullWidth && "w-full",
            errorMessage && "border-red-500 bg-red-50",
            type === "password" && "pr-10", // Add padding for eye icon
            className
          )}
          {...register(name)}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {isMaxLength && (
          <div className="absolute right-0 -bottom-6">
            <p className="text-right text-sm text-muted-foreground">
              {value.length}/{maxCountLength}
            </p>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm mt-1 text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
