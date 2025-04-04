import { Button, Group, Notification, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import React, { useState, useEffect } from "react";
import Folder from "../Folder/Folder";
import File from "../File/File";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import LazyLoader from "../LazyLoader/LazyLoader";

const getFiles = async (folderId) => {
  const response = await fetch("https://api-library.snaplogix.in/files/fetchFiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folderId: folderId }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

function FileSystem({ searchParam }) {
  const [fileData, setFileData] = useState(JSON.parse(localStorage.getItem("fileData")) || []);
  const [lazyLoading, setLazyLoading] = useState(true);
  const [activeDirectory, setActiveDirectory] = useState([{ name: "Home", link: "root" }]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const data = await getFiles("root");
        localStorage.setItem("fileData", JSON.stringify(data));
        setFileData(data);
        setLazyLoading(false);
      } catch (error) {
        alert(error);
        setLazyLoading(false);
      }
    };
    if (localStorage.getItem("fileData") === null) fetchFiles();
    else setLazyLoading(false);
  }, []);

  useEffect(() => {
    //ultra major final super duper effect before the states are set
    function getSubFiles(obj, key) {
      return fileData.filter((file) => file.parent === key.link);
    }
    const currentData = getSubFiles(fileData, activeDirectory.at(-1));
    let filtered = currentData.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => (a.webContentLink ? 1 : 0) - (b.webContentLink ? 1 : 0));
    if (searchParam.length > 2) {
      filtered = currentData.filter((item) => {
        return item.name.toLowerCase().includes(searchParam.toLowerCase());
      });
    }
    setFilteredData(filtered);
  }, [searchParam, fileData, activeDirectory]);

  useEffect(() => {
    localStorage.setItem("fileData", JSON.stringify(fileData));
  }, [fileData]);

  const stepIn = async (directory, id) => {
    const nextFiles = fileData.filter((file) => file.parent === id);
    if (!nextFiles.length) {
      setLazyLoading(true);
      const data = await getFiles(id);
      setLazyLoading(false);
      localStorage.setItem("fileData", JSON.stringify([...fileData, ...data]));
      setFileData([...fileData, ...data]);
    }
    setActiveDirectory([...activeDirectory, { name: directory, link: id }]);
  };

  const stepBack = () => {
    if (activeDirectory.length !== 1) setActiveDirectory(activeDirectory.slice(0, activeDirectory.length - 1));
  };

  const renderFiles = () => {
    const items = [];
    filteredData.map((item) => {
      if (item.size >= 0) {
        items.push(<File name={item.name} size={item.size} link={item.webContentLink} />);
      } else {
        const itemsCount = fileData.filter((file) => file.parent === item.id).length;
        items.push(<Folder name={item.name} navigate={stepIn} id={item.id} itemsCount={itemsCount} />);
      }
    });
    return items;
  };

  return (
    <Stack>
      {lazyLoading && <LazyLoader />}
      <Group justify="space-between">
        <Breadcrumb crumbs={activeDirectory} navigate={setActiveDirectory}></Breadcrumb>
        <Group gap={3}>
          <Button width={50} onClick={stepBack} color="red">
            Back
          </Button>
          <Button
            width={50}
            onClick={async () => {
              setLazyLoading(true);
              const data = await getFiles(activeDirectory.at(-1).link);
              const existingIds = new Set(fileData.map((file) => file.id));
              const newData = data.filter((item) => !existingIds.has(item.id));
              setFileData([...fileData, ...newData]);
              setLazyLoading(false);
            }}
            loading={lazyLoading}
            color="green"
            loaderProps={{ type: "bars", color: "white" }}
          >
            Refresh
          </Button>
        </Group>
      </Group>
      {!lazyLoading && <SimpleGrid cols={{ xs: 2, sm: 3, md: 4, lg: 5 }}>{renderFiles()}</SimpleGrid>}
    </Stack>
  );
}

export default FileSystem;
