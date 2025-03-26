let counter = 1
const container = document.createElement("div")
container.classList.add("container-fluid")
container.classList.add("p-5")
const createVideo = (movie_data) => {
    const type = movie_data.type
    const id = movie_data.ID
    const element = document.createElement("video");
    element.src = `/video/${movie_data.name}`;
    element.controls = false;
    element.muted = true;
    element.dataset.id = movie_data.id
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
    row.classList.add("video-type");
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
            const id = video.dataset.id;
            window.location.href = `/watch/${id}`;
        });
    }
}
(
    () => {

        document.getElementById("list").appendChild(container);
        for (let movie_data of JSON.parse(data)) {
            createRow(movie_data);
        }
        addEventToVideos();
    }
)()