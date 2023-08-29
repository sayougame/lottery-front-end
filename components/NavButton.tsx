import React, { FC } from "react";

interface Props {
  title: string;
}

const NavButton: FC<Props> = ({ title }) => {
  return (
    <button className="bg-[#036756] text-white py-2 px-4 rounded font-bold">
      {" "}
      {title}
    </button>
  );
};

export default NavButton;
