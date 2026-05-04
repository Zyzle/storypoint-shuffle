import { FileUpload } from "@skeletonlabs/skeleton-react";
import { FileIcon } from "lucide-react";
import { useState } from "react";
import { parse as tParse } from "smol-toml";
import type { RoomPlanFile } from "../types";

type RoomPlanFileUploadProps = {
  onParsedPlan: (plan: RoomPlanFile | null) => void;
};

async function parseRoomPlanFile(file: File): Promise<RoomPlanFile> {
  const content = await file.text();
  const lowerCaseFileName = file.name.toLowerCase();

  const parsedData: unknown = lowerCaseFileName.endsWith(".toml")
    ? tParse(content)
    : JSON.parse(content);

  if (parsedData === null || typeof parsedData !== "object" || Array.isArray(parsedData)) {
    throw new Error("The room plan must be a JSON object at the root level.");
  }

  return parsedData as RoomPlanFile;
}

function RoomPlanFileUpload({ onParsedPlan }: RoomPlanFileUploadProps) {
  const [parseError, setParseError] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <FileUpload
        accept={{ json: [".json"], toml: [".toml"] }}
        required={true}
        maxFileSize={1 * 1024 * 1024}
        maxFiles={1}
        onFileChange={(details) => {
          if (details.acceptedFiles.length === 0) {
            setParseError(null);
            onParsedPlan(null);
          }
        }}
        onFileAccept={async (details) => {
          const [file] = details.files;

          if (!file) {
            return;
          }

          try {
            const parsedPlan = await parseRoomPlanFile(file);
            setParseError(null);
            onParsedPlan(parsedPlan);
          } catch {
            setParseError("Unable to parse file. Please upload a valid .json or .toml room plan.");
            onParsedPlan(null);
          }
        }}
      >
        <FileUpload.Label>Upload Room Plan</FileUpload.Label>
        <FileUpload.Dropzone>
          <FileIcon className="size-10" />
          <FileUpload.Trigger>Browse Files</FileUpload.Trigger>
          <FileUpload.HiddenInput />
        </FileUpload.Dropzone>
        <FileUpload.ItemGroup>
          <FileUpload.Context>
            {(fileUpload) =>
              fileUpload.acceptedFiles.map((file) => (
                <FileUpload.Item key={file.name} file={file}>
                  <FileUpload.ItemName>{file.name}</FileUpload.ItemName>
                  <FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
                  <FileUpload.ItemDeleteTrigger />
                </FileUpload.Item>
              ))
            }
          </FileUpload.Context>
        </FileUpload.ItemGroup>
        <FileUpload.ClearTrigger>Clear Files</FileUpload.ClearTrigger>
      </FileUpload>
      {parseError && <p className="text-error-500 text-sm">{parseError}</p>}
    </div>
  );
}

export { RoomPlanFileUpload };
