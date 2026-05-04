import { useState } from "react";
import { FloatingPanel, Portal, Tabs } from "@skeletonlabs/skeleton-react";
import { Info, XIcon } from "lucide-react";
import { CodeBlock } from "./codeblock.component";

function PlanInfoPanel() {
  const [jsontoml, setJsontoml] = useState("json");

  return (
    <FloatingPanel size={{ width: 800, height: 400 }}>
      <FloatingPanel.Trigger
        className="btn-icon"
        aria-label="Room Plan Info"
        title="Room Plan Info"
      >
        <Info size={18} />
      </FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner className="z-50">
          <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
              <FloatingPanel.Header>
                <FloatingPanel.Title>Room Plan Format</FloatingPanel.Title>
                <FloatingPanel.Control>
                  <FloatingPanel.CloseTrigger>
                    <XIcon className="size-4" />
                  </FloatingPanel.CloseTrigger>
                </FloatingPanel.Control>
              </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body>
              <p>
                Room plans can be uploaded in either JSON or TOML format, the structure should
                follow the schema shown below:
              </p>

              <Tabs value={jsontoml} onValueChange={(e) => setJsontoml(e.value)}>
                <Tabs.List>
                  <Tabs.Trigger value="json" className="flex-1">
                    JSON
                  </Tabs.Trigger>
                  <Tabs.Trigger value="toml" className="flex-1">
                    TOML
                  </Tabs.Trigger>
                  <Tabs.Indicator />
                </Tabs.List>

                <Tabs.Content value="json" className="flex justify-center">
                  <CodeBlock
                    lang="json"
                    code={`{
  "card_set": "fibonacci",
  "tickets": [
    {
      "name": "Ticket 1",
      "description": "This is the first ticket."
    },
    {
      "name": "Ticket 2",
      "description": "This is the second ticket."
    }
  ]
}`}
                  ></CodeBlock>
                </Tabs.Content>
                <Tabs.Content value="toml" className="flex justify-center">
                  <CodeBlock
                    lang="toml"
                    code={`card_set = "fibonacci" # one of fibonacci or t-shirt

[[tickets]]
name = "Ticket 1"
description = "This is the first ticket."

[[tickets]]
name = "Ticket 2"
description = "This is the second ticket."
`}
                  ></CodeBlock>
                </Tabs.Content>
              </Tabs>
            </FloatingPanel.Body>
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel>
  );
}

export { PlanInfoPanel };
