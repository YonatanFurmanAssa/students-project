# students-project
hello students, hope u all r doing fine, anyways, i created this project which summarizes almost everything u need to know, dont hesitate to add new things to the project/ask me anything

so, the project itself is a classic server client architecture, which includes the next arc:
db -> backend -> frontend -> user

that's all for now, the other arc of the devops part will be provided in a drawio format

the backend is written in js with node.js as the frame work, frontend react with node.js and nginx, all u need to add in the development part is as follows: 
.env files for both backend and frontend, and of course remember to do npm i to add the node_modules i deleted, those are esstntial in order to get the node app going 

in terms of real devops, u will need to configure and create a new db, in postgresql db, which within u will need to configure postgresql.conf file that will work with minikube as a host there 
and in hba conf as well change the secuirity measurment, in case u dont understand what i wrote please talk to me or to an ai 

other than that, there is of course the need to create a cert manager thaat will configure the whole ssl certificate proccess,
and of course the observability layer of this project, which will have 2 out of the 3 main layers of observability.

a few points: 

* every time u create a resource in k8s, u create it with helm, u have to intgrate helm into this project, it is a must, without it it's going to be amiss in a way 
* always remember to shut down ur resources in the cloud, never ever leave anything on , remember to create a script that checks that (this is espicially true if u r going to create many resources in the cloud)
* if u ever encounter any problem talk to me or chatgpt of course
*  u can always add more stuff to this project, if u feel like u can improve it then go ahead, u can add tracing, or argocd openshift, whatever u would like really, although this project on it's on should be enough
*  one last thing to remember, the project is suppose to simulate a real app, that has all of the main devops components really, if u dont have cert manager, it's a problem, if there is no db it is also an issue
   if u feel like u want to host the db on ur own computer, than that's ok, but still remember use the most current technologies, always consult with me or with chat on latest technologies or even ron and tom

   GOOD LUCK

