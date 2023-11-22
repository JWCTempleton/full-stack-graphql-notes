import { useState } from "react";

const Toggleable = ({ children, buttonLabel, visible, setVisible }) => {
  // const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button style={{ marginTop: "10px" }} onClick={toggleVisibility}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Toggleable;
