import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaBars, FaGithub } from 'react-icons/fa';

/**
 * Object that contains navbar definition and style
 */

const Navbar = ({ collapsed, toggled, handleToggleSidebar }) => {
  return (
    <>
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
      
      <div
          className="sidebar-btn-wrapper"
          style={{
            padding: '20px 24px',
          }}
        >
          <a
            href="https://aminsep.disi.unibo.it/gitlab/gruppo-4/progetto-swe"
            target="_blank"
            className="sidebar-btn"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              View Source
            </span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
    <div className="btn-toggle" style={{position: 'absolute' ,margin: '3%'}} onClick={() => handleToggleSidebar(true)}>
      <FaBars />
    </div>
    </>
  );
};


export default Navbar;