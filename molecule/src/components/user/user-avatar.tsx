import { capitalize, cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserAvatar = ({
  className,
  profile_image,
  name = "ion",
}: {
  className?: string;
  profile_image?: string;
  name?: string;
}) => {
  const username = name == "" ? "Ion" : name;

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={profile_image} />
      <AvatarFallback className="text-lg">{capitalize(username.substring(0, 3))}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
