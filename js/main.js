// store input element where Github username is added
var inputEl = getEl("github-username");
// store element to display results
var results = getEl("results");
// store button element for search function
var searchBtn = getEl('github-search');
// store button to display next followers
var nextSearchBtn = getEl('github-next-search');
// store current page
var pagetracker = 1;
// will store total follower count
var followercount;

// function to create elements with less typing
function newEl(el) {
  return document.createElement(el)
}
// function to select elements with less typing
function getEl(el) {
  return document.getElementById(el)
}

function createfollowers(followerdata) {
  // loop through the list of the user's followers
  for (var i = 0; i < followerdata.length; i++) {
    // create elements
    var newDiv2 = newEl('div');
    var newA    = newEl('a');
    var newImg  = newEl('img');
    var newSpan = newEl('span');

    // add attrbiutes to anchor tag
    newA.href = followerdata[i].html_url;
    newA.target = "_blank";

    // add attrbiutes to div tag
    newDiv2.className = "follower";

    // add attrbiutes to image tag
    newImg.src = followerdata[i].avatar_url;
    newImg.alt = "Avatar Picture";
    newImg.className = "img-sm";

    // add text to span tag
    newSpan.innerText = followerdata[i].login;

    // add tags to new anchor tag
    newA.appendChild(newImg);
    newA.appendChild(newSpan);

    // add tags to new div tag
    newDiv2.appendChild(newA);

    // add the new div tag to results displays in HTML
    results.appendChild(newDiv2);
  };
};

// thie fucntion is triggered when the search button is clicked
function githubSearch(){
  // clear any previous data if it exists
  if(results.innerHTML != "") {
  	results.innerHTML = "";
  }

	// make a data request
	$.ajax({
    url: "https://api.github.com/users/" + inputEl.value,
    dataType: "json",
    type: 'GET',
    // on success, do this
    success: function(userdata) {
			// display data being passed through
			// console.log(userdata);

      // create elements
   		var newDiv = newEl('div');
   		var newH1  = newEl('h1');
   		var newH2  = newEl('h2');

      // add attributes to div tag
   		newDiv.className = 'user';

   		// add text to tags
      newH1.innerText = "name: " + userdata.name
   		newH2.innerText = "follower count: " + userdata.followers

      // add tags to wrapper
   		newDiv.appendChild(newH1);
   		newDiv.appendChild(newH2);

   		// add the new div tag to results displays in HTML
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

          createfollowers(followerdata)

        }
    	});

			followercount = userdata.followers;

			// check follower count to display next
			if (followercount > 30) {
				nextSearchBtn.style.display = "block"
			};

			// make followercount a global variable
			return followercount;
    }
	});
};

function moreFollowers() {
	// checks the total followercount and pagetracker values are accessable
	// console.log(followercount, pagetracker);

	// this calculation pagetracker < Math.ceil(followercount / 30 - will determine if there are more pages that can be displayed or not
  // console.log(pagetracker, Math.ceil(followercount / 30));

  // check if more followers can be displayed
	if(pagetracker < Math.ceil(followercount / 30)) {
		// increase page tracker to get next page number
		pagetracker++;

		// request more follower data, pagetracker is used to determine the page to search for
		$.ajax({
			url: "https://api.github.com/users/" + inputEl.value + "/followers" + '?page=' + pagetracker,
			dataType: "json",
			type: 'GET',
			// on success, do this
			success: function(morefollowerdata) {
				// display data being passed through
				// console.log(morefollowerdata);

        // clear any previous data if it exists
        if(results.innerHTML != "") {
        	results.innerHTML = "";
        }

				// loop through new list of user's followers
        for (var i = 0; i < morefollowerdata.length; i++) {
          // create elements
          var newDiv2   = newEl('div');
          var newA      = newEl('a');
          var newImg    = newEl('img');
          var newSpan   = newEl('span');

          // add attrbiutes to anchor tag
          newA.href = morefollowerdata[i].html_url;
          newA.target = "_blank";

          // add attrbiutes to div tag
          newDiv2.className = "follower";

          // add attrbiutes to image tag
          newImg.src = morefollowerdata[i].avatar_url;
          newImg.alt = "Avatar Picture";
          newImg.className = "img-sm";

          // add text to span tag
          newSpan.innerText = morefollowerdata[i].login;

          // add tags to new anchor tag
          newA.appendChild(newImg);
          newA.appendChild(newSpan);

          // add anchor tag to new div
          newDiv2.appendChild(newA);

          // add the new div tag to results displays in HTML
          results.appendChild(newDiv2);
        }
			}
		});
	};
  // hide the button if these are equal because there are no more followers to display
  if(pagetracker == Math.ceil(followercount / 30)) {
    nextSearchBtn.style.display = "none";
  };
};

// add event to element with id="github-search"
searchBtn.addEventListener('click', githubSearch, false);
