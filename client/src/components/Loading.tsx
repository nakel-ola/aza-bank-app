import clsx from "clsx";
import React from "react";
import ReactLoading, { LoadingProps } from "react-loading";
import { useTheme } from "../utils/theme";

const Loading = (props: LoadingProps) => {
  const { color, ...rest } = props;
  const { systemTheme, theme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <ReactLoading
      color={currentTheme === "dark" ? "white" : "black"}
      {...rest}
    />
  );
};

export default Loading;
