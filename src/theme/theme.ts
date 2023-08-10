import type { } from '@mui/lab/themeAugmentation';
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface TypeBackground {
    transparent?: string;
    hover?: string;
  }
}

const lightPrimaryMain = '#FE6B8B'
const lightSecondaryMain = '#FF8E53'

const mainTheme = [{
  typography: {
    fontFamily: '"Bai Jamjuree", sans-serif',
    h1: {
      fontWeight: "700",
    },
    // h2: {
    //   fontWeight: "600",
    // },
    // h3: {
    //   fontSize: "3rem",
    //   fontWeight: "800",
    //   lineHeight: 1.167,
    //   marginBottom: "1rem",
    //   overflowWrap: "break-word",
    //   hyphens: "manual",
    // },
    // h4: {
    //   fontSize: "2rem",
    //   fontWeight: "700",
    //   lineHeight: 1.235,
    //   marginBottom: "0.5rem",
    //   overflowWrap: "break-word",
    //   hyphens: "manual",
    // },
    // h5: {
    //   fontSize: "1.5rem",
    //   fontWeight: "700",
    //   lineHeight: 1.6,
    //   letterSpacing: "0.0075em",
    //   marginBottom: "0.5rem",
    //   overflowWrap: "break-word",
    //   hyphens: "manual",
    // },
    // h6: {
    //   fontSize: "1.2rem",
    //   fontWeight: "600",
    //   lineHeight: 1.3,
    //   letterSpacing: "0.0075em",
    //   marginBottom: "0",
    //   overflowWrap: "break-word",
    //   hyphens: "manual",
    // },
    // overline: {
    //   textTransform: 'uppercase',
    //   fontSize: '0.75rem',
    //   display: 'inline-block',
    // },
    body1: {

    },
    body2: {
      fontSize: '1.1667rem',
      lineHeight: '1.5',
      marginBottom: '24px',
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl'
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 0,
          paddoingBottom: 0,
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0
        },
        root: {
          margin: 0
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          // verticalAlign: 'top',
          textTransform: 'none',
        },
        contained: {
          '&:not([disabled])': {
            // color: '#ffffff',
            padding: '0 12px',
            border: `2px solid ${lightPrimaryMain}`,
            background: `linear-gradient(60deg, ${lightPrimaryMain} 30%, ${lightSecondaryMain} 90%)`,
            transition: 'transform .2s ease-out, background .1s ease-out, box-shadow .1s ease-in-out',
            '&:hover': {
              transform: 'translate(1px, 1px)',
              boxShadow: `2px 2px 9px -2px ${lightPrimaryMain}`,
              background: `linear-gradient(90deg, ${lightPrimaryMain} 30%, ${lightSecondaryMain} 90%)`,
            }
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: '16px',
        }
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          borderStyle: 'solid',
          borderWidth: '1px',
          '& input': {
            paddingTop: '10px',
            paddingBottom: '10px',
          },
          '&::before': {
            display: 'none',
          },
          '&::after': {
            display: 'none',
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        filled: {
          paddingTop: '10px',
          paddingBottom: '10px',
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginTop: '0 !important'
        }
      }
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
          // paddingTop: '48px',
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          // fontFamily: '"Inter", sans-serif',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            boxShadow: '0 0 0 100px rgba(144,144,144,0.001) inset !important',
          },
          '&:-internal-autofill-selected': {
            backgroundColor: 'none !important',
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            opacity: 1,
            transition: 'background-color 500ms',
          }
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 8,
          '& .MuiSlider-track': {
            border: 'none',
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid currentColor',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
            '&:before': {
              display: 'none',
            },
          },
          '& .MuiSlider-valueLabel': {
            lineHeight: 1.2,
            fontSize: 12,
            background: 'unset',
            padding: 0,
            width: 32,
            height: 32,
            borderRadius: '50% 50% 50% 0',
            transformOrigin: 'bottom left',
            transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
            '&:before': { display: 'none' },
            '&.MuiSlider-valueLabelOpen': {
              transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
            },
            '& > *': {
              transform: 'rotate(45deg)',
            },
          },
        }
      }
    }
  }
}];

// const lightPrimaryMain = '#3F03DC'



let lightTheme = createTheme({
  palette: {
    background: {
      default: "rgba(255,255,255,1)",
      paper: 'rgba(237,239,238)',
      transparent: 'rgba(210,210,210,0.5)',
    },
    text: {
      primary: 'rgba(23,21,21,1)',
      secondary: 'rgba(160,160,160,1)',
    },
    primary: {
      // main: "#FF2147",
      main: lightPrimaryMain,
    },
    secondary: {
      main: "#3D8AB9",
    },
  },
  typography: {
    fontFamily: '"Bai Jamjuree", sans-serif',
    fontSize: 16,
    body2: {
      color: 'rgba(51,51,51,1)',
    }
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: lightPrimaryMain,
          '&:hover': {
            color: '#000',
          }
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              '& + .MuiSwitch-track': {
                backgroundColor: '#00868F',
              },
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: "#ddd"
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.7,
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#E9E9EA',
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.12)'
        }
      }
    },
  }
}, ...mainTheme);

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: 'rgb(0,1,8)',
      paper: 'rgba(16,19,30)',
      transparent: 'rgba(12,15,27,0.85)',
      hover: '#212737'
    },
    text: {
      primary: 'rgba(244,244,244,1)',
      secondary: 'rgba(160,160,160,1)',
    },
    primary: {
      // main: "#FF2147",
      main: lightPrimaryMain,
    },
    secondary: {
      main: lightSecondaryMain,
    },
    divider: 'rgba(120,150,150,0.25)',
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: '"Bai Jamjuree", sans-serif',
    fontSize: 16,
    body2: {
      color: 'rgba(228,228,228,1)',
    },
    button: {

    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'radial-gradient(at right top, rgba(16,20,34,0.8), rgba(1, 4, 10, 0.8))',
          backdropFilter: "blur(10px)",
          boxShadow: `10px 10px 20px 5px rgba(0,0,0,0.8)`,
          '&:before': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            // height: '1px',
            padding: '1px',
            borderRadius: '15px',
            background: 'linear-gradient(to right, rgba(16,20,34,0.4), rgba(76,32,70,0.1), rgba(120,20,70,0.1), rgba(16,20,34,0.4))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }
        },
      },
    },
    // MuiLink: {
    //   styleOverrides: {
    //     root: {
    //       '&:hover': {
    //         color: 'rgba(244,244,244,1)',
    //       }
    //     }
    //   }
    // },
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              '& + .MuiSwitch-track': {
                backgroundColor: '#9FD2DB',
              },
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: "#666"
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3,
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.12)'
        }
      }
    },
  }
}, ...mainTheme);

export const LightTheme = responsiveFontSizes(lightTheme);

export const DarkTheme = responsiveFontSizes(darkTheme);