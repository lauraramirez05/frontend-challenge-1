import { Button, Group, Text } from "@mantine/core";
import myStore from "~/store";
import { observer } from "mobx-react-lite";

const FileList = observer(() => {
  return (
    <div>
      {myStore.files.map((file, index) => (
        <Group key={index} mb="xs">
          <Text>{file.name}</Text>
          <Button variant="outline" color="red" onClick={() => myStore.removeFile(file)}>
            Delete
          </Button>
        </Group>
      ))}
    </div>
  );
});

export default FileList;
