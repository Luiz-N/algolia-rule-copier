import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import algoliasearch, { SearchClient } from "algoliasearch";

export interface AlgoliaIndexType {
  name: string;
  entries: number;
}

export interface RuleType {
  conditions: {}[];
  consequence: {};
  description: string;
  enabled: boolean;
  objectID: string;
}

export interface RuleHash {
  [key: string]: RuleType;
}

interface AlgoliaContextState {
  indices: AlgoliaIndexType[];
  loading: boolean;
  error: Error | null;
  sourceIndexName: string;
  selectedRules: Set<string>;
  sourceIndexRules: RuleHash;
  targetIndexName: string;
  client: SearchClient | null;
  targetIndices: Set<AlgoliaIndexType>;
  setCredentials: (appId: string, apiKey: string) => void;
  setSourceIndexName: (indexName: string) => void;
  setSelectedRules: (rules: Set<string>) => void;
  setSourceIndexRules: (rules: RuleHash) => void;
  setTargetIndexName: (indexName: string) => void;
  handleCopyRules: () => void;
}

const defaultState: AlgoliaContextState = {
  indices: [],
  loading: false,
  error: null,
  sourceIndexName: "",
  selectedRules: new Set<string>(),
  sourceIndexRules: {},
  targetIndexName: "",
  client: null,
  targetIndices: new Set<AlgoliaIndexType>(),
  setCredentials: () => {},
  setSourceIndexName: () => {},
  setSelectedRules: () => {},
  setSourceIndexRules: () => {},
  setTargetIndexName: () => {},
  handleCopyRules: () => {},
};

const AlgoliaContext = createContext<AlgoliaContextState>(defaultState);

export const AlgoliaProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<SearchClient | null>(null);
  const [indices, setIndices] = useState<AlgoliaIndexType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [sourceIndexName, setSourceIndexName] = useState("");
  const [selectedRules, setSelectedRules] = useState(new Set<string>());
  const [sourceIndexRules, setSourceIndexRules] = useState<RuleHash>({});
  const [targetIndexName, setTargetIndexName] = useState("");

  const setCredentials = useCallback((appId: string, apiKey: string) => {
    const newClient = algoliasearch(appId, apiKey);
    console.log({ newClient });
    setClient(newClient);
  }, []);

  const targetIndices = useMemo(() => {
    if (!sourceIndexName) {
      return new Set([]);
    }
    return new Set(
      Array.from(indices).filter((index) => index.name !== sourceIndexName)
    );
  }, [indices, sourceIndexName]);

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    if (client) {
      client
        .listIndices()
        .then(({ items }) => {
          console.log({ indices: items });
          setIndices(items);
        })
        .catch((error) => console.error("Error fetching indices", error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [client]);

  useEffect(() => {
    if (!client || !sourceIndexName) return;
    setTargetIndexName("");
    setSelectedRules(new Set<string>());
    setLoading(true);
    let batchedRules: RuleHash = {};
    client
      .initIndex(sourceIndexName)
      .browseRules({
        batch: (batch: any) => {
          console.log({ batch });

          batch.forEach((rule: RuleType) => {
            batchedRules[rule.objectID] = { ...rule };
            // add multiple dummy rules for testing via for loop
            // for (let i = 0; i < 30; i++) {
            //   const newId = rule.objectID + i;
            //   batchedRules[newId] = { ...rule, objectID: newId };
            // }
          });
        },
      })
      .then(() => {
        setSourceIndexRules(batchedRules);
      })
      .catch((error) => console.error("Error fetching rules", error))
      .finally(() => {
        setLoading(false);
      });
  }, [client, sourceIndexName]);

  const handleCopyRules = useCallback(() => {
    if (!client || !sourceIndexName || !targetIndexName) return;
    setLoading(true);
    const promises: Promise<any>[] = [];
    selectedRules.forEach((ruleId) => {
      const rule = sourceIndexRules[ruleId];
      promises.push(
        client.initIndex(targetIndexName).saveRule({
          ...rule,
        })
      );
    });
    Promise.all(promises)
      .then(() => {
        console.log("Rules copied successfully");
        alert(
          `${selectedRules.size} rules copied successfully to ${targetIndexName}`
        );
      })
      .catch((error) => console.error("Error copying rules", error))
      .finally(() => setLoading(false));
  }, [
    client,
    sourceIndexName,
    targetIndexName,
    selectedRules,
    sourceIndexRules,
  ]);

  return (
    <AlgoliaContext.Provider
      value={{
        indices,
        loading,
        error,
        sourceIndexName,
        selectedRules,
        sourceIndexRules,
        targetIndexName,
        client,
        targetIndices,
        setCredentials,
        setSourceIndexName,
        setSourceIndexRules,
        setTargetIndexName,
        handleCopyRules,
        setSelectedRules,
      }}
    >
      {children}
    </AlgoliaContext.Provider>
  );
};

export const useAlgolia = () => useContext(AlgoliaContext);
