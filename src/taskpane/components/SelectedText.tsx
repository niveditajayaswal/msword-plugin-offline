import * as React from "react";
import { useState } from "react";
import { Button, Field, tokens, makeStyles } from "@fluentui/react-components";
import { io } from "socket.io-client";
import { writeToDocument, addLoremIpsum, clearDocument, addParagraph } from "../taskpane";

const socket = io("http://localhost:5000");

interface SelectedTextProps {
  // getSelectedText is a function that returns the promise of a string
  getSelectedText: () => Promise<string>;
}

const useStyles = makeStyles({
  selectedText: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
});

const SelectedText: React.FC<SelectedTextProps> = (props: SelectedTextProps) => {
  const [selectedText, setSelectedText] = useState<String>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("message", (data: object) => {
      writeToDocument(data["text"]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleSelection = async () => {
    let text = await props.getSelectedText();
    setSelectedText(text);
  };
  const handleSendText = async () => {
    try {
      const response = await fetch("http://localhost:5000/save_text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: selectedText }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (response.status === 200) {
        setButtonDisabled(false);
        setSelectedText("");
      }
      //   const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGetText = async () => {
    addParagraph();
    socket.emit("start_stream");
  };

  const styles = useStyles();
  return (
    <div>
      <Button appearance="primary" disabled={false} size="large" onClick={handleSelection}>
        Get selected text
      </Button>
      <Field className={styles.selectedText} size="large" label="Selected text:">
        {selectedText}
      </Field>
      <Button appearance="primary" disabled={selectedText === ""} size="large" onClick={handleSendText}>
        Send to server
      </Button>
      <Button appearance="primary" disabled={buttonDisabled} size="large" onClick={handleGetText}>
        Get from server
      </Button>
      <Button appearance="primary" size="large" onClick={addLoremIpsum}>
        Add Lorem Ipsum
      </Button>
      <Button appearance="primary" size="large" onClick={clearDocument}>
        Clear Document
      </Button>
    </div>
  );
};

export default SelectedText;
