let counter = 1
const container = document.createElement("div")
container.classList.add("container-fluid")
container.classList.add("p-5")
const createVideo = (movie_data) => {
    const type = movie_data.type
    const id = movie_data.ID
    const element = document.createElement("video");
    element.src = `/video/${movie_data.name.split(".")[0]}`;
    element.controls = false;
    element.muted = true;
    element.dataset.name = movie_data.name
    return element;
}
const createTitle = (movie_data) => {
    const element = document.createElement("h1");
    element.textContent = movie_data.type;
    document.body.appendChild(element);
    return element;
}

const createRow = (movie_data) => {
    const title = createTitle(movie_data);
    const titleCol = document.createElement("div");
    titleCol.classList.add("col-md-12");
    const row = document.createElement("div");
    titleCol.appendChild(title);
    row.appendChild(titleCol);
    if (counter % 2 == 0) {
        row.classList.add("colored")
    }

    const videoCol = document.createElement("div");
    videoCol.classList.add("col-md-12");
    row.appendChild(videoCol);

    for (let movie of movie_data.movies) {
        let video = createVideo(movie);
        videoCol.appendChild(video);
    }
    row.classList.add("row");
    container.appendChild(row);
    counter++
}

const addEventToVideos = () => {
    const video_array = document.getElementsByTagName("video");

    for (let video of video_array) {

        video.addEventListener("mouseenter", () => {
            video.play();
        });

        video.addEventListener("mouseleave", () => {
            video.currentTime = 0;//rewind video to start
            video.pause();
        });

        video.addEventListener("click", () => {
            window.location.href = "/";
        });
    }
}
(
    () => {
        fetch("/video-types")
            .then(response => response.json())
            .then(data => {
                document.body.appendChild(container);

                for (let movie_data of data) {
                    createRow(movie_data);
                }
                addEventToVideos();
            });
        }
)()