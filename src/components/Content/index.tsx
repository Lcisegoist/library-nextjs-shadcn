"use client";

import { usePageTitle, PageTitleInfo } from "@/components/PageTitleContext";
import { useEffect } from "react";

export default function Content({
  children,
  title,
  url,
}: {
  children: React.ReactNode;
  title: string;
  url?: string;
}) {
  const { setTitle } = usePageTitle();
  useEffect(() => {
    const pageTitleInfo: PageTitleInfo = {
      title,
      ...(url && { url }),
    };
    setTitle(pageTitleInfo);
    return () => {
      setTitle(null);
    };
  }, [title, url, setTitle]);
  return <div className="p-4">{children}</div>;
}
