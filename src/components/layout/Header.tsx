import React, { FC, useEffect, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  Fade,
  Divider,
  IconButton,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
} from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@components/Link";

// --- Theme Context Re-enabled ---
import { ThemeContext } from "@contexts/ThemeContext";
import { DarkTheme, LightTheme } from "@theme/theme";

import Logo from "@components/svgs/Logo";
import NotificationsMenu from "@components/notifications/NotificationsMenu";
import UserMenu from "@components/user/UserMenu";
import MenuIcon from "@mui/icons-material/Menu";
import ClearIcon from "@mui/icons-material/Clear";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import SocialGrid from "./SocialGrid";
import { useRouter } from "next/router";
import { useScrollLock } from "@contexts/ScrollLockContext";

const pages = [
  { name: "Tokens", link: "/" },
  { name: "Portfolio", link: "/portfolio" },
  { name: "Accounting", link: "/accounting" },
  { name: "About", link: "/about" },
];

interface INavItemProps {
  size?: number;
  fontWeight?: number;
  page: {
    name: string;
    link: string;
    disabled?: boolean;
  };
}

interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
  // ---------------- Re-enabled Theme Context ----------------
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === LightTheme ? DarkTheme : LightTheme
    );

    const mode = theme === LightTheme ? "dark" : "light";
    localStorage.setItem("darkToggle", mode);
  };
  // ----------------------------------------------------------

  const { lockScroll, unlockScroll, isLocked, scrollBarCompensation } =
    useScrollLock();

  const muiTheme = useTheme();
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  useEffect(() => {}, [isLocked, scrollBarCompensation]);

  const router = useRouter();
  const upMd = useMediaQuery(muiTheme.breakpoints.up("md"));
  const upLg = useMediaQuery(muiTheme.breakpoints.up("lg"));

  const handleDialogOpen = () => {
    lockScroll();
    setNavbarOpen(false);
    setNotificationsOpen(true);
  };

  const handleDialogClose = () => {
    unlockScroll();
    setNotificationsOpen(false);
  };

  const handleNavbarToggle = () => {
    if (navbarOpen === true) {
      unlockScroll();
      setNavbarOpen(false);
    } else {
      lockScroll();
      setNavbarOpen(true);
      setNotificationsOpen(false);
    }
  };

  const handleNavbarDialogClose = () => {
    unlockScroll();
    setNavbarOpen(false);
  };

  const NavigationListItem: React.FC<INavItemProps> = ({
    size,
    fontWeight,
    page,
  }) => {
    return (
      <Grid item>
        <Box sx={{ display: "inline-block", position: "relative" }}>
          {page.disabled ? (
            <Typography
              sx={{
                color: muiTheme.palette.text.secondary,
                fontSize: size ? size + "px" : "16px",
                textDecoration: "none",
                fontWeight: fontWeight || 600,
                px: "8px",
              }}
            >
              {page.name}
            </Typography>
          ) : (
            <Box onClick={() => !upMd && handleNavbarToggle()}>
              <Link
                href={page.link}
                sx={{
                  color:
                    router.pathname.includes(page.link)
                      ? muiTheme.palette.primary.main
                      : muiTheme.palette.text.primary,
                  "&:hover": { color: muiTheme.palette.primary.main },
                }}
              >
                <Typography
                  sx={{
                    fontSize: size ? `${size}px` : "16px",
                    textDecoration: "none",
                    fontWeight: fontWeight || 500,
                    px: "8px",
                  }}
                >
                  {page.name}
                </Typography>
              </Link>
            </Box>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <>
      <AppBar
        position="relative"
        elevation={12}
        sx={{
          zIndex: 91,
          border: "none",
          backdropFilter: "none",
          borderRadius: "0px",
          background:
            navbarOpen || notificationsOpen
              ? muiTheme.palette.background.default
              : "none",
          boxShadow: "none!important",
          transition: "background 200ms, box-shadow 200ms, top 400ms",
          mb: "24px",
        }}
      >
        <Box sx={{ mx: 2 }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{
              // Original height:
              // height: "90px",
              height: "60px", // *** SMALLER HEADER HEIGHT ***
              transition: "height 400ms",
            }}
          >
            {/* LOGO + TEXT */}
            <Grid item alignItems="center">
              <Link
                href="/"
                sx={{
                  display: "block",
                  "&:hover": {
                    "& span": { color: muiTheme.palette.primary.main },
                    "& .MuiSvgIcon-root": {
                      color: muiTheme.palette.primary.main,
                    },
                  },
                }}
              >
                <Logo
                  sx={{
                    width: 30, // *** SMALLER LOGO ***
                    height: 30, // *** SMALLER LOGO ***
                    display: "inline-block",
                    verticalAlign: "middle",
                    mr: "3px",
                    color: muiTheme.palette.text.primary,
                  }}
                />

                <Typography
                  component="span"
                  sx={{
                    color: muiTheme.palette.text.primary,
                    fontSize: "1.2rem!important", // smaller
                    fontWeight: "700",
                    lineHeight: 1,
                    display: upLg ? "inline-block" : "none",
                    verticalAlign: "middle",
                    fontFamily: '"Jura", sans-serif',
                  }}
                >
                  Crux Finance
                </Typography>
              </Link>
            </Grid>

            {/* DESKTOP NAV */}
            <Grid item sx={{ display: { xs: "none", md: "flex" } }}>
              <Grid container spacing={2}>
                {pages.map((page, i) => (
                  <NavigationListItem
                    size={16}
                    key={i}
                    page={page}
                    fontWeight={500}
                  />
                ))}
              </Grid>
            </Grid>

            {/* RIGHT SIDE ICONS */}
            <Grid item>
              <Grid container spacing={2} alignItems="center">

                {/* === THEME SWITCHER RE-ENABLED === */}
                <Grid item>
                  <IconButton
                    onClick={toggleTheme}
                    sx={{ color: muiTheme.palette.text.primary }}
                  >
                    {theme === DarkTheme ? (
                      <Brightness7Icon />
                    ) : (
                      <Brightness4Icon />
                    )}
                  </IconButton>
                </Grid>

                {/* NOTIFICATIONS */}
                <Grid item>
                  <NotificationsMenu
                    dialogOpen={notificationsOpen}
                    setDialogOpen={setNotificationsOpen}
                    handleDialogClose={handleDialogClose}
                    handleDialogOpen={handleDialogOpen}
                  />
                </Grid>

                {/* USER MENU */}
                <Grid item>
                  <UserMenu />
                </Grid>

                {/* MOBILE MENU BTN */}
                <Grid item sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton sx={{ p: 0 }} onClick={handleNavbarToggle}>
                    {!navbarOpen ? (
                      <MenuIcon color="primary" />
                    ) : (
                      <ClearIcon color="primary" />
                    )}
                  </IconButton>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
        </Box>
      </AppBar>

      {/* MOBILE NAV DRAWER */}
      <Dialog
        open={navbarOpen}
        onClose={handleNavbarDialogClose}
        fullScreen
        sx={{
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogContent>
          <IconButton
            sx={{
              position: "fixed",
              top: "25px",
              right: isLocked ? `${scrollBarCompensation + 8}px` : "8px",
            }}
            onClick={handleNavbarToggle}
          >
            <ClearIcon color="primary" />
          </IconButton>

          <Box sx={{ height: "100%", pb: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
                pb: 2,
              }}
            >
              {/* NAV ITEMS */}
              <Box>
                <Grid
                  container
                  spacing={5}
                  direction="column"
                  alignItems="flex-start"
                  sx={{ mb: 3 }}
                >
                  {pages.map((page) => (
                    <NavigationListItem
                      size={24}
                      key={page.name}
                      page={page}
                    />
                  ))}
                </Grid>
              </Box>

              {/* SOCIALS */}
              <Box>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Divider />
                  </Grid>

                  <Grid item>
                    <Typography
                      variant="h5"
                      gutterBottom
                      fontWeight="800"
                      fontSize="14px"
                    >
                      Follow us on social media
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 4 }} fontSize="14px">
                      Interacting with our socials helps us reach a wider
                      audience.
                    </Typography>

                    <Grid container direction="row" spacing={3} sx={{ fontSize: "24px" }}>
                      <SocialGrid
                        telegram="https://t.me/CruxFinance"
                        discord="https://discord.gg/tZEd3PadtD"
                        github="https://github.com/cruxfinance"
                        twitter="https://twitter.com/cruxfinance"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
