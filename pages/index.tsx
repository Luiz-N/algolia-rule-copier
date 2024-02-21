import { useSession, signIn, signOut } from "next-auth/react";
import AlgoliaConfigForm from "../components/AlgoliaConfigForm";
import IndicesList from "../components/IndicesList";
import RulesList from "../components/RulesList";
import TargetIndexSelector from "../components/TargetIndexSelector";
import { useAlgolia } from "@/contexts/AlgoliaContext";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

export default function Home() {
  const { data: session } = useSession();
  const {
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
    setSelectedRules,
    setTargetIndexName,
    handleCopyRules,
  } = useAlgolia();

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-12 py-0 max-w-7xl mx-auto`}
    >
      {!session ? (
        <header
          className={`max-w-7xl mx-auto flex flex-col items-center justify-center`}
        >
          <div className="flex flex-col items-center justify-center provider-button-wrapper">
            <h2 className="text-3xl font-bold my-10">Algolia Rules Copier</h2>
            <Button onClick={() => signIn("github")}>Login with GitHub</Button>
          </div>
        </header>
      ) : (
        <Navbar className="nav-bar">
          <NavbarBrand>
            <h4 className="text-xl font-bold text-inherit">
              Algolia Rules Copier
            </h4>
          </NavbarBrand>

          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex provider-button-wrapper">
              <div>
                <Button onClick={() => signOut()}>
                  {session?.user?.name} - Sign Out
                </Button>
              </div>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      )}

      {session && (
        <div className="flex flex-col items-center justify-center py-10 w-full gap-10">
          <AlgoliaConfigForm onConfigSubmit={setCredentials} />

          {/* TODO: move bottom section into seperate component */}

          <Card className={`w-full mx-auto ${!client && "opacity-50"}`}>
            <CardHeader className="p-4 px-4 flex justify-between items-center">
              <div>
                <p className="text-small uppercase font-bold">
                  Select & Copy Rules
                </p>
                <small className="text-default-500">
                  Select a source index, rules to copy, and a target index to
                  copy the rules to.
                </small>
              </div>
              {sourceIndexName && targetIndexName && selectedRules.size > 0 && (
                <Button
                  disabled={
                    !sourceIndexName || !targetIndexName || !selectedRules.size
                  }
                  isLoading={loading}
                  variant="ghost"
                  color={
                    !selectedRules.size || !targetIndexName
                      ? "default"
                      : "primary"
                  }
                  onClick={handleCopyRules}
                >
                  {`Copy ${selectedRules.size} Rules to ${targetIndexName}`}
                </Button>
              )}
            </CardHeader>
            <Divider className="my-1" />
            <CardBody className="flex flex-row gap-5 w-full justify-between">
              <div className="w-1/3">
                <p className="text-tiny uppercase font-bold">
                  Step 1: Select Source Index
                </p>
                <small className="text-default-500">
                  Select the index to copy rules from.
                </small>

                <IndicesList
                  indices={indices}
                  onSelectIndex={setSourceIndexName}
                  selectedIndex={sourceIndexName}
                />
              </div>
              <div
                className={`w-1/3 ${!sourceIndexName && "opacity-50"} ${
                  !sourceIndexName && "pointer-events-none"
                }`}
              >
                <p className="text-tiny uppercase font-bold">
                  Step 2: Select Rules
                </p>
                <small className="text-default-500">
                  Select the rules to copy from the source index.
                </small>

                <RulesList
                  allRules={sourceIndexRules}
                  selectedRules={selectedRules}
                  onSelectRule={setSelectedRules}
                />
              </div>
              <div
                className={`w-1/3 ${!selectedRules.size && "opacity-50"} ${
                  !selectedRules.size && "pointer-events-none"
                }`}
              >
                <p className="text-tiny uppercase font-bold">
                  Step 3: Select Target Index
                </p>
                <small className="text-default-500">
                  Select the index to copy rules to.
                </small>
                <TargetIndexSelector
                  targetIndexName={targetIndexName}
                  indices={targetIndices}
                  onSelectIndex={setTargetIndexName}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </main>
  );
}
