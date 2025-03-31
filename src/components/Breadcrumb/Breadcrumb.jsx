import { Group, Title } from "@mantine/core";
import React from "react";
import classes from "./styles.module.css";

function Breadcrumb({ crumbs, navigate }) {
  const goTo = (crumb) => {
    var temp = [];
    for (var i = 0; i < crumbs.length; i++) {
      temp.push(crumbs[i]);
      if (crumbs[i] === crumb) {
        break;
      }
    }
    navigate(temp);
  };
  const makeCrumb = (crumb) => {
    return (
      <Title order={2} className={[crumbs.indexOf(crumb) === crumbs.length - 1 ? "" : classes.underline, classes.crumb]} onClick={() => goTo(crumb)}>
        {crumb}
      </Title>
    );
  };

  return (
    <Group gap={5}>
      {crumbs.map((crumb, index) => (
        <>
          {makeCrumb(crumb)}
          {index < crumbs.length - 1 && <Title order={2}>{">"}</Title>}
        </>
      ))}
    </Group>
  );
}

export default Breadcrumb;
