import { Anchor, Card, Chip, Group, Stack, Text } from "@mantine/core";
import React from "react";

import { IconFileWord, IconPdf, IconFile, IconUser, IconLineHeight } from "@tabler/icons-react";
import classes from "./styles.module.css";

function File({ name, size, link }) {
  const filename = name.split(".").slice(0, -1).join(".");
  const filetype = name.split(".").pop();
  const Icon = filetype === "docx" ? IconFileWord : filetype === "pdf" ? IconPdf : IconFile;
  const IconColor = filetype === "docx" ? "royalblue" : filetype === "pdf" ? "red" : "lightblue";
  return (
    <Anchor href={link} underline="never" target="_blank">
      <Card className={classes.file} p={10} width={50} withBorder bg={IconColor}>
        <Text fz={16} fw={600} lineClamp={1}>
          {filename}
        </Text>
        <Group justify="space-between">
          <Stack gap={0}>
            <Group align="center" gap={3}>
              <IconUser size={14} />
              <Text fz={14} fw={500}>
                Admin
              </Text>
            </Group>
            <Group align="center" gap={3}>
              <IconLineHeight size={12} />
              <Text fz={10}>{` ${Math.round(size / 1024)}kb`}</Text>
            </Group>
          </Stack>
          <Group>
            <Card c="white" p={"5 10"} bg={IconColor} className={classes.chip}>
              {filetype}
            </Card>
          </Group>
        </Group>
        <Icon className={classes.icon} size={150} stroke={2} color={IconColor} />
      </Card>
    </Anchor>
  );
}

export default File;
