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
            padding: '24px',
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
                  <MenuItem key={item.cName} icon={item.icon}>{item.title}
                  <Link to={item.path}></Link>
                  </MenuItem> 
              )
            })}
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: 'center', fontSize: '0.8em' }}>
      
        Alessio Di Pasquale <br />
        Stefano Colamonaco<br />
        Andrea Corradetti<br />
        Leonardo Naldi <br />
        Filip Radović <br />
      </SidebarFooter>
    </ProSidebar>
  );
};


export default Navbar;