import clsx from "clsx";
import React from "react";

interface InputClasses {
  root: string;
  focused: string;
  disabled: string;
  adornedStart: string;
  adornedEnd: string;
  error: string;
  input: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  endAdornment?: React.ReactNode;
  startAdornment?: React.ReactNode;
  classes?: Partial<InputClasses>;
}

const Input = (props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    error,
    endAdornment,
    startAdornment,
    className,
    classes,
    type,
    value,
    readOnly = false,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const [focus, setFocus] = React.useState<boolean>(false);

  const [input, setInput] = React.useState<
    string | number | readonly string[] | undefined
  >(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocus?.(e);
    setFocus(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onBlur?.(e);
    setFocus(false);
  };

  return (
    <div
      className={clsx(
        "w-full rounded-lg flex items-center justify-center p-[5px] mt-[8px] transition-all duration-300 ease hover:shadow-sm bg-slate-100 dark:bg-neutral-800 ring-2 ring-offset-2",
        error ? "ring-error" : "",
        focus
          ? "ring-primary/30 ring-offset-primary/80"
          : "ring-transparent ring-offset-transparent",
        className,
        classes?.root
      )}
      onMouseOver={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      {startAdornment}
      <input
        className={clsx(
          "text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white",
          classes?.input
        )}
        ref={ref}
        type={type}
        value={input}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      {endAdornment}
    </div>
  );
};

Input.displayName = "Input";
export default React.forwardRef(Input);
