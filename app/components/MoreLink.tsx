import Link from "next/link";
import { TbChevronRight } from "react-icons/tb";

import classes from "./MoreLink.module.css";

export function MoreLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={classes.root}>
      {children}
      <TbChevronRight size={13} />
    </Link>
  );
}
