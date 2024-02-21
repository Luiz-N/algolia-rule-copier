import React from "react";
export const ListboxWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full  border-small my-2 rounded-small border-default-200 dark:border-default-100 max-h-80 overflow-y-auto">
    {children}
  </div>
);
