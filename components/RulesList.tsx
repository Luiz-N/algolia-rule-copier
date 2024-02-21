import React, { useMemo } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { ListboxWrapper } from "./ListboxWrapper";
import { RuleHash } from "@/contexts/AlgoliaContext";

const RulesList = ({
  onSelectRule,
  allRules,
  selectedRules,
}: {
  onSelectRule: (rules: Set<string>) => void;
  allRules: RuleHash;
  selectedRules: Set<string>;
}) => {
  const rulesArray = useMemo(() => Object.values(allRules), [allRules]);

  return (
    <div>
      <ListboxWrapper>
        <Listbox
          items={rulesArray}
          aria-label="Single selection"
          variant="flat"
          color="primary"
          defaultSelectedKeys={"all"}
          selectionMode="multiple"
          selectedKeys={selectedRules as any}
          onSelectionChange={(keys) => {
            if (keys === "all") {
              onSelectRule(
                new Set(Object.values(allRules).map((rule) => rule.objectID))
              );
            } else {
              onSelectRule(keys as unknown as Set<string>);
            }
          }}
        >
          {(item) => {
            return (
              <ListboxItem
                key={item.objectID}
                textValue={item.objectID}
                description={item.objectID}
              >
                {item.description || item.objectID}
              </ListboxItem>
            );
          }}
        </Listbox>
      </ListboxWrapper>
    </div>
  );
};

export default RulesList;
