import { Button, Group, Notification, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import React, { useState, useEffect, useRef } from "react";
import Folder from "../Folder/Folder";
import File from "../File/File";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

function FileSystem({ searchParam }) {
  const allData = useRef({});
  const [fileData, setFileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDirectory, setActiveDirectory] = useState(["Home"]);
  const [filteredData, setFilteredData] = useState({});

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("https://api-library.snaplogix.in/files/fetchall");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFileData(data);
        allData.current = data;
        setLoading(false);
      } catch (error) {
        toast(error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if (searchParam.length > 2) {
      const currentData = recursiveAccess(fileData, activeDirectory.slice(1));
      const filtered = Object.entries(currentData).filter(([key, value]) => {
        return key.toLowerCase().includes(searchParam.toLowerCase());
      });
      setFilteredData(Object.fromEntries(filtered));
    } else {
      setFilteredData(recursiveAccess(fileData, activeDirectory.slice(1)));
    }
  }, [searchParam, fileData, activeDirectory]);

  const toast = (message) => {
    return <Notification>{message}</Notification>;
  };

  const stepIn = (directory) => {
    setActiveDirectory([...activeDirectory, directory]);
  };

  const stepBack = ()=>{
    if (activeDirectory.length !== 1)
    setActiveDirectory(activeDirectory.slice(0, activeDirectory.length - 1));
  }

  function recursiveAccess(obj, keys) {
    return keys.reduce((accumulator, key) => {
      return accumulator && accumulator[key];
    }, obj);
  }

  const renderFiles = () => {
    const items = [];
    Object.entries(filteredData).map(([key, value]) => {
      if ("id" in value) {
        items.push(<File name={key} size={value.size} link={value.webContentLink} />);
      } else {
        items.push(<Folder name={key} items={value} navigate={stepIn} />);
      }
    });
    return items;
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Breadcrumb crumbs={activeDirectory} navigate={setActiveDirectory}></Breadcrumb>
        <Group gap={3}>
          <Button width={50} onClick={stepBack} color="red">
            Back
          </Button>
          <Button width={50} onClick={() => document.location.reload()} loading={loading} color="green" loaderProps={{ type: "bars", color: "white" }}>
            Refresh
          </Button>
        </Group>
      </Group>
      {loading ? "Loading Files..." : <SimpleGrid cols={{ xs: 2, sm: 3, md: 4, lg: 5 }}>{renderFiles()}</SimpleGrid>}
    </Stack>
  );
}

export default FileSystem;
