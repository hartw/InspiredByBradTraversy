console.log('script.js loaded !')

let images =[];
let startIndex = 0;
let numVisible = 5;

//use window.showDirectoryPicker() to load images from a folder
async function openImageFolder() {
    console.log('Open image folder clicked');
    try {
        const dirHandle = await window.showDirectoryPicker();
        //const imageSources = [];
        console.log('Loading images...');
            for await (const [name, handle] of dirHandle.entries()) {
                if (handle.kind === 'file' && name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                    const file = await handle.getFile();
                    const url = URL.createObjectURL(file);
                    //imageSources.push({ filename: name, url: url });
                    images.push({ filename: name, url: url });
                    }
            }
            //console.log('Images loaded - length is: ', imageSources.length);
            console.log('Images loaded - length is: ', images.length);
        //return imageSources;    
        return images;    
        } catch (err) {
            console.error('Error accessing folder:', err);
        }
}

// replace <div class="panel" data-image="image1.jpeg"></div>
// precisely the data-image attribute with the actual image source
function updateImages() {
    console.log("Updating images via updateImages() function");
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
        const newIndex = startIndex + i;
        console.log("adding 1 to startIndex makes it: " , newIndex);
        if (newIndex < images.length) {
            panel.dataset.image = images[newIndex]["url"];
            //this is a valid way to set a background image using CSS
            panel.style.backgroundImage = `url('${images[newIndex]["url"]}')`;
            panel.style.display = "block"; // Ensure visible when in range
        } else {
            panel.style.display = "none"; // Hide panels when out of range
        }
    });
}

//Call update images after images have been loaded
async function loadImages() {
    images = await openImageFolder(); // Wait for images to be loaded
    updateImages(); // Now update UI after loading images
    updatePrevNextButtons();
}


function updatePrevNextButtons() {
    // Disable previous button if we are at the start
    document.querySelector(".btn.prev").disabled = startIndex === 0; 
    // Disable next button if we are at the end
    document.querySelector(".btn.next").disabled = startIndex + numVisible >= images.length; 
}

//button to open image folder and load images
document.querySelector(".btn-showDirPicker").addEventListener("click", openImageFolder);

// media queries handle the number of visible panels
// actions move foward and backward
// move forward
document.querySelector(".btn.next").addEventListener("click", () => {
    console.log("Move forward");
    if (startIndex + numVisible < images.length) {
        startIndex++;  // Move forward
        console.log("Start in if index change to: ", startIndex);
        updateImages();
        updatePrevNextButtons();
    }
    console.log("Start index change to: ", startIndex);
});

// move backward
document.querySelector(".btn.prev").addEventListener("click", () => {
    console.log("Move backward");  // Check if we have images to move backward to
    if (startIndex > 0) {
        startIndex--;  // Move backward
        updateImages();
        updatePrevNextButtons();
    }
    console.log("Start index change to: ", startIndex);
});

// Initialize the gallery
updateImages();
