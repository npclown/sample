"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import * as React from "react";

export default function Filter({
  list,
  filterValue,
  setFilterValue,
  className,
}: {
  list: any[];
  filterValue: any;
  setFilterValue: (status: any) => void;
  className?: string;
}) {
  return (
    <ComboBoxResponsive
      list={list}
      selectedStatus={filterValue}
      setSelectedStatus={setFilterValue}
      className={className}
    />
  );
}

function ComboBoxResponsive({
  list,
  selectedStatus,
  setSelectedStatus,
  className,
}: {
  list: any[];
  selectedStatus: any;
  setSelectedStatus: any;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[150px] justify-start", className)}>
            {selectedStatus ? <>{list.find((find) => find.value === selectedStatus)?.label}</> : <>필터링 선택</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList list={list} setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={cn("w-[150px] justify-start", className)}>
          {selectedStatus ? <>{list.find((find) => find.value === selectedStatus)?.label}</> : <>필터링 선택</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList list={list} setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  list,
  setOpen,
  setSelectedStatus,
}: {
  list: any[];
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: any) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="결과 검색" />
      <CommandList>
        <CommandEmpty>결과가 없습니다.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            onSelect={() => {
              setSelectedStatus(null);
              setOpen(false);
            }}
          >
            전체 보기
          </CommandItem>

          {list.map((data) => (
            <CommandItem
              key={data.value}
              value={`${data.label}:${data.value}`} // For searching by label
              onSelect={(value) => {
                setSelectedStatus(list.find((find) => find.value === value.split(":")[1])?.value || null);
                setOpen(false);
              }}
            >
              {data.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
