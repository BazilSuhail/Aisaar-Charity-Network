import React from 'react'
import { NavLink } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { LuGalleryHorizontalEnd } from "react-icons/lu";
import { AiOutlineProject } from "react-icons/ai";
import { SiCampaignmonitor } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-[#003004] text-white w-full p-4 mt-5">
            <div className="flex flex-col md:flex-row justify-evenly items-center">
                
                <div className="p-5 md:w-1/5 w-3/4">
                    <h3 className="border-2 border-white rounded-lg p-3 text-xl text-center mb-3">Aisaar</h3>
                    <div className="w-full mb-2 text-center">Main Address: Hajji Park, Lahore</div>
                    <div className="w-full mb-2 text-center">Phone: +032154055665</div>
                    <div className="w-full mb-2 text-center">Email: admin@aisaar.com</div>
                </div>

                <div className="flex flex-col items-center p-2 w-3/4 md:w-1/5">
                    <div className="text-center mb-2">Have a question? Message us!</div>
                    <input className="bg-[#003004] border-2 border-white rounded-lg text-wheat p-2 mb-2 w-full" type="text" placeholder='Enter Email' />
                    <input className="bg-[#003004] border-2 border-white rounded-lg text-wheat p-2 w-full" type="text" placeholder='Write Your Message' />
                </div>

                <div className="flex flex-col mt-5 md:mt-0">
                    <NavLink to="/" className="text-lg text-white my-2 flex items-center">
                        <CiHome className="mr-3" /> Home
                    </NavLink>
                    <NavLink to="/gallery" className="text-lg text-white my-2 flex items-center">
                        <LuGalleryHorizontalEnd className="mr-3" /> Gallery
                    </NavLink>
                    <NavLink to="/listedprojects" className="text-lg text-white my-2 flex items-center">
                        <AiOutlineProject className="mr-3" /> Projects
                    </NavLink>
                    <NavLink to="/listcampaigns" className="text-lg text-white my-2 flex items-center">
                        <SiCampaignmonitor className="mr-3" /> Campaigns
                    </NavLink>
                </div>
            </div>

            <div className="text-center mt-5">
                <div>© 2024 إيثار . All rights reserved.</div>
            </div>
        </footer>
    )
}

export default Footer
