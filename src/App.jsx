import { AppShell, MantineProvider, TextInput, Title } from "@mantine/core";
import FileSystem from "./components/FileSystem/FileSystem";

import {IconSearch} from '@tabler/icons-react';
import { Group } from "@mantine/core";
import { useState } from "react";

function App() {
  const [searchParam, setSearchParam] = useState("");

  return (
    <MantineProvider>
      <AppShell header={{ height: {base: 110, sm:50}, padding: "xl"}} padding="md">
        <AppShell.Header bg={"royalblue"}>
          <Group justify="space-between">
            <Group px="md">
              <Title c={"white"}>Library</Title>
            </Group>
            <Group px="md">
              <TextInput placeholder="Enter 2 or more characters to search for a file" style={{width: "90vw", maxWidth: "500px"}} value={searchParam} onChange={(e)=>setSearchParam(e.target.value)} leftSection={<IconSearch/>}/>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main bg={"lightblue"}>
          <FileSystem searchParam={searchParam}/>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
