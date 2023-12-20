import React from "react";
import { useEffect, useState, useRef } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

// const Loading = ({ startFly }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) =>
//         prevProgress >= 100 ? 0 : prevProgress + 20
//       );
//     }, 1000);
//     return () => {
//       clearInterval(timer);
//     };
//   }, [startFly]);

//   return (
//     <Box
//       style={{
//         position: "absolute",
//         zIndex: "2",
//         height: "100%",
//         width: "100%",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.4)",
//       }}
//     >
//       <CircularProgress variant="determinate" value={!startFly ? progress : 100} size={80} />
//       <Box
//         sx={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           right: 0,
//           position: "absolute",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Typography variant="h5" component="div" color="white">
//           {`${Math.round(progress)}%`}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 20;
        const diff2 = Math.random() * 20;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      style={{
        position: "absolute",
        zIndex: "2",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <Box sx={{ width: "60%" }}>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={buffer}
          sx={{ height: "5px" }}
        />
      </Box>
    </Box>
  );
};

export default Loading;
