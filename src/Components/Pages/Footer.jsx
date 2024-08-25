import React from 'react'

import { NavLink } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { LuGalleryHorizontalEnd } from "react-icons/lu";
import { AiOutlineProject } from "react-icons/ai";
import { SiCampaignmonitor } from "react-icons/si";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                <div className="organization-info">
                    <h3>Aisaar</h3>
                    <div>Main Address: Hajji Park,Lahore</div>
                    <div>Phone: +032154055665</div>
                    <div>Email: admin@aisaar.com</div>
                </div>

                <div className="message-bar">
                    <div>Have a question? Message us!</div>
                    <input className="message-us" type="text" placeholder='Enter Email' />
                    <input className="message-us" type="text" placeholder='Write Your Message' />
                </div>

                <div className="links-nav">
                    <NavLink to="/" className="f-link flex"><CiHome className='f-icon' size={25}/><span className='ml-[-8px]'>Home</span></NavLink>
                    <NavLink to="/gallery" className="f-link flex"><LuGalleryHorizontalEnd size={25} className='f-icon' /><span className='ml-[-8px]'>Gallery</span></NavLink>
                    <NavLink to="/listedprojects" className="f-link flex"><AiOutlineProject  size={25} className='f-icon' /><span className='ml-[-8px]'>Projects</span></NavLink>
                    <NavLink to="/listcampaigns" className="f-link flex"><SiCampaignmonitor  size={25} className='f-icon' /><span className='ml-[-8px]'>Campaigns</span></NavLink>
                </div>
            </div>

            <div className="rights-reserved">
                <div>© 2024  إيثار . All rights reserved.</div>
            </div>
        </footer>
    )
}

export default Footer
