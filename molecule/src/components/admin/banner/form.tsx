"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banner } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/stores/use-admin-store";
import { useMutation } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  mode?: "create" | "edit";
  banner?: Banner;
}

const BannerForm = forwardRef<{ handleSubmit: () => void }, React.HTMLProps<HTMLDivElement> & Props>(function (
  { mode = "create", banner, className, ...props },
  ref,
) {
  const toggleReload = useAdminStore((state) => state.toggleReload);
  const [image, setImage] = useState<File>();
  const [image_url, setImageUrl] = useState<string | null>(banner?.image_url ?? null);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const order = useRef<HTMLInputElement>(null);

  const imageMutation = useMutation({
    mutationFn: (data: { image: File }) => {
      const formData = new FormData();

      formData.append("file", data.image, "banner.png");

      return request.post("/api/attachments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      setImageUrl(response.data.data.url);
      toast.success("이미지가 저장되었습니다");
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; order: number }) => {
      return request.post("/api/admin/banners/", {
        image_url: image_url,
        title: data.title,
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: () => {
      toast.success("배너가 등록되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error("배너 등록에 실패했습니다");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; title: string; description: string; order: number }) => {
      return request.patch(`/api/admin/banners/${data.id}/`, {
        image_url: image_url,
        title: data.title,
        description: data.description ?? "",
        order: data.order,
      });
    },
    onSuccess: () => {
      toast.success("배너가 수정되었습니다");
      toggleReload();
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      imageMutation.mutate({ image: file });

      setImage(file);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: () =>
      mode === "create"
        ? createMutation.mutate({
            title: title.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          })
        : updateMutation.mutate({
            id: banner!.id,
            title: title.current!.value,
            description: description.current!.value,
            order: parseInt(order.current!.value),
          }),
  }));

  useEffect(() => {
    if (!banner) {
      return;
    }

    setImageUrl(banner.image_url);

    title.current!.value = banner.title;
    description.current!.value = banner.description;
    order.current!.value = banner.order.toString();
  }, [banner]);

  return (
    <div className={cn("grid gap-4 py-4", className)} {...props}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image_url" className="text-right">
          배너 이미지
        </Label>
        <Input id="image_url" type="file" accept="image/*" className="col-span-3" onChange={onImageUpload} />
      </div>

      {(image || image_url) && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image_url" className="text-right">
            이미지 미리보기
          </Label>
          <div className="col-span-3">
            <picture>
              <img src={image ? URL.createObjectURL(image) : (image_url as string)} alt="" className="h-auto w-full" />
            </picture>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          제목(선택)
        </Label>
        <Input ref={title} id="title" placeholder="배너 중앙에 표시할 제목입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          설명(선택)
        </Label>
        <Input ref={description} id="description" placeholder="배너 중앙에 표시할 설명입니다" className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="order" className="text-right">
          정렬 순서
        </Label>
        <Input
          ref={order}
          id="order"
          placeholder="숫자가 낮을수록 앞에 배치됩니다"
          className="col-span-3"
          type="number"
          inputMode="numeric"
        />
      </div>
    </div>
  );
});

BannerForm.displayName = "BannerForm";

export default BannerForm;
