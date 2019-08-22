import React from "react";
import ReactDOM from "react-dom";
import { create } from "jss";
import { StylesProvider, jssPreset } from "@material-ui/styles";
import { copyStyles } from "./utils";
const jssInsertionPointId = "jss-insertion-point";

class ExternalWindowPortal extends React.Component {
  state = {
    el: null,
    win: null
  };

  render() {
    const { el, win } = this.state;
    if (!el) {
      return null;
    }
    const jss = create({
      ...jssPreset(),
      // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
      insertionPoint: win.document.getElementById(jssInsertionPointId)
    });
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(
      <StylesProvider jss={jss}>{this.props.children}</StylesProvider>,
      // this.props.children,
      el
    );
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    const win = window.open(
      "",
      "myWindowName",
      "width=600,height=400,left=200,top=200"
    );

    copyStyles(document, win.document);
    // copyScripts(document, win.document);

    let el = document.createElement("div");
    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    win.document.body.appendChild(el);
    const insertEl = document.createElement("noscript");
    insertEl.id = jssInsertionPointId;
    win.document.head.appendChild(insertEl);

    if (this.props.listenForUnload) {
      win.onbeforeunload = () => {
        this.props.listenForUnload();
      };
    }

    this.setState({
      win,
      el
    });
  }

  componentWillUnmount() {
    // STEP 5: This will fire when this.state.showExternalWindowPortal in the parent component becomes false
    // So we tidy up by closing the window
    this.state.win.close();
  }
}

export default ExternalWindowPortal;
