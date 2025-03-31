import { Card, Text } from '@mantine/core';
import React from 'react';

import classes from './styles.module.css'

import {IconFolderOpen} from '@tabler/icons-react';


function Folder({name, items, navigate}) {

  const itemsCount = Object.keys(items).length
  
  return (
    <Card className={classes.folder} p={10} width={50} withBorder onClick={() => navigate(name)}>
      <Text className={classes.title} fz={16} fw={600} lineClamp={1}>{name}</Text>
      <Text fz={14}>{`${itemsCount} File${itemsCount > 1 ? "s":""}`}</Text>
      <IconFolderOpen className={classes.icon} size={150} stroke={3}/>
    </Card>
  )
}

export default Folder