import clsx from "clsx";
import { CloseCircle, SearchNormal,Notification } from "iconsax-react";
import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onClear?(): void;
}
const Searchbar = (props: Props) => {
  const { value = "", onClear, onChange, ...rest } = props;

  const [input, setInput] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    onClear?.();
    setInput("");
  };

  return (
    <div
      className={clsx(
        "flex items-center bg-slate-100 h-[35px] w-full rounded-lg mx-2 "
      )}
    >
      <span className="w-9 h-full flex items-center justify-center">
        <SearchNormal />
      </span>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        className="bg-transparent border-0 outline-0 w-full mx-1"
        {...rest}
      />

      {input && (
        <button
          onClick={handleClear}
          className="w-9 h-full flex items-center justify-center"
        >
          <CloseCircle variant="Bold" className="text-neutral-700" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
