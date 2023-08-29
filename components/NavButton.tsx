import React, { FC } from "react";

interface Props {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavButton: FC<Props> = ({ title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${
        isActive ? "bg-[#036756]" : ""
      } hover:bg-[#036756] text-white py-2 px-4 rounded font-bold`}
    >
      {title}
    </button>
  );
};

export default NavButton;
