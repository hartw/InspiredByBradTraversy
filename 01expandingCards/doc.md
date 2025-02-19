1. background-size: cover;

   Ensures that the background image completely covers the <div class="panel">,
   even if it means cropping parts of the image.

   The image might be too large or too small for the panel.
   cover makes sure that no empty space is left, but parts of
   the image might be cropped.

Examples
background-size: contain;

    The whole image fits inside, but might leave empty space

background-size: cover;

    The image fills the panel completely, but might crop edges

Implications:

    images for display are usually not subject to size standardisation.
    background-size: cover; solves the "right sizing" fairly well.
    Be aware, that you are then in a comfortable position, not being
    pushed to relocate your images. THIS should be drastically differ
    from a situation where content is delivered as web-content.
    I usually prefer the PC as a tool.

2. background-position: center;

   Centers the background image within the `<div class="panel">`.

   Because `background-size: cover;` might crop parts of the image,
   this property ensures that "the most important part (center)"
   stays visible.

Example

    background-position: top left;
        Aligns image to the top-left corner
    background-position: center;
        Keeps the middle of the image visible
    background-position: bottom right;
        Aligns image to bottom-right

3. background-repeat: no-repeat;

   Prevents the background image from repeating inside the `<div class="panel">`.

   By default, if an image is smaller than the container,
   it will repeat itself (tiling - tile (Subjekt und Verb) Fliese, fliesen).
   `no-repeat` ensures that only one instance of the image is shown.
   Remaining space is white.

Example

    background-repeat: repeat;
        Default: The image tiles multiple times
    background-repeat:
        no-repeat; The image appears only once
    background-repeat:
        repeat-x; Repeats horizontally
    background-repeat:
        repeat-y; Repeats vertically

4. flex: 0.5;

   Controls the flex-grow, flex-shrink, and flex-basis properties
   of the panel when using Flexbox.
   This means each `.panel` starts with a smaller width but can expand when needed.

   In this layout, `.panel.active { flex: 5; }` makes the active panel expand.
   Other panels remain at half their original size (`flex: 0.5;`).
   This creates a collapsing/expanding panel effect.

Example

    flex: 1;
        All panels get equal width
    flex: 0.5;
        Panels start smaller but can expand
    flex: 5;
        The active panel takes up most of the space

5. `-webkit-transition: all 700ms ease-in;`

   Creates a smooth animation when a panel expands or shrinks.
   The `-webkit-` prefix ensures compatibility with older Safari and Chrome versions.
   With `transition`, the size smoothly increases/decreases over `700ms`.

Example

    transition: all 700ms ease-in;

    `all`
        → Apply transition to all properties (size, opacity, etc.).
    `700ms`
        → Animation lasts 700 milliseconds.
    `ease-in`
        → Animation starts slowly and speeds up.

    Better Alternative: Instead of `-webkit-transition`, modern browsers support:
        transition: all 700ms ease-in-out;

6. Clarification on `allPanels` and Image Loading in Steps

   We don’t want to preload all images in the browser window
   (`<div class="panel">`). Reals estate is

   Instead, we should dynamically load them in chunks, not all at once.

6.1. The Solution: Progressive Image Loading

    Instead of defining all panels in HTML, we:
        Only load an initial set (e.g., 5 or 10 images).
        Keep track of which images are already loaded.
        Dynamically fetch and display the next batch when needed.

6.2. Dynamic Image Loader from an existing image array

//Define an image list but don’t insert everything upfront.  
//Load in steps of 5 images at a time, but display only 5.

const panelsContainer = document.querySelector(".panels-container");

// simulates exploration of the number of images that will be loaded
// imageSources.length is that number
const imageSources = [
"img1.jpg","img2.jpg","img3.jpg", ... improved below .... , ];

let loadedIndex = 0; // Track how many images have been loaded
let visiblePanels = []; // Track visible images
let chunkSize=5; // Number of images to load per batch

// Function to load next batch of images
function loadNextBatch(chunkSize) {
let fragment = document.createDocumentFragment();

        for (let i = 0; i < chunkSize; i++) {
            // Load chunkSize images at a time
            if (loadedIndex >= imageSources.length) break; // Stop if no more images left

            let panel = document.createElement("div");
            panel.classList.add("panel");
            panel.style.backgroundImage = `url('${imageSources[loadedIndex]}')`;

            panel.addEventListener("click", () => {
            removeActiveClasses();
            panel.classList.add("active");
            shiftPanels();
    });

    visiblePanels.push(panel);
    fragment.appendChild(panel);
    loadedIndex++;

}

panelsContainer.innerHTML = ""; // Clear current visible panels
panelsContainer.appendChild(fragment); // Insert new batch
}

// Function to shift images when clicking
function shiftPanels() {
if (loadedIndex < imageSources.length) {
visiblePanels.shift(); // Remove the leftmost panel
let newPanel = document.createElement("div");
newPanel.classList.add("panel");
newPanel.style.backgroundImage = `url('${imageSources[loadedIndex]}')`;

        newPanel.addEventListener("click", () => {
            removeActiveClasses();
            newPanel.classList.add("active");
            shiftPanels();
        });

        visiblePanels.push(newPanel);
        loadedIndex++;

        updatePanels();
    }

}

// Function to update UI after shifting
function updatePanels() {
let fragment = document.createDocumentFragment();
visiblePanels.forEach((panel) => fragment.appendChild(panel));
panelsContainer.innerHTML = "";
panelsContainer.appendChild(fragment);
}

// Function to remove all active classes
function removeActiveClasses() {
visiblePanels.forEach((panel) => panel.classList.remove("active"));
}

// Initial load
loadNextBatch();

### 4. Features

Only the first 5 images are loaded at the start.
When clicking an image, one new image is loaded from the array while shifting the leftmost one out.
Lazy loading effect: Only a few images are ever stored in memory, keeping performance high.

### 5. Next Steps

1. Implement backward scrolling? (Shift left instead of only right)

<h1>Image Folder Loader</h1>
    <button onclick="openImageFolder()">Open Image Folder</button>

    <script>
        async function openImageFolder() {
            try {
                const dirHandle = await window.showDirectoryPicker();
                const imageSources = [];

                for await (const [name, handle] of dirHandle.entries()) {
                    if (handle.kind === 'file' && name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        const file = await handle.getFile();
                        const url = URL.createObjectURL(file);
                        imageSources.push(url);
                    }
                }
                console.log('Loaded image sources:', imageSources);
            } catch (err) {
                console.error('Error accessing folder:', err);
            }
        }
    </script>

</body>
