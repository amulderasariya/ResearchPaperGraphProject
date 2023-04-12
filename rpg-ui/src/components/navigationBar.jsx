import { Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();
  let [selectedTab, setSelectedTab] = useState('/');
  useEffect(() => {
    let defaultValue = '/';
    if (location.pathname.startsWith('/papers')) {
      defaultValue = '/papers';
    }
    if (location.pathname.startsWith('/authors')) {
      defaultValue = '/authors';
    }
    if (location.pathname.startsWith('/fos')) {
      defaultValue = '/fos';
    }
    setSelectedTab(defaultValue);
  }, [location.pathname]);

  const nav = useNavigate();
  return (
    <Tabs
      onClick={() => {
        nav(selectedTab);
      }}
      value={selectedTab}
      onChange={(event, value) => {
        selectedTab = value;
        setSelectedTab(value);
      }}
      centered
    >
      <Tab value="/" label="Home" />
      <Tab value="/papers" label="Papers" />
      <Tab value="/authors" label="Authors" />
      <Tab value="/fos" label="Field of Study" />
    </Tabs>
  );
}
