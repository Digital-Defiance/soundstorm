import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { useAuth0 } from '@auth0/auth0-react'; // Assuming you're using the Auth0 React SDK

import DashboardHeader from '../components/DashboardHeader';
import Spacer from '../components/Spacer';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { getAccessTokenSilently } = useAuth0();
  const [searchFields, setSearchFields] = useState({
    name: '',
    entry1: '',
    vendor: '',
    bcvendor: '',
  });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    const updatedFields = { ...searchFields, [name]: value };
    setSearchFields(updatedFields);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(async () => {
      const token = await getAccessTokenSilently();

      // Filter out empty fields
      const nonEmptyFields = Object.entries(updatedFields)
        .filter(([_, val]) => val.trim() !== '')
        .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
        .join('&');

      // Only make the fetch call if there are non-empty fields
      if (nonEmptyFields) {
        fetch(`/api/sounds?${nonEmptyFields}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      }
    }, 500);

    setTimeoutId(newTimeoutId);
  };

  return (
    <>
      <Helmet>
        <title>SoundStorm Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: '100%',
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <DashboardHeader />

            {/* Two Column Layout */}
            <Grid container spacing={3}>
              {/* Left Column for Search Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  variant="outlined"
                  value={searchFields.name}
                  onChange={handleSearchChange}
                />
                <Spacer sx={{ pt: 2 }} />
                <TextField
                  fullWidth
                  label="Title"
                  name="entry1"
                  variant="outlined"
                  value={searchFields.entry1}
                  onChange={handleSearchChange}
                />
                <Spacer sx={{ pt: 2 }} />
                <TextField
                  fullWidth
                  label="Vendor"
                  name="vendor"
                  variant="outlined"
                  value={searchFields.vendor}
                  onChange={handleSearchChange}
                />
                <Spacer sx={{ pt: 2 }} />
                <TextField
                  fullWidth
                  label="Bank Chain Vendor"
                  name="bcvendor"
                  variant="outlined"
                  value={searchFields.bcvendor}
                  onChange={handleSearchChange}
                />
              </Grid>

              {/* Right Column for Search Results */}
              <Grid item xs={12} md={6}>
                {/* Placeholder for search results */}
                <Box
                  sx={{
                    minHeight: '300px',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '4px',
                    padding: '16px',
                  }}
                >
                  Search results will appear here.
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Spacer sx={{ pt: 7 }} />
    </>
  );
};

export default Dashboard;
