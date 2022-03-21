import React from 'react';

function Save(props) {

const [savedColor, setSavedColor] = React.useState({'theme': 'Saved', 'children':[]})

const onSave = () => {
    if (
      !savedColor.children.includes({
        _name: "Saved",
        color: props.currentColor,
      })
    ) {
      savedColor.children.push({
        _name: `Saved ${savedColor.children.length+1}`,
        color: props.currentColor,
      });
      console.log(savedColor);
      props.getSaved(savedColor);
    }
}

    return (
      <div>
        <button id="save" onClick={onSave}>
          Save
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2zm10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" />
          </svg>
        </button>
      </div>
    );
}

export default Save;