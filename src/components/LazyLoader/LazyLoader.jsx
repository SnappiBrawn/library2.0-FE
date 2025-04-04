import { Card, Loader } from "@mantine/core";
import React from "react";

import classes from "./styles.module.css";

function LazyLoader() {
  return (
    <Card className={classes.loaderContainer} onClick={() => {}}>
      <Card className={classes.loader}>
        <Loader size={200}></Loader>
      </Card>
    </Card>
  );
}

export default LazyLoader;
