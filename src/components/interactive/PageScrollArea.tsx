import { useEffect, type ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function PageScrollArea({ children }: { children: ReactNode }) {
  useEffect(() => { void import("../../scripts/site-interactions"); }, []);
  return <ScrollArea className="page-scroll-area" viewportClassName="page-scroll-viewport" type="always">{children}</ScrollArea>;
}
