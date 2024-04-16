"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { format, sub } from "date-fns";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  selectedRange: { start?: Date; end?: Date };
  calendar: string;
}

const CalendarForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { selectedRange, calendar, className, ...props },
  ref,
) {
  const start = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const headcount = useRef<HTMLInputElement>(null);
  const point = useRef<HTMLInputElement>(null);
  const note = useRef<HTMLTextAreaElement>(null);

  const [color, setColor] = useState<string>("#0000ff");

  const [placeType, setPlaceType] = useState<string>("online");
  const [recruitType, setRecruitType] = useState<string>("non_recruit");

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const createMutation = useMutation({
    mutationFn: (data: {
      start: string;
      end: string;
      title: string;
      description: string;
      price: number;
      color: string;
      type: string;
      is_team: boolean;
      is_online: boolean;
      headcount?: number;
      point?: number;
      note?: string;
    }) => {
      return request.post(`/api/calendars/${calendar}/events/`, {
        start: data.start,
        end: data.end,
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        color: data.color,
        type: data.type,
        is_team: data.is_team,
        is_online: data.is_online,
        headcount: data.headcount,
        point: data.point,
        note: data.note,
      });
    },
    onSuccess: (response) => {
      toast.success("일정 등록 요청을 완료했습니다, 관리자 승인 후 일정이 등록됩니다");
    },
    onError: (error) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error(response.data.data.message);
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      createMutation.mutate({
        start: start.current!.value,
        end: end.current!.value,
        title: title.current!.value,
        description: description.current!.value,
        price: Number(price.current!.value),
        color: color,
        type: recruitType,
        is_team: recruitType == "recruit" ? true : false,
        is_online: placeType == "online" ? true : false,
        headcount: Number(headcount.current?.value ?? 0),
        point: Number(point.current?.value ?? 0),
        note: note.current?.value ?? "",
      });
    },
  }));

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="start" className="text-right">
          시작일
        </Label>
        <Input
          ref={start}
          id="start"
          type="datetime-local"
          placeholder="시작하는 시간입니다"
          defaultValue={format(selectedRange.start ?? new Date(), "yyyy-MM-dd HH:mm:ss")}
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="end" className="text-right">
          종료일
        </Label>
        <Input
          ref={end}
          id="end"
          type="datetime-local"
          defaultValue={format(selectedRange.end ?? new Date(), "yyyy-MM-dd HH:mm:ss")}
          placeholder="종료되는 시간입니다"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          제목
        </Label>
        <Input id="title" ref={title} placeholder="캘린더에 표시될 일정의 제목을 입력해주세요" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          설명
        </Label>
        <Textarea
          id="description"
          ref={description}
          placeholder="일정 상세보기에 표시될 간단한 설명을 입력헤주세요"
          className="col-span-3"
          rows={10}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">
          참가비
        </Label>
        <Input
          id="price"
          type="number"
          ref={price}
          placeholder="참가비용을 입력해주세요, 무료면 0을 입력해주세요"
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="color" className="text-right">
          색상
        </Label>
        <Input id="color" type="color" value={color} onChange={handleColor} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">참여 방법</Label>
        <RadioGroup
          value={placeType}
          onValueChange={(value: string) => {
            setPlaceType(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label>온라인</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label>오프라인</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">팀원 모집 여부</Label>
        <RadioGroup
          value={recruitType}
          onValueChange={(value: string) => {
            setRecruitType(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recruit" id="recruit" />
            <Label>모집하기</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non_recruit" id="non_recruit" />
            <Label>모집안함</Label>
          </div>
        </RadioGroup>
      </div>

      {recruitType === "recruit" && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="headcount" className="text-right">
              모집 인원 수
            </Label>
            <Input
              ref={headcount}
              id="headcount"
              type="number"
              placeholder="모집할 팀원 수를 입력해주세요"
              className="col-span-3"
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="point" className="text-right">
              제공할 eV
            </Label>
            <Input
              ref={point}
              id="point"
              type="number"
              placeholder="팀원이 참여하면 제공할 eV를 입력해주세요 (1명당)"
              className="col-span-3"
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="point" className="text-right">
              참가자 전용 설명
            </Label>
            <Textarea
              id="note"
              ref={note}
              placeholder="참가를 승인한 팀원들에게만 보이는 메시지입니다, 소통할 수 있는 오픈채팅 링크나, 추가 설명을 입력해주세요"
              className="col-span-3"
              rows={5}
            />
          </div>
        </>
      )}
    </div>
  );
});

CalendarForm.displayName = "CalendarForm";

export default CalendarForm;
