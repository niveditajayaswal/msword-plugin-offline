import * as React from "react";
import Header from "./Header";
import TextInsertion from "./TextInsertion";
import SelectedText from "./SelectedText";
import { makeStyles } from "@fluentui/react-components";
import { insertText } from "../taskpane";
import { getSelectedData } from "../taskpane";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to server");
});

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />
      {/* <TextInsertion insertText={insertText} /> */}
      <SelectedText getSelectedText={getSelectedData} />
    </div>
  );
};

export default App;
