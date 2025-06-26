import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";

export default function Sidenavbar() {
  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: blue,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <Box>
      <Drawer
        sx={{
          width: "240px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "240PX",
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box display="flex" justifyContent="center" padding="25px">
          <Avatar variant="square" {...stringAvatar("Manager App")} />
          <Typography align="center" variant="inherit" padding="10px">
            Manager App
          </Typography>
        </Box>

        <Divider />
        <List>
          <Link
            href="/dashboard"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            href="/processes"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Process" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </Box>
  );
}
