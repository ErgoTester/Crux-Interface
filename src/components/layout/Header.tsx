import React, { FC } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import UserMenu from "@components/user/UserMenu";

const Header: FC = () => {
  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        background: "none",
        mb: "24px",
      }}
    >
      <Box sx={{ mx: 2 }}>
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          sx={{ height: "60px" }}
        >
          {/* User Menu Only */}
          <Grid item>
            <UserMenu />
          </Grid>
        </Grid>
      </Box>
    </AppBar>
  );
};

export default Header;
