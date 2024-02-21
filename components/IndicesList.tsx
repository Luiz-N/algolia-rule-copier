import React from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { AlgoliaIndexType } from "@/contexts/AlgoliaContext";

const IndicesList = ({
  onSelectIndex,
  indices,
  selectedIndex,
}: {
  onSelectIndex: (indexName: string) => void;
  indices: AlgoliaIndexType[];
  selectedIndex: string;
}) => {
  return (
    <div>
      <ListboxWrapper>
        <Listbox
          items={indices}
          aria-label="Single selection"
          variant="flat"
          color="primary"
          selectionMode="single"
          disallowEmptySelection={true}
          selectedKeys={new Set([selectedIndex])}
          onSelectionChange={(key) => {
            const name: string = Object.values(key)[0];
            onSelectIndex(name);
          }}
        >
          {(item) => (
            <ListboxItem
              textValue={item.name}
              key={item.name}
              description={`${item.entries} records`}
            >
              {item.name}
            </ListboxItem>
          )}
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};

export default IndicesList;
