"use client";

import NotificationList from "@/components/notification/list";

export default function Page() {
  return (
    <div className="mx-auto max-w-[640px] space-y-4 bg-background p-[20px] dark:bg-gray-700">
      <div className="space-y-2">
        <h3 className="text-xl font-bold dark:text-gray-300 md:text-2xl">알림 내역</h3>
        <p className="text-xs text-muted-foreground md:text-sm">알림 메시지는 2주간 보관됩니다.</p>
      </div>
      <NotificationList />
    </div>
  );
}
