"use client";

import Filter from "@/components/admin/filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Permission, Permissionable, PermissionableModel, Role } from "@/lib/admin/definitions";
import parseError from "@/lib/api/error";
import request from "@/lib/api/request";
import { usePermissionList } from "@/store/queries/admin/role/permissions";
import { useRolePermissionList } from "@/store/queries/admin/role/role-permissions";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function uniqueByValue<T extends { value: any }>(array: T[]) {
  const seen = new Set();
  return array.filter((item) => {
    const duplicate = seen.has(item.value);
    seen.add(item.value);
    return !duplicate;
  });
}

export default function RolePermission({ roleId }: { roleId: Role["id"] }) {
  const { data: rolePermissions, error: rolePermissionsError } = useRolePermissionList(roleId);
  const { data: permissions, error: permissionsError } = usePermissionList();

  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>();

  const [filterModelValue, setFilterModelValue] = useState<PermissionableModel["id"]>();
  const [filterPermissionableValue, setFilterPermissionableValue] = useState<Permissionable["name"]>();

  const mutation = useMutation({
    mutationFn: (data: { permissionId: Permission["id"]; value: boolean | number }) => {
      if (typeof data.value === "boolean") {
        data.value = data.value ? 1 : 0;
      } else {
        data.value = data.value;
      }

      return request.patch(`/api/admin/roles/${roleId}/permissions/${data.permissionId}/`, {
        value: data.value,
      });
    },
    onSuccess: () => {
      toast.success("권한이 수정되었습니다");
    },
    onError: (err) => {
      toast.error(parseError(err).message);
    },
  });

  useEffect(() => {
    setFilteredPermissions(
      permissions?.filter(
        (permission: Permission) =>
          (!filterModelValue || permission.permission_object.model.id === filterModelValue) &&
          (!filterPermissionableValue || permission.permission_object.object.name === filterPermissionableValue),
      ),
    );
  }, [permissions, filterModelValue, filterPermissionableValue]);

  if (rolePermissionsError) {
    toast.error(parseError(rolePermissionsError).message);
    return <></>;
  }
  if (permissionsError) {
    toast.error(parseError(permissionsError).message);
    return <></>;
  }
  if (!rolePermissions || !permissions) {
    return <div className="rounded-lg bg-white p-4 shadow-md">place skeleton here</div>;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <div className="flex flex-col px-4">
        <span className="text-lg font-bold">권한</span>
        <span>역할에 권한을 부여합니다</span>
      </div>

      <Separator className="mt-4" />

      <div className="flex flex-col gap-4 p-4">
        <div className="mb-2 grid grid-cols-2 gap-2">
          {permissions && (
            <Filter
              className="w-full"
              list={uniqueByValue(
                permissions.map((permission) => {
                  return {
                    label: permission.permission_object.model.label,
                    value: permission.permission_object.model.id,
                  };
                }),
              )}
              filterValue={filterModelValue}
              setFilterValue={setFilterModelValue}
            />
          )}

          {permissions && (
            <Filter
              className="w-full"
              list={uniqueByValue(
                permissions.map((permission) => {
                  return {
                    label: permission.permission_object.object.label,
                    value: permission.permission_object.object.name,
                  };
                }),
              )}
              filterValue={filterPermissionableValue}
              setFilterValue={setFilterPermissionableValue}
            />
          )}
        </div>

        {filteredPermissions?.map((permission) => {
          const id = `permission-${permission.id}`;

          return (
            <div key={permission.id} className="flex items-center gap-2">
              {permission.value_type === "BOOLEAN" ? (
                <Switch
                  id={permission.id.toString()}
                  defaultChecked={rolePermissions?.find((p) => p.permission.id === permission.id)?.value === 1}
                  onCheckedChange={(value) => mutation.mutate({ permissionId: permission.id, value: value })}
                />
              ) : (
                <Input
                  type="number"
                  id={id}
                  defaultValue={rolePermissions?.[0].value}
                  onChange={(e) => mutation.mutate({ permissionId: permission.id, value: e.target.valueAsNumber })}
                />
              )}
              <Label htmlFor={permission.id.toString()} className="flex items-center gap-1">
                <span>[{permission.permission_object.object.label}]</span>
                <span>{permission.name}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
