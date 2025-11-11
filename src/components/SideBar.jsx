import React, { useState } from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { FaXTwitter } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import {useNavigate} from "react-router-dom";



const SideBar = () => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate()

    const handleSelect = (item) => {
        if(item === "courses"){
            navigate('/admin/courses')
        } else if(item === 'users'){
            navigate('/admin')
        }
    }

    return (
        <SideNav
            expanded={expanded} // Set the expanded prop to control the sidebar state
            onToggle={() => setExpanded(!expanded)} // Toggle the expanded state on button click
            className={'sideNavBg py-4'}
            onSelect={(selected) => {
                handleSelect(selected)
            }}
        >
            <Toggle />
            <Nav>
                <NavItem eventKey="users">
                    <NavIcon>
                        <FaUsers style={{fontSize: '1.75em', margin: '13px 20px'}} />
                    </NavIcon>
                    <NavText>
                        Users
                    </NavText>
                </NavItem>
                <NavItem eventKey="courses">
                    <NavIcon>
                        <FaBook style={{fontSize: '1.75em', margin: '13px 20px'}} />
                    </NavIcon>
                    <NavText>
                        User Course Progress
                    </NavText>
                </NavItem>
                {/*<NavItem eventKey="quiz">*/}
                {/*    <NavIcon>*/}
                {/*        <FaXTwitter style={{fontSize: '1.75em', margin: '13px 20px'}} />*/}
                {/*    </NavIcon>*/}
                {/*    <NavText>*/}
                {/*        Quiz*/}
                {/*    </NavText>*/}
                {/*</NavItem>*/}
            </Nav>
        </SideNav>
    );
}

export default SideBar;
