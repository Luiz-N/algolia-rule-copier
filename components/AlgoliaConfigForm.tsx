import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";

const AlgoliaConfigForm = ({
  onConfigSubmit,
}: {
  onConfigSubmit: (appId: string, apiKey: string) => void;
}) => {
  const [appId, setAppId] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onConfigSubmit(appId, apiKey);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="p-4 px-4 flex justify-between items-center">
        <div>
          <p className="text-small uppercase font-bold">Load Your Indices</p>
          <small className="text-default-500">
            Enter your Algolia App ID and an ACL enabled API Key to load your
            indices.
          </small>
        </div>
        {appId && apiKey && (
          <Button
            type="submit"
            color={!appId || !apiKey ? "default" : "primary"}
            variant="ghost"
            disabled={!appId || !apiKey}
            onClick={handleSubmit}
          >
            Load Indices
          </Button>
        )}
      </CardHeader>
      <Divider className="my-1" />
      <CardBody>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center gap-4 w-full mx-auto"
        >
          <div className="flex gap-4 w-full">
            <Input
              id="appId"
              type="text"
              value={appId}
              placeholder="Enter The Algolia App ID"
              label="Algolia App ID"
              onChange={(e) => setAppId(e.target.value)}
            />

            <Input
              id="apiKey"
              type="text"
              placeholder="Enter a ACL enabled API Key"
              label="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AlgoliaConfigForm;
