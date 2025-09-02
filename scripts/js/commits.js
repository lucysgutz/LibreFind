async function loadCommits() {
    const updatesList = document.getElementById("updates-list");
    updatesList.innerHTML = "<li>Loading...</li>";

    try {
        const res = await fetch("https://api.github.com/repos/hatemyguts/librefind/commits");
        if (!res.ok) throw new Error("GitHub API error");
        const commits = await res.json();

        updatesList.innerHTML = "";

        commits.slice(0, 5).forEach(commit => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = commit.html_url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            const fullMessage = commit.commit.message.split("\n");
            const titleText = fullMessage[0];
            const descriptionText = fullMessage.slice(1).join("\n");

            const title = document.createElement("p");
            title.textContent = titleText;
            title.style.fontWeight = "700";
            title.style.marginBottom = "0.3rem";

            const description = document.createElement("p");
            description.textContent = descriptionText;
            description.style.fontSize = "0.9rem";
            description.style.color = "#555";
            description.style.marginBottom = "0.3rem";

            const author = document.createElement("p");
            author.textContent = `Author: ${commit.commit.author.name}`;
            author.style.fontSize = "0.85rem";
            author.style.color = "#555";
            author.style.marginBottom = "0.2rem";

            const date = document.createElement("p");
            date.textContent = `Date: ${new Date(commit.commit.author.date).toLocaleDateString()}`;
            date.style.fontSize = "0.85rem";
            date.style.color = "#555";

            a.appendChild(title);
            if (descriptionText) a.appendChild(description);
            a.appendChild(author);
            a.appendChild(date);

            li.appendChild(a);
            updatesList.appendChild(li);
        });
    } catch (err) {
        updatesList.innerHTML = `<li>could not load commits :(</li>`;
        console.error(err);
    }
}

loadCommits();