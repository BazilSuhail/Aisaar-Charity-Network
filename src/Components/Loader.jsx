import "./Styles/loader.css";

const Loader = ({ typeOfloader }) => {
    return (
        <div className='min-h-screen pt-[-75px] w-full flex justify-center items-center'>
            <div className="spinnerContainer">
                <div className="spinner"></div>
                <div className="loader"></div>
            </div>
        </div>
    )
}

export default Loader
