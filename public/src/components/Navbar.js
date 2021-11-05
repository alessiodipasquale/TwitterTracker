import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';

const Navbar = ({ collapsed, toggled, handleToggleSidebar }) => {
  return (
    <ProSidebar
      image= {false}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: '5 px 24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Twitter Tracker
        </div>
        
      </SidebarHeader>

      <SidebarContent>
      <Menu iconShape="square">
            {SidebarData.map((item, index) => {
              return (
                  <MenuItem icon={item.icon}>{item.title}
                  <Link to={item.path}></Link>
                  </MenuItem> 
              )
            })}
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center', fontSize: '0.8em' }}>
      
        Di Pasquale Alessio<div style={{marginBottom: '3px'}}/>
        Colamonaco Stefano<div style={{marginBottom: '3px'}}/>
        Corradetti Andrea<div style={{marginBottom: '3px'}}/>
        Leonardo Naldi <div style={{marginBottom: '3px'}}/>
        Filip Radović <div style={{marginBottom: '3px'}}/>
      </SidebarFooter>
    </ProSidebar>
  );

 
};


export default Navbar;