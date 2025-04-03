import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Slider, Typography, Box } from '@mui/material';

const AppSettings = ({ open, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (setting, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: settings.darkMode ? '#1a1a1a' : '#ffffff',
          color: settings.darkMode ? '#ffffff' : '#000000'
        }
      }}
    >
      <DialogTitle>App Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {/* Dark Mode Toggle */}
          <FormControl fullWidth>
            <InputLabel>Theme</InputLabel>
            <Select
              value={localSettings.darkMode ? 'dark' : 'light'}
              onChange={(e) => handleChange('darkMode', e.target.value === 'dark')}
              label="Theme"
            >
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>

          {/* Font Size Slider */}
          <Box>
            <Typography gutterBottom>Font Size</Typography>
            <Slider
              value={localSettings.fontSize}
              onChange={(e, value) => handleChange('fontSize', value)}
              min={12}
              max={24}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          {/* Font Type Select */}
          <FormControl fullWidth>
            <InputLabel>Font Type</InputLabel>
            <Select
              value={localSettings.fontType}
              onChange={(e) => handleChange('fontType', e.target.value)}
              label="Font Type"
            >
              <MenuItem value="serif">Serif</MenuItem>
              <MenuItem value="sans-serif">Sans Serif</MenuItem>
              <MenuItem value="monospace">Monospace</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppSettings;
