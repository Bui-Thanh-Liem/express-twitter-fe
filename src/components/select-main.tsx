import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { getNestedError } from "~/utils/getNestedError";
import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
} from "react-hook-form";

type SelectOption = {
  label: string;
  value: string;
};

type SelectSize = "sm" | "md" | "lg";

type SelectMainProps<T extends object> = {
  id: string;
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  classname?: string;
  size?: SelectSize;
};

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-8 px-2 text-sm",
  md: "h-10 px-3 text-base",
  lg: "h-12 px-4 text-base",
};

export function SelectMain<T extends object>({
  id,
  name,
  control,
  errors,
  label,
  options,
  classname,
  size = "md",
  placeholder = "Chọn giá trị",
}: SelectMainProps<T>) {
  const errorMessage = getNestedError(errors, name)?.message;

  return (
    <div className={cn("pb-2", classname)}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger
              className={cn(
                "mt-2 w-full",
                sizeStyles[size],
                errorMessage && "border-red-500 bg-red-50"
              )}
              id={id}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
