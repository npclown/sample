import MDEditor from "@uiw/react-md-editor";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function CustomParsedContent({ children }: { children: React.ReactNode | string }) {
  const theme = useTheme();
  const divRef = useRef<any>(null);
  const [more, setMore] = useState<boolean>(false);

  useEffect(() => {
    if (divRef.current) {
      divRef.current?.mdp.current
        .querySelectorAll(".anchor")
        .forEach((element: any) => (element.style.display = "none"));

      if (divRef.current?.mdp.current.scrollHeight > divRef.current?.mdp.current.clientHeight) {
        setMore(false);
      } else {
        setMore(true);
      }
    }
  }, []);

  return (
    <>
      <div data-color-mode={theme.theme === "dark" ? "dark" : "light"} style={{ paddingTop: 15, paddingBottom: 15 }}>
        <MDEditor.Markdown
          ref={divRef}
          disableCopy={true}
          className={clsx("dark:bg-gray-700", more ? "line-clamp-none" : "line-clamp-3")}
          source={children as string}
        />
      </div>
      {!more && (
        <button className="ml-auto mr-0 block cursor-pointer" onClick={(e) => setMore(true)}>
          더보기
        </button>
      )}
    </>
  );
}
