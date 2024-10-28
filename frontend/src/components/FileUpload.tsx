import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { Text, Group, Button, rem, useMantineTheme } from "@mantine/core";
import { Dropzone, DropzoneAccept, DropzoneIdle, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import Papa from "papaparse";
import myStore from "~/store";
import FileList from "./FileList";

interface ParsedFile {
  name: string;
  data: Record<string, any>[]; // Using Record to allow any keys
}

const FileUpload = observer(() => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  const handleUpload = (uploadedFile) => {
    uploadedFile.forEach((file) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData: ParsedFile = {
            name: file.name,
            data: results.data,
          };

          myStore.addFile(parsedData);
        },

        error: (error) => {
          console.error("Parsing error:", error);
        },
      });
    });

    console.log("Files Uploaded", myStore.files);
  };

  return (
    <div className="relative mb-8">
      <Dropzone
        openRef={openRef}
        onDrop={handleUpload}
        className="border outline-dashed border-gray-100 rounded-lg p-2 pb-12"
        radius="md"
        accept={[MIME_TYPES.csv, "text/csv", "application/csv", "text/comma-separated-values"]}
        maxSize={30 * 1024 ** 2}
      >
        <div className="pointer-events-none">
          <Group className="!justify-center">
            <Dropzone.Accept>
              <IconDownload className="w-[5rem] h-[5rem]" style={{ strokeWidth: "1.5px", color: theme.colors.blue[6] }} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX className="w-[5rem] h-[5rem]" style={{ strokeWidth: "1.5px", color: theme.colors.red[6] }} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload className="w-[5rem] h-[5rem]" style={{ strokeWidth: "1.5px" }} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>CSV file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload Claim</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. We can accept only <i>.csv </i> files that are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>

      <Button className="absolute w-[250px] left-1/2 -translate-x-1/2 -bottom-[20px]" size="md" radius="xl" onClick={() => openRef.current?.()}>
        Select files
      </Button>

      <FileList />
    </div>
  );
});

export default FileUpload;
