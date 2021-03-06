import React, { useState } from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  altText?: string;
  fn?: any; // function
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ text, altText, fn, color }) => {
  const [disabled, setDisabled] = useState(false);
  const className: string = color === "red" ? "button button--red" : "button";
  const handleClick = async (event) => {
    if (event) event.preventDefault();
    if (!disabled) {
      setDisabled(true);
      await fn();
      setDisabled(false);
    }
  };
  const getText: () => string = () => {
    if (disabled && altText) {
      // If there is altText and the button is disabled (waiting for response),
      // show altText
      return altText;
    }
    return text;
  };
  return (
    <div className="button-container">
      {fn ? (
        <button onClick={handleClick} disabled={disabled} className={className}>
          {getText()}
        </button>
      ) : (
        <Link href="/signup" passHref>
          <button className={className}>{text ? text : "Start now"}</button>
        </Link>
      )}
    </div>
  );
};

export default Button;
