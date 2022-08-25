import React from "react";
import Accordion from "./List";

function RenderData(props) {
  const fetchData = () => {
    let presetData = require("./presets.json");
    if (props.saved == undefined) {
      // pass
    } else if (
      presetData.content[[presetData.content.length - 1]].theme != "Saved"
    ) {
      presetData.content.push(props.saved);
    } else {
      presetData.content[presetData.content.length - 1] = props.saved;
    }

    console.log(props.saved);
    console.log(presetData);
    return presetData;
  };

  const renderAccordion = React.useMemo(() => {
    return fetchData().content.map((block, i) => (
      <Accordion
        data={fetchData()}
        title={block.theme}
        buttons={block.children.map((child) => child)}
        updatePreset={props.updatePreset}
        saved={props.saved}
      />
    ));
  }, [props.saved.children.length]); // only rerender when saved new items

  return <div>{renderAccordion}</div>;
}

export default RenderData;
