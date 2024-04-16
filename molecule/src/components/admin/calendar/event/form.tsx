"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Event } from "@/lib/admin/definitions";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { format, set, sub } from "date-fns";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  event?: Event;
  calendar?: string;
}

const EventForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", event, calendar, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const start = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLInputElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const price = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const headcount = useRef<HTMLInputElement>(null);
  const point = useRef<HTMLInputElement>(null);
  const note = useRef<HTMLTextAreaElement>(null);

  const [color, setColor] = useState<string>("#0000ff");
  const [type, setType] = useState<string>("non_recruit");
  const [placeType, setPlaceType] = useState<string>("online");
  const [status, setStatus] = useState<string>("active");

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
      status: string;
      headcount?: number;
      point?: number;
      note?: string;
    }) => {
      return request.post(`/api/admin/calendars/${calendar}/events/`, {
        start: data.start,
        end: data.end,
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        color: data.color,
        type: data.type,
        is_team: data.is_team,
        is_online: data.is_online,
        status: data.status,
        headcount: data.headcount,
        point: data.point,
        note: data.note,
      });
    },
    onSuccess: (response) => {
      toast.success("일정을 생성했습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("일정 생성에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      id: string;
      start: string;
      end: string;
      title: string;
      description: string;
      price: number;
      color: string;
      type: string;
      is_team: boolean;
      is_online: boolean;
      status: string;
      headcount?: number;
      point?: number;
      note?: string;
    }) => {
      return request.patch(`/api/admin/calendars/${calendar}/events/${data.id}/`, {
        start: data.start,
        end: data.end,
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        color: data.color,
        type: data.type,
        is_team: data.is_team,
        is_online: data.is_online,
        status: data.status,
        headcount: data.headcount,
        point: data.point,
        note: data.note,
      });
    },
    onSuccess: (response, data) => {
      toast.success("일정을 수정했습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("일정 수정에 실패했습니다");
    },
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () =>
      mode === "create"
        ? createMutation.mutate({
            start: start.current!.value,
            end: end.current!.value,
            title: title.current!.value,
            description: description.current!.value,
            price: Number(price.current!.value),
            color: color,
            type: type,
            is_team: type == "recruit" ? true : false,
            is_online: placeType == "online" ? true : false,
            status: status,
            headcount: Number(headcount.current?.value ?? 0),
            point: Number(point.current?.value ?? 0),
            note: note.current?.value ?? "",
          })
        : updateMutation.mutate({
            id: event!.id,
            start: start.current!.value,
            end: end.current!.value,
            title: title.current!.value,
            description: description.current!.value,
            price: Number(price.current!.value),
            color: color,
            type: type,
            is_team: type == "recruit" ? true : false,
            is_online: placeType == "online" ? true : false,
            status: status,
            headcount: Number(headcount.current?.value ?? 0),
            point: Number(point.current?.value ?? 0),
            note: note.current?.value ?? "",
          }),
  }));

  useEffect(() => {
    if (!event) {
      return;
    }

    start.current!.value = format(event.start, "yyyy-MM-dd HH:mm:ss");
    end.current!.value = format(event.end, "yyyy-MM-dd HH:mm:ss");
    title.current!.value = event.title;
    description.current!.value = event.description;
    price.current!.value = event.price.toString();

    setType(event.recruit ? "recruit" : "non_recruit");
    setPlaceType(event.is_online ? "online" : "offline");
    setColor(event.color);
    setStatus(event.status);
  }, [event]);

  useEffect(() => {
    if (!event) return;

    if (headcount.current && point.current) {
      headcount.current!.value = event.recruit ? event.recruit.headcount.toString() : "0";
      point.current!.value = event.recruit ? event.recruit.point.toString() : "0";
      note.current!.value = event.recruit ? event.recruit.note : "";
    }
  }, [event, type]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="start" className="text-right">
          시작일
        </Label>
        <Input ref={start} id="start" type="datetime-local" placeholder="시작하는 시간입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="end" className="text-right">
          종료일
        </Label>
        <Input ref={end} id="end" type="datetime-local" placeholder="종료되는 시간입니다" className="col-span-3" />
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
          ref={price}
          placeholder="참가비를 입력해주세요, 무료면 0으로 입력해주세요"
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
        <Label htmlFor="type" className="text-right">
          팀원 모집 여부
        </Label>
        <RadioGroup
          value={type}
          onValueChange={(value: string) => {
            setType(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recruit" id="recruit" />
            <Label htmlFor="recruit">모집하기</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non_recruit" id="non_recruit" />
            <Label htmlFor="non_recruit">모집안함</Label>
          </div>
        </RadioGroup>
      </div>

      {type === "recruit" && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="headcount" className="text-right">
              모집 인원 수
            </Label>
            <Input
              ref={headcount}
              id="headcount"
              type="number"
              placeholder="모집할 팀원의 수를 입력해주세요"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="point" className="text-right">
              포인트
            </Label>
            <Input
              ref={point}
              id="point"
              type="number"
              placeholder="모집할 팀원에게 지급할 포인트를 입력해주세요"
              className="col-span-3"
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

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="placeType" className="text-right">
          참여 방법
        </Label>
        <RadioGroup
          value={placeType}
          onValueChange={(value: string) => {
            setPlaceType(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">온라인</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">오프라인</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          활성 여부
        </Label>
        <RadioGroup
          value={status}
          onValueChange={(value: string) => {
            setStatus(value);
          }}
          className="col-span-3 flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending">대기 & 비활성</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">활성</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
});

EventForm.displayName = "EventForm";

export default EventForm;
