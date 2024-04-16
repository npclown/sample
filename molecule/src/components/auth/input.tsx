import cn from "classnames";
import React, { forwardRef, useId } from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  hidden?: boolean;
}

export default forwardRef<HTMLInputElement, InputProps>(function Input({ hidden = false, ...props }, ref) {
  const inputId = useId();

  return (
    <div className={cn({ hidden: hidden }, "flex w-full flex-col gap-1")}>
      {props.label ? (
        <label htmlFor={inputId} className="text-sm text-gray-600 dark:text-gray-400">
          {props.label}
        </label>
      ) : null}
      <input
        id={inputId}
        className="rounded-md border border-gray-300 p-2 shadow transition hover:border-gray-600 focus:outline-gray-600 dark:border-gray-600 dark:hover:border-gray-400 dark:focus:outline-gray-400"
        ref={ref}
        {...props}
      />
    </div>
  );
});
