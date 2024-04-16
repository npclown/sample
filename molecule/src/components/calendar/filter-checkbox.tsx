"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { use, useEffect, useState } from "react";

export default function FilterCheckbox({
  id,
  children,
  allCancelChecked,
  onChecked,
}: {
  id: string;
  children: React.ReactNode;
  allCancelChecked: boolean;
  onChecked: (id: string, checked: boolean) => void;
}) {
  const [bChecked, setChecked] = useState(false);

  const allCancelCheckHandler = () => setChecked(false);

  const checkHandler = (checked: boolean) => {
    setChecked(checked);
    onChecked(id, checked);
  };

  useEffect(() => allCancelCheckHandler(), [allCancelChecked]);

  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
      <Checkbox id={id} checked={bChecked} onCheckedChange={checkHandler} />
      <Label htmlFor={id}>{children}</Label>
    </div>
  );
}
