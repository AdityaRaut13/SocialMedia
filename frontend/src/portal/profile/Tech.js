import React, { useEffect, useRef, useState } from "react";
import "./Tech1.css";

function Tech(props) {
  const { value, setValue, list: techList } = props;
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const renderIcons = (icon) => {
    return (
      <div className="icon">
        <img src={icon.link} alt={"icon"} />
      </div>
    );
  };
  return (
    <div id="Tech">
      <div className="tech-box">
        {value && value.map((tech) => renderIcons(tech))}
      </div>
      <div className="select-box">
        <div onClick={() => setShow(!show)} className="selected">
          Select Tech Category
        </div>
        {show && (
          <div>
            <div className="search-box">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start Typing..."
              />
            </div>
            <div className="options-container">
              {techList &&
                techList.map((tech) => {
                  if (text !== "" && tech.name.indexOf(text) === -1) return "";
                  return (
                    <div className="option">
                      <label htmlFor={tech.name}>{tech.name}</label>
                      {renderIcons(tech)}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tech;
