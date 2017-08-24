// store input element where Github username is added
var inputEl = document.getElementById("github-username");
// store element to display results
var results = document.getElementById("results");
// store current page
var pagetracker = 1;
var followercount;

function githubSearch(){


  // clear any previous data if it exists
  if(results.innerHTML != "") {
  	results.innerHTML = "";
  }

	// make a data request
	$.ajax({
		// url for database
    url: "https://api.github.com/users/" + inputEl.value,
    dataType: "json",
    type: 'GET',
    // on success, do this
    success: function(userdata) {
			// display data being passed through
			console.log(userdata);
      // display the user's GitHub handle

      // create elements
   		var newDiv    = document.createElement('div');
   		var newH1     = document.createElement('h1');
   		var newH2     = document.createElement('h2');

      // add classes to elements
   		newDiv.className = 'user';

   		// add text to tags
      newH1.innerText = "name: " + userdata.name
   		newH2.innerText = "follower count: " + userdata.followers

      // add tags to wrapper
   		newDiv.appendChild(newH1);
   		newDiv.appendChild(newH2);

   		// add the new div element to results
   		results.appendChild(newDiv);

      // request follower data
      $.ajax({
    		// url for database
        url: "https://api.github.com/users/" + inputEl.value + "/followers" ,
        dataType: "json",
        type: 'GET',
        // on success, do this
        success: function(followerdata) {
    			// display data being passed through
    			console.log(followerdata);

          for (var i = 0; i < followerdata.length; i++) {
            // list of the user's followers

            // create elements
         		var newDiv2   = document.createElement('div');
            var newA      = document.createElement('a');
            var newImg    = document.createElement('img');
            var newSpan   = document.createElement('span');

            // add attrbiutes to a tag
            newA.href = followerdata[i].html_url;
            newA.target = "_blank";

            // add class to div
            newDiv2.className = "follower";

            // add image to tag
            newImg.src = followerdata[i].avatar_url;
            newImg.alt = "Avatar Picture";

            // add class to img
            newImg.className = "img-sm";

            // add text to tag
            newSpan.innerText = followerdata[i].login;

            // add tags to new a tag
         		newA.appendChild(newImg);
         		newA.appendChild(newSpan);

            // add tags to new div
         		newDiv2.appendChild(newA);

         		// add the new div element to results
         		results.appendChild(newDiv2);
          }
        }
    	});

			followercount = userdata.followers;

			// check follower count to display next
			if (followercount > 30) {
				nextSearchBtn.style.display = "block"
			}

			// make followercount a global variable
			return followercount;
    }
	});
};

// add event to element with id="github-search"
var searchBtn = document.getElementById('github-search');
searchBtn.addEventListener('click', githubSearch, false);

// button for next followers
var nextSearchBtn = document.getElementById('github-next-search');

function moreFollowers() {
	// check followercount and pagetracker values
	console.log(followercount, pagetracker)

	// this true statement has to be updated to compare followercount and pagetracker so it only displays if more followers are available to display --- calculation tbd
	if(true) {
		// increase page tracker to get next page number
		pagetracker++;

		// request follower data
		$.ajax({
			// url for database
			url: "https://api.github.com/users/" + inputEl.value + "/followers" + '?page=' + pagetracker,
			dataType: "json",
			type: 'GET',
			// on success, do this
			success: function(morefollowerdata) {
				// display data being passed through
				console.log(morefollowerdata);

				// display new data here


			}
		});
	}
}
