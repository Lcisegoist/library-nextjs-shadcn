//用于传递title参数

import { createContext, useState, useContext, PropsWithChildren } from "react";

export interface PageTitleInfo {
  title: string;
  url?: string;
}

interface PageTitleContextType {
  Title: PageTitleInfo | null;
  setTitle: (title: PageTitleInfo | null) => void;
}

export const pageTitleContext = createContext<PageTitleContextType>({
  Title: null,
  setTitle: () => {},
});

export const PageTitleProvider = ({ children }: PropsWithChildren) => {
  const [pageTitle, setPageTitle] = useState<PageTitleInfo | null>(null);
  return (
    <pageTitleContext.Provider
      value={{ Title: pageTitle, setTitle: setPageTitle }}
    >
      {children}
    </pageTitleContext.Provider>
  );
};

export const usePageTitle = () => {
  return useContext(pageTitleContext);
};
