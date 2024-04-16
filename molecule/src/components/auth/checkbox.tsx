import React, { forwardRef, useId } from "react";

export default function Checkbox({ ...props }) {
  const inputId = useId();

  return (
    <>
      <input id={inputId} type="checkbox" className="h-4 w-4 accent-gray-600" {...props} />
      <label htmlFor={inputId} className="select-none text-sm text-gray-900 dark:text-gray-300">
        {props.label}
      </label>
    </>
  );
}
