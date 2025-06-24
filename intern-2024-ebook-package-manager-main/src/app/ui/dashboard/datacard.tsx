import { Box, Typography } from "@mui/material";

export default function CardData({
  text,
  data,
}: Readonly<{ text: string; data: number }>) {
  return (
    <Box
      sx={{
        border: "2px solid black",
        backgroundColor: "transparent",
        padding: "20px",
        borderRadius: "10px",
        display: "flex",
        gap: "20px",
        cursor: "pointer",
        width: "20vw",
        height: "100px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "19px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
      <Typography
        sx={{
          fontSize: "23px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        {data}
      </Typography>
    </Box>
  );
}
