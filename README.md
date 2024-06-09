# `Problem Definition`
### Create ”Charity Management Network" network which aims to provide a centralized platform for charity franchises to manage their operations, including franchise management, there registration, donor management, fundraising campaigns, volunteer coordination along with specific project planning, proposal and there creation, monitoring complains of volunteers. The system should streamline administrative control, enhance donation control, and improve transparency in charity operations. 


# `Functionalities / Methodology`
### To create such a network to streamline Such Functionalities we have implemented following features:

#### Creation and management of franchises, projects, volunteer, campaigns, and beneficiaries.
#### Admin registering different franchises holding multiple projects, volunteers and campaigns as well as beneficiaries. 
#### Proper authentication system for Franchises, Volunteers, Donors as well as the Admin
#### Volunteer proposing different projects and getting approved from individual franchises. 
#### Tracking of donations made by donors to specific projects and campaigns. 
#### Maintaining the record of Donor’s donations(Transactions made)
#### Monitoring fundraising campaigns associated directly to franchises. 
#### Publishing Top Donor’s testimonials on Home Page.
#### Monitoring Top volunteer who have completed most projects.
#### Receiving complaints from volunteers and resolving their problems from Admin.
#### Managing beneficiaries enrollment, status and skills they are acquiring within franchises.
#### Maintaining record of completed Projects and franchises.  
#### Maintaining the filtration of beneficiaries with respect to their status of enrollment in each franchise(orphan, widow, other). 

# `ToolKit`
### As the database seems to realistically implemented we will be using “REACT JS” for front-end and for back-end, we will be using the “FIREBASE” 
### `REASON OF USING THEM:`
## We will be using REACT JS because of its powerful rendering components approach. With the potential for our project to encompass multiple pages, React JS's modular structure ensures that we can write concise code while rendering a greater number of components, thereby enhancing code reusability and maintainability.
## Reason of using FIREBASE for back-end is our project is realistically flexible and demands on time changes. Moreover FIREBASE is an online hosted database so our data will be preserved online and with REACT JS as front-end , users will be able to see changes on the spot. 

# `Packages to Install`
#### To run this projects you have to install some external node modules or packages.To continue of with this projects run these commands:
#### npm i firebase
#### npm i react-icons
#### npm i react-router-dom
#### npm i react-toastify 
#### npm i react-responsive-carousel


# `Test Cases`
#### There are two files `insertProjects.jsx` And `insertCampaign.jsx` , they sort fo take a json array and that data to the fireabse.
### However our project is realistically interactive so data has to be Real-time so that transpaerent action could take Place.
### To test the sites you can find Below links:
#### [Aisaar-Client](https://aisaar.netlify.app).
#### [Aisaar-AdminDashboard](https://admin-aisaar.netlify.app).


# `Work Distribution`

### Our project Contains two portals/sites thus we dividied ourselves into two groups.
### `Client Site Developer` And `Admin Site Developer`
#### `Client Site Developers:`
### `Bazil Suhail` / `BSCS-22072` managed transactional operations with project applicantion.Testimonial and Complaints registration/making.
### `Abdullah Masood` / `BSCS-22054` managed authentication of user(volunteer/donor).There profile management and Stat and figures of gallery and Home.


#### `Admin Site Developers:`
### `Muhammad Rehman` / `BSCS-22018` managed autentication of franchises with creation.Basic crud for Franchises and resolvment of complaints from volunteer.
### `Ahmad Saleem` / `BSCS-22078` managed operations within framchises.Approving projects,Campaign creation and enrollment of beneficiaries.