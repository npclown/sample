import { Badge } from "../ui/badge";

const PostTitle = ({ boardLabel, postTitle }: { boardLabel: string; postTitle: string }) => {
  return (
    <div className="flex items-center gap-2 break-all">
      <h1 className="text-xl md:text-2xl">{postTitle}</h1>
    </div>
  );
};

export default PostTitle;
