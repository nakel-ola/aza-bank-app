import clsx from "clsx";
import {
  ArrowDown2,
  ArrowUp2,
  CloseCircle,
  SearchNormal1,
} from "iconsax-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import Button from "../Button";

type Props = {
  showSearch?: boolean;
  title?: string;
  width?: string;
  toggle?: boolean;
  disableHead?: boolean;
  placeholder?: string;
  rightComponent?: ReactNode;
  searchValue?: string;
  onSearchSubmit?: (e: FormEvent) => void;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Header = (props: Props) => {
  const {
    title = "",
    width,
    showSearch = true,
    placeholder,
    searchValue,
    rightComponent,
    onSearchChange,
    onSearchSubmit,
  } = props;

  return (
    <div
      className={clsx(
        "py-[5px] md:w-full flex items-center justify-between",
        width
      )}
    >
      <p className="text-xl ml-[10px] font-medium text-black dark:text-white whitespace-nowrap">
        {title}
      </p>

      <div className="flex items-center flex-1">
        <div className="ml-auto"></div>
        {showSearch && (
          <InputForm
            placeholder={placeholder}
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          />
        )}

        {rightComponent}
      </div>
    </div>
  );
};

const InputForm = ({
  placeholder,
  onSubmit,
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onSubmit?(e: FormEvent): void;
}) => {
  const [text, setText] = useState(value ?? "");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-slate-100 dark:bg-neutral-800  items-center py-[5px] px-[10px] rounded-full transition-all duration-300 ease hidden md:flex mx-2 ml-auto ${
        text && "flex-[0.6]"
      }`}
    >
      <div className="mr-2">
        {!text && (
          <SearchNormal1
            size={20}
            className="text-slate-500 dark:text-slate-100/50 text-[1rem]"
          />
        )}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e);
        }}
        className="flex-1 outline-0 border-0 bg-transparent dark:text-slate-100 placeholder:dark:text-slate-100/50"
      />

      {text && (
        <CloseCircle
          variant="Bold"
          size={20}
          onClick={() => setText("")}
          className="text-slate-500 text-[1.2rem] dark:text-slate-100/50 "
        />
      )}

      <button
        type="submit"
        className="hidden"
        disabled={text.length < 1}
      ></button>
    </form>
  );
};

export default Header;
