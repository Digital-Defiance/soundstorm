import React, { ReactNode, FC, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import NoSsr from '@mui/material/NoSsr';
import Zoom from '@mui/material/Zoom';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from '@mui/material/styles';

import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

type LayoutProps = {
  children: ReactNode;
};

const Layout: FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const open = isLg ? false : openSidebar;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollTo = (id: string) => {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);
      if (!element || !(element instanceof HTMLElement)) {
        return;
      }
      window.scrollTo({ left: 0, top: element.offsetTop, behavior: 'smooth' });
    });
  };

  return (
    <Box
      id="page-top"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.secondary,
        height: '100%',
        paddingTop: '60px',
      }}
    >
      <Header onSidebarOpen={handleSidebarOpen} />
      <Sidebar onClose={handleSidebarClose} open={open} />
      <Box>{children}</Box>
      <Footer />
      <NoSsr>
        <Zoom in={trigger}>
          <Box
            onClick={() => scrollTo('page-top')}
            role="presentation"
            sx={{ position: 'fixed', bottom: 24, right: 32 }}
          >
            <Fab
              color="primary"
              size="small"
              aria-label="scroll back to top"
              sx={{
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: theme.palette.primary.main,
                  border: '2px solid' + theme.palette.primary.main,
                },
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </Box>
        </Zoom>
      </NoSsr>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
