import React from "react";
import { Box } from "@mui/material";
import BookIcon from "@mui/icons-material/BookmarkAdded";

const AnimatedBookIcon: React.FC = () => {
  return (
    <Box
      sx={{
        width: 60,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "primary.main",
        borderRadius: 1,
        transition: "transform 0.6s ease-in-out, box-shadow 0.5s ease-in-out",
        "&:hover": {
          transform: "scale(1.4)",
          boxShadow: 10,
        },
      }}
    >
      <BookIcon sx={{ fontSize: 40, color: "white" }} />
    </Box>
  );
};

export default AnimatedBookIcon;
