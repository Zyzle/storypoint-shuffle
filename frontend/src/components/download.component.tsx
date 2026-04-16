import { Menu, Portal } from "@skeletonlabs/skeleton-react";
import { DownloadIcon } from "lucide-react";
import { stringify as tStringify } from "smol-toml";

import type { RoomPlan } from "../types";

const handleDownload = (type: string, roomPlan: RoomPlan, cardSet: { [key: string]: number }) => {
  const transformedTickets = roomPlan.tickets.map((ticket) => ({
    ...ticket,
    vote:
      ticket.vote !== -1 ? Object.keys(cardSet).find((key) => cardSet[key] === ticket.vote) : "--",
  }));

  let blobData;
  if (type === "json") {
    blobData = new Blob([JSON.stringify({ tickets: transformedTickets }, null, 2)], {
      type: "application/json",
    });
  } else if (type === "toml") {
    blobData = new Blob([tStringify({ tickets: transformedTickets })], {
      type: "application/toml",
    });
  } else {
    const csvHeaders = Object.keys(transformedTickets[0] || {});
    const csvData = [
      csvHeaders.join(","),
      ...transformedTickets.map((row: { [key: string]: any }) =>
        csvHeaders.map((header: string) => row[header]).join(","),
      ),
    ].join("\n");
    blobData = new Blob([csvData], { type: "text/csv" });
  }

  const url = URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.download = `room-plan.${type}`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function Download({
  roomPlan,
  cardSet,
}: {
  roomPlan: RoomPlan;
  cardSet: { [key: string]: number };
}) {
  return (
    <Menu
      onSelect={(e) => {
        console.log("Selected download type:", e.value);
        handleDownload(e.value, roomPlan, cardSet);
      }}
    >
      <Menu.Trigger className="btn preset-filled" title="Download plan" aria-label="Download plan">
        Download <DownloadIcon size={18} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content className="z-1">
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Download as</Menu.ItemGroupLabel>
              <Menu.Separator />
              <Menu.Item value="json">
                <Menu.ItemText>JSON</Menu.ItemText>
              </Menu.Item>
              <Menu.Item value="toml">
                <Menu.ItemText>TOML</Menu.ItemText>
              </Menu.Item>
              <Menu.Item value="csv">
                <Menu.ItemText>CSV</Menu.ItemText>
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu>
  );
}

export { Download };
