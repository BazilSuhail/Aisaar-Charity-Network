import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Pages/Navbar";

import "../src/Components/Styles/loader.css";
import Loader from "./Components/Loader";
import AddDummyDataToFirestore from "./Components/insertProjects";   
import Footer from "./Components/Pages/Footer";
// Lazy loading components
const Home = React.lazy(() => import("./Components/Pages/Home"));
const Donor = React.lazy(() => import("./Components/Profiles/Donor"));
const Login = React.lazy(() => import("./Components/Pages/Login"));
const SignUp = React.lazy(() => import("./Components/Pages/Signup"));
const Gallery = React.lazy(() => import("./Components/Pages/Gallery"));
const Volunteer = React.lazy(() => import("./Components/Profiles/Volunteer"));
const Listedprojects = React.lazy(() => import("./Components/Projects/Projects_list"));
const AppliedProj = React.lazy(() => import("./Components/Projects/Applied_projects"));
const TransactionHistory = React.lazy(() => import("./Components/Forms/Transaction_History"));
const Listcampaigns = React.lazy(() => import("./Components/Campaigns/Campaigns_list"));
const Complains = React.lazy(() => import("./Components/Forms/Complains"));
const Testimonial = React.lazy(() => import("./Components/Forms/Testimonial"));
const ProjectDetails = React.lazy(() => import("./Components/Projects/ProjectDetails"));
 

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

          <Route path="/listedprojects/:id" element={<ProjectDetails/>} />
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
      
      <Footer />
    </Router>
  );
};

export default App;
