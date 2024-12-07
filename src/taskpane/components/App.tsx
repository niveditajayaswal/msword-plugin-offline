import * as React from "react";

import ChatBot from "./ChatBot";

import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <ChatBot />
    </div>
  );
};

export default App;
