import React from 'react'

import "./Styles/loader.css";
const Loader = ({ typeOfloader }) => {
    return (
        <div>
            {
                typeOfloader === "skeleton" ?
                    <div className="body-container">
                        <div className="body-head"> . </div>
                        <div className="main-loader">
                            <div className="left-main"> . </div>
                            <div className="right-main"> . </div>
                        </div>
                        <div className="body-footer"> . </div>
                    </div>

                    : <div className="circle-loader">
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                        <div className="wave"></div>
                    </div>
            }
        </div>
    )
}

export default Loader
