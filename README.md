#Give Me A Night
A simple, easy to use evening event planner.


![Screenshots](https://drive.google.com/uc?export=view&id=0B4WuvBhzCho_LTBqN0hRN0xzM1U)

##Introduction
"What do we do tonight? I don't know, what do you want to do?" A very common everyday problem. Give Me A Night looks to address this problem by giving you three potential nights to choose
from in your aread, with some options for the mood of the evening. Each night reccomends a dining location, a recent movie, a musical event, and a local community event.

##Use Case
Give Me A Night can be used on any day to get results for that day. It is meant to find something to do for this specific evening in the quickest and easiest way possible. 

##UX
Wireframes were made prior to any code being written. Some minimal user feedback was obtained through questions about the display and flow, though mostly this kind of feedback was obtained during the release of the minimum viable product useable wireframe.

##Live Site
You can access the live site at https://tranquil-wave-81128.herokuapp.com

##Technical
- Give Me A Night uses javascript a single page app, with a simple Node JS server
- ReactJS renders the components
- React Router to handle routes
- Redux Thunk to handle the global state
- RxJS to implement some FRP (functional reactive programming) and handle async actions
- 6 different API to interface with (making RxJS very useful in this case)
    including: Zomato, EventBrite, Eventful, Google Places, Google Photos, The Movie Database
- Webpack handles transpiles with Babel
- React Motion for Modal animation
- Jest and Enzyme for automated testing
- React CSS Modules
- Photoshop used to create backgrounds and city
