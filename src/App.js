import React, { useState } from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import { Popout } from "react-popout-component";
import ExternalWindowPortal from "./ExternalWindowPortal";
import SimpleMenu from "./SimpleMenu";
import useInterval from "./useInterval";

function App() {
  const [isEjected, setEjected] = useState(false);
  const [count, setCount] = useState(0);
  const content = (
    <div>
      count: {count}
      <SimpleMenu />
    </div>
  );
  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  return (
    <div className="App">
      <Button onClick={() => setEjected(!isEjected)}>Toggle Eject</Button>
      {isEjected ? (
        // <Popout onClose={() => setEjected(false)}>{content}</Popout>
        <ExternalWindowPortal listenForUnload={() => setEjected(false)}>
          {content}
        </ExternalWindowPortal>
      ) : (
        content
      )}
    </div>
  );
}

export default App;
