let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons");

let displayRepos = function(repos, searchTerm){
    if(repos.length === 0) {
        repoContainerEl.textContent = "No repositories found";
        return;
    }
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    for(let i = 0; i < repos.length; i++) {
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)

        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        repoEl.appendChild(titleEl);

        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        if(repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }  else {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-success'></i>";
        }
        repoEl.appendChild(statusEl);
        repoContainerEl.appendChild(repoEl);
    }
};

let getFeaturedRepos = function(language) {
    let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            })
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
};

let formSubmitHandler = function(event) {
    event.preventDefault();
    
    let username = nameInputEl.value.trim();

    if(username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

let getUserRepos = function(user) {
    // format the github api url
    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
        
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub");
    });
};

let buttonClickHandler = function(event) {
    let language = event.target.getAttribute("data-language");
    
    if(language) {
        getFeaturedRepos(language);
    } else {
        repoContainerEl = "";
    }
};

languageButtonsEl.addEventListener("click", buttonClickHandler);
