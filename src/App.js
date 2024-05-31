import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

import "../src/Components/Styles/loader.css";
import Loader from "./Components/Loader";
import AddDummyDataToFirestore from "./Components/Insertdata";  
// Lazy loading components
const Home = React.lazy(() => import("./Components/Home"));
const Donor = React.lazy(() => import("./Components/Donor"));
const Login = React.lazy(() => import("./Components/Login"));
const SignUp = React.lazy(() => import("./Components/Signup"));
const Gallery = React.lazy(() => import("./Components/Gallery"));
const Volunteer = React.lazy(() => import("./Components/Volunteer"));
const Listedprojects = React.lazy(() => import("./Components/Projects_list"));
const AppliedProj = React.lazy(() => import("./Components/Applied_projects"));
const TransactionHistory = React.lazy(() => import("./Components/Transaction_History"));
const Listcampaigns = React.lazy(() => import("./Components/Campaigns_list"));
const Complains = React.lazy(() => import("./Components/Complains"));
const Testimonial = React.lazy(() => import("./Components/Testimonial"));
 

const App = () => {

  return (
    <Router>

      <Navbar />
      <Suspense fallback={<Loader typeOfloader="skeleton" />}>

        <Routes>
          {/*  <Route path="/" element={<Loader typeOfloader="a" />} />*/}
          <Route path="/" element={<Home />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/listedprojects" element={<Listedprojects />} />
          <Route path="/listcampaigns" element={<Listcampaigns />} />
          <Route path="/AppliedProject" element={<AppliedProj />} />
          <Route path="/transactionhistory" element={<TransactionHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/volunteer" element={<Volunteer />} /> 
          <Route path="/complains" element={<Complains/>} /> 
          <Route path="/testimonial" element={<Testimonial/>} />  

          
          <Route exact path="/dummy" element={<AddDummyDataToFirestore />} />
        </Routes>


      </Suspense>
    </Router>
  );
};

export default App;
