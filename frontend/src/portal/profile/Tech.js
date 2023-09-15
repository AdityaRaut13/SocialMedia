import React, { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import "./Tech.css";

function Tech(props) {
  const { value, setValue, list: techList, isWorkedOn } = props;
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const renderBoxIcon = (tech) => {
    return (
      <div
        key={`TechBoxIcons_${isWorkedOn}_${tech._id}`}
        onClick={() => {
          let newValue = [];
          value.forEach((selectedTech) => {
            if (selectedTech.name !== tech.name) newValue.push(selectedTech);
          });
          setValue(newValue, isWorkedOn);
        }}
        className="tech-icon">
        <div className="tech-box-icon">
          <img src={tech.link} alt={"icon"} />
        </div>
        <ImCancelCircle style={{ color: "red" }} />
      </div>
    );
  };
  const renderIcon = (icon) => {
    return (
      <div className="icon">
        <img src={icon.link} alt={"icon"} />
      </div>
    );
  };
  return (
    <div id="Tech">
      <div className="tech-box">
        {value && value.map((tech) => renderBoxIcon(tech))}
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
                    <div
                      key={`TechOptions_${isWorkedOn}_${tech._id}`}
                      onClick={() => {
                        let isPresent = false;
                        value.forEach((selectedTech) => {
                          if (selectedTech.name === tech.name) isPresent = true;
                        });
                        if (!isPresent) {
                          value.push(tech);
                          setValue(value, isWorkedOn);
                        }
                      }}
                      className="option">
                      <label htmlFor={tech.name}>{tech.name}</label>
                      {renderIcon(tech)}
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
