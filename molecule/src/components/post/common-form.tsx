"use client";

import mermaid from "mermaid";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCodeString } from "rehype-rewrite";

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const Code = ({
  inline,
  children = [],
  className,
  ...props
}: {
  inline?: boolean;
  children: any;
  className: string;
  node: any;
}) => {
  const demoid = useRef(`dome${randomid()}`);
  const [container, setContainer] = useState(null);
  const isMermaid = className && /^language-mermaid/.test(className.toLocaleLowerCase());
  const code = children ? getCodeString(props.node.children) : children[0] || "";

  useEffect(() => {
    if (container && isMermaid && demoid.current && code) {
      mermaid
        .render(demoid.current, code)
        .then(({ svg, bindFunctions }) => {
          // @ts-ignore
          container.innerHTML = svg;
          if (bindFunctions) {
            bindFunctions(container);
          }
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  }, [container, isMermaid, code, demoid]);

  const refElement = useCallback((node: any) => {
    if (node !== null) {
      setContainer(node);
    }
  }, []);

  if (isMermaid) {
    return (
      <>
        <code id={demoid.current} style={{ display: "none" }} />
        <code className={className} ref={refElement} data-name="mermaid" />
      </>
    );
  }
  return <code className={className}>{children}</code>;
};

export default Code;
