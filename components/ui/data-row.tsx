import React from "react";
import clsx from "clsx";

type DataRowProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

const DataRow = ({ label, children, className }: DataRowProps) => {
  return (
    <div className={clsx("flex border-b border-border", className)}>
      <div className="bg-muted text-muted-foreground font-medium px-4 py-3 w-1/2 border-r border-border">
        {label}
      </div>
      <div className="px-4 py-3 w-1/2">{children}</div>
    </div>
  );
};

export default DataRow;
