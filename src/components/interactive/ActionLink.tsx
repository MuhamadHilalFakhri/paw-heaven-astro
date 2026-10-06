import type { ComponentProps } from "react";
import { Button } from "../ui/button";

export default function ActionLink({ className = "paw-button", children, ...props }: ComponentProps<"a">) {
  return <Button asChild className={className}><a {...props}>{children}</a></Button>;
}
