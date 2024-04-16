import MDEditor from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";

export default function ParsedContent({ children }: { children: React.ReactNode | string }) {
  const isLaptop = useMediaQuery({ minDeviceWidth: 768 });
  const theme = useTheme();

  return (
    <div
      data-color-mode={theme.theme === "dark" ? "dark" : "light"}
      style={isLaptop ? { paddingTop: 15, paddingBottom: 15 } : { paddingTop: 5, paddingBottom: 10 }}
    >
      <MDEditor.Markdown
        className="bg-inherit dark:bg-inherit"
        style={isLaptop ? { fontSize: 16 } : { fontSize: 14 }}
        source={children as string}
      />
    </div>
  );
}
