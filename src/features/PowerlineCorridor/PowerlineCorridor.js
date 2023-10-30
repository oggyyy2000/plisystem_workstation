import React from "react";

export default function PowerlineCorridor() {
  const src3Dmap = `http://epsmarttech.com.vn:3132/examples/T87/T87.html`;

  return (
    <>
      <iframe
        src={src3Dmap}
        title="powerline_corridor"
        style={{ width: "100%", height: "94vh" }}
      />
    </>
  );
}
