let issuesContainer = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");

let displayWarning = function(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    let linkEl = document.createElement("a");
    linkEl.textContent = "See More Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    limitWarningEl.appendChild(linkEl);
}

let displayIssues = function(issues) {
    if(issues.length === 0) {
        issuesContainer.textContent = "This repo has no open issues!";
        return;
    }

    for(let i = 0; i < issues.length; i++) {
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        issueEl.appendChild(titleEl);

        let typeEl = document.createElement("span");
        if(issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(issues)";
        } 
        issueEl.appendChild(typeEl);
        issuesContainer.appendChild(issueEl);
    }
};

let getRepoIssues = function(repo) {
    let apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

                if(response.headers.get("Link")) {
                    displayWarning(repo);
                }
            })
        } else {
            alert("There was a problem with your request!");
        }
    });
};

let getRepoName = function() {
    let queryString = document.location.search;
    let repoName = queryString.split("=")[1];
    getRepoIssues(repoName);
    repoNameEl.textContent = repoName;
};

getRepoName();