This project is built using plain HTML/CSS/JS with assets but I want the same frontend project built in React with Typescript. This project is using bootstrap for styling and is using several JS functionalities like image galaery etc and I need all of them in react project.

After that new features should be added.
The project idea is to display art works from artists to users so artists should upload their artwork to the website from admin panel and all the artworks should be displayed in user side. So basically there will be 2 roles. One is super admin who will manage artists account active/inactive - need to give approval to active for every artist registeration. And super admin can see all artworks uploaded from artists.

Every artist can register/login/forget password/reset password and can see their art works only uploded by themselves in list and they can upload new one/edit/detail or delete.
Each artwork will have image, title, size, note, sold. The idea is to allow artist to add status if its still available or already sold.

on user side, there is a favorite feature for each artwork and it should be handled by cookies or localstorage since there will be no login function for normal users.
If any artwork is fine for users to buy, users will click contact artist button to see contact from to send an email to the correct artist.

And 1. No right click for each artwork, copy, or download on the art should be allowed. Right click should be disabled.
2. Allow the user to zoom in on a picture and see the painting details. Like, when you are on a retail site and buying a shirt and you get an option to zoom in on the collar and or pocket.

Authentication can be used with JWT auth and email gateway can be Sendgrid SMTP service, database can be MongoDB. Backend should be done using Node.js + ExpressJS