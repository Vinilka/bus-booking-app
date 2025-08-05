import Popper from "@mui/material/Popper";

import { useEffect, useRef } from "react";

export default function CustomPopper(props) {
  const anchorEl = props.anchorEl;
  const popperRef = useRef();

  useEffect(() => {
    const el = popperRef.current;
    if (el) {
      if (props.open) {
        el.style.opacity = "1";
        el.style.maxHeight = "300px";
        el.style.pointerEvents = "auto";
      } else {
        el.style.opacity = "0";
        el.style.maxHeight = "0px";
        el.style.pointerEvents = "none";
      }
    }
  }, [props.open]);

  return (
    <Popper
      {...props}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 0],
          },
        },
      ]}
      ref={popperRef}
      style={{
        width: anchorEl?.clientWidth,
        zIndex: 1500,
        overflow: "hidden",
        transition: "opacity 200ms ease, max-height 200ms ease",
      }}
    />
  );
}
