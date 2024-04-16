"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getCroppedImg from "@/components/user/setting/crop";
import request from "@/lib/api/request";
import { CustomAxiosError } from "@/lib/definitions";
import { useAuthStore } from "@/store/stores/use-auth-store";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { toast } from "react-toastify";

function CropImage({
  image,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
}: {
  image: File;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  onZoomChange: (zoom: number) => void;
}) {
  return (
    <Cropper
      image={URL.createObjectURL(image)}
      crop={crop}
      zoom={zoom}
      aspect={1}
      cropShape="round"
      showGrid={false}
      onCropChange={onCropChange}
      onCropComplete={onCropComplete}
      onZoomChange={onZoomChange}
    />
  );
}

export default function UploadProfileImage({ image_url }: { image_url?: string }) {
  const toggleReload = useAuthStore((state) => state.toggleReload);
  const [open, setOpen] = React.useState(false);
  const [crop, setCrop] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState<Number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<any>(null);
  const [image, setImage] = useState<File>();
  const [profileImage, setProfileImage] = useState<string | null>(image_url || null);

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setImage(file);
    }
  };

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const imageUpload = useMutation({
    mutationFn: async () => {
      const croppedImage = await getCroppedImg(URL.createObjectURL(image as File), croppedAreaPixels);
      const formData = new FormData();

      formData.append("file", croppedImage as Blob, "profile.png");

      return await request.post("/api/attachments/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        setProfileImage(data.data.data.url);
        profileModify.mutate({ image_url: data.data.data.url });
        toast.success("프로필 사진 업로드에 성공했습니다.");
      } else {
        toast.error("프로필 사진을 변경하는 중 오류가 발생했습니다");
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error("프로필 사진을 변경하는 중 오류가 발생했습니다");
    },
  });

  const profileModify = useMutation({
    mutationFn: async ({ image_url }: { image_url: string }) => {
      return await request.patch("/api/user/profile/", { image_url });
    },
    onSuccess: (data, variables, context) => {
      if (data.data.status === "success") {
        toggleReload();
        toast.success("계정 정보 변경에 성공했습니다.");
      } else {
        toast.error("프로필 사진을 변경하는 중 오류가 발생했습니다");
      }
    },
    onError: (error, variables, context) => {
      // An error happened!
      const { response } = error as CustomAxiosError;
      toast.error("프로필 사진을 변경하는 중 오류가 발생했습니다");
    },
  });

  const onProfileHandle = async () => {
    imageUpload.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <Avatar className="relative h-28 w-28 overflow-hidden rounded-full border border-gray-300">
        <AvatarImage src={profileImage ?? ""} />
        <AvatarFallback>프로필 사진</AvatarFallback>
      </Avatar>

      <Button className="text-sm font-bold">
        <Label htmlFor="profile_image" className="cursor-pointer">
          프로필 사진 변경
        </Label>
        <Input type="file" id="profile_image" className="hidden" accept="image/*" onChange={onImageUpload} />
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className={image ? "max-w-screen-md" : ""}>
          <AlertDialogHeader className="flex flex-col items-center">
            <AlertDialogTitle>프로필 사진 변경하기</AlertDialogTitle>
            <AlertDialogDescription>프로필을 변경하기 위한 사진을 업로드 해주세요.</AlertDialogDescription>

            {image && (
              <div className="relative min-h-80 w-full">
                <CropImage
                  image={image}
                  crop={crop}
                  zoom={zoom as number}
                  onCropChange={onCropChange}
                  onCropComplete={onCropComplete}
                  onZoomChange={onZoomChange}
                />
              </div>
            )}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            {image && <AlertDialogAction onClick={onProfileHandle}>변경하기</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
