# COMP 4513 (Winter 2023)
### Assignment #2: Node, MongoDB, Simple Authentication

## Authors: Jillian Bennett & Joel Conley
<pre>
***NOTE***
WE HAVE ENABLED AUTHENTICATION FOR ACCESS TO THE MOVIE API SO YOU WILL NEED TO BE A LOGGED IN USER IN ORDER TO ACCESS IT.

<h3>Security Test Links</h3>
GIVEN
    user is not logged in
WHEN
    user clicks <a href='https://cake-elite-terrier.glitch.me/movies'>api/movies</a>
THEN
    user is redirected to login page

GIVEN
    user is not logged in
WHEN
    user clicks <a href='https://cake-elite-terrier.glitch.me/'>api/</a> or <a href='https://cake-elite-terrier.glitch.me/login'>api/login</a> 
THEN
    user is directed to login page

GIVEN 
    user is on login page
WHEN
    user enters a mismatching email and password not found in database
THEN
    the message "Invalid username and password is displayed"

GIVEN 
    user is on login page
WHEN
    user enters a valid matching email and password
THEN
    user is directed to the home page

GIVEN
    user is logged in
WHEN
    user clicks <a href='https://cake-elite-terrier.glitch.me/login'>api/login</a>
THEN
    user will be redirected to the home page since they are already logged in

GIVEN
    user is logged in and on the home page
WHEN
    user clicks the "Logout" button
THEN
    user will be directed to the login page and a message "you have been logged out" will be displayed


<h3>Movie API Tests</h3>
GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies'>api/movies</a>
THEN
    the api will return all movies

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/limit/5'>api/limit/5</a>
THEN
    the api will return 5 movies

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/limit/-1'>api/limit/-1</a> or <a href='https://cake-elite-terrier.glitch.me/movies/limit/201'>api/limit/201</a>
THEN
    a message will be displayed: "Inavlid amount. Limit must be between 1 and 200"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/13'>api/movies/13</a>
THEN
    the api will return the data for the movie with id=13, i.e. "American Beauty"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/9'>api/movies/9</a>
THEN
    a message will be displayed: "No movie found matching ID 9"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/tmdb/14'>api/movies/tmdb/14</a>
THEN
    the api will return the data for the movie with tmbd_id=14, i.e. "American Beauty"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/tmdb/9'>api/movies/tmdb/9</a>
THEN
    a message will be displayed: "No movie found matching TMDB ID 9"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/year/2000/2003'>api/movies/year/2000/2003</a>
THEN
    the api will return the data for movies released between 2000 and 2003 inclusive

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/year/1900/1910'>api/movies/year/1900/1910</a>
THEN
    a message will be displayed: "No movies found between 1900 and 1910"

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/year/2003/2000'>api/movies/year/2003/2000</a>
THEN
    a message will be displayed: "Invalid range. Min year (2003) is greater than max year (2000)."

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/ratings/4/6'>api/movies/ratings/4/6</a>
THEN
    the api will return the data for movies with an average rating between 4 and 6 inclusive

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/ratings/6/4'>api/movies/ratings/6/4</a>
THEN
    a message will be displayed "Invalid range. Min rating 6 is greater than max rating 4."

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/ratings/11/12'>api/movies/ratings/11/12</a>
THEN
    a message will be displayed "No movies found with the average ratings 11 - 12."

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/title/MERI'>api/movies/title/MERI</a>
THEN
    the api will return all movies with "meri" in the title, ignoring case

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/title/kjgkhg'>api/movies/title/kjgkhg</a>
THEN
    a message will be displayed "No movies titles found matching kjgkhg."

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/genre/comedy'>api/movies/genre/comedy</a>
THEN
    the api will return all movies comedy listed as a genre, ignoring case

GIVEN
    user is logged in
WHEN
    user navigates to <a href='https://cake-elite-terrier.glitch.me/movies/genre/kjgkhg'>api/movies/genre/kjgkhg</a>
THEN
    a message will be displayed "No movies found with genre kjgkhg."

</pre>

















  
