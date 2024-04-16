import { useState } from "react";
import React from "react";

import { Checkbox } from "../ui/checkbox";

const CommonCheckbox = ({
  id,
  checked = false,
  hidden = false,
  onCheckedChange,
  children,
}: {
  id: string;
  checked?: boolean;
  hidden?: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
}) => {
  const [check, setCheck] = useState(checked as boolean);

  return (
    <div>
      <Checkbox
        id={id}
        onCheckedChange={(checked: boolean) => {
          setCheck(checked);
          onCheckedChange(checked);
        }}
        checked={check}
        hidden={hidden}
      />
      <label
        htmlFor={id}
        className="cursor-pointer text-sm font-medium leading-none peer-checked:text-[#000000] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  );
};

export default CommonCheckbox;
