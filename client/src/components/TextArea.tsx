import clsx from "clsx";
import React from "react";

interface TextAreaClasses {
  root: string;
  focused: string;
  disabled: string;
  error: string;
  textArea: string;
}

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  classes?: Partial<TextAreaClasses>;
}

const TextArea = (
  props: TextAreaProps,
  ref: React.Ref<HTMLTextAreaElement>
) => {
  const {
    error,
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    onFocus?.(e);
    setFocus(true);
  };
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
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
    >
      <textarea
        className={clsx(
          "text-[1rem] bg-transparent dark:text-white/90 border-none outline-none w-[95%] text-black dark:text-white",
          classes?.textArea
        )}
        ref={ref}
        value={input}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      ></textarea>
    </div>
  );
};

TextArea.displayName = "TextArea";
export default React.forwardRef(TextArea);
