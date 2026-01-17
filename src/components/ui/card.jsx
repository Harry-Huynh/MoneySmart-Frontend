import * as React from "react";

/**
 * Join tailwind class names safely
 */
function joinClassNames(...classNameParts) {
  return classNameParts.filter(Boolean).join(" ");
}

const Card = React.forwardRef(function Card(
  { className, ...otherProps },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      className={joinClassNames(
        "rounded-2xl border border-black/5 shadow-sm",
        className
      )}
      {...otherProps}
    />
  );
});


const CardHeader = React.forwardRef(function CardHeader(
  { className, ...otherProps },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      className={joinClassNames("p-6 pb-2", className)}
      {...otherProps}
    />
  );
});

const CardContent = React.forwardRef(function CardContent(
  { className, ...otherProps },
  forwardedRef
) {
  return (
    <div
      ref={forwardedRef}
      className={joinClassNames("p-6 pt-0", className)}
      {...otherProps}
    />
  );
});

export { Card, CardHeader, CardContent };
