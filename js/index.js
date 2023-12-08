
let sortByAscending = true;
let currentCategory = 'All';
let entertainments = [];

const loadData = async () => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/1000`);
        const data = await res.json();
        entertainments = data.data;

        displayEntertainments();
    } catch (error) {
        console.error('Error loading data:', error);
    }
};

const displayEntertainments = () => {
    const buttonContainer = document.getElementById('button-container');
    const entertainmentContainer = document.getElementById('entertainment-container');
    const noMessageContainer = document.getElementById('no-message-container');

    entertainmentContainer.innerHTML = '';
    buttonContainer.innerHTML = '';
    noMessageContainer.innerHTML = '';

    const categoryButtonContainer = document.createElement('div');
    categoryButtonContainer.classList = "text-center mt-4";

    const categoryButtons = [
        { label: 'All', filter: 'All' },
        { label: 'Music', filter: '1001' },
        { label: 'Comedy', filter: '1003' },
        { label: 'Drawing', filter: '1005' }
    ];

    categoryButtons.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList = "bg-gray-200 px-3 py-1 m-1 text-bold hover:bg-red-500 rounded-md category-button";
        categoryButton.textContent = category.label;
        categoryButton.setAttribute('data-filter', category.filter);
        categoryButton.addEventListener('click', () => {
            applyCategoryFilter(category.filter);
        });
        categoryButtonContainer.appendChild(categoryButton);
    });

    buttonContainer.appendChild(categoryButtonContainer);

    const entertainmentsForCategory = entertainments.filter(entertainment => currentCategory === 'All' || entertainment.category_id === currentCategory);

    if (entertainmentsForCategory.length === 0) {
        const noDataFound = document.createElement('div');
        noDataFound.innerHTML = `
        <div class="flex justify-center">
            <img src="./image/Icon.png" alt="">
        </div>
        <p class="text-2xl font-extrabold mt-3">Oops!! Sorry, There is no </br> content here</p>
        `;
        noMessageContainer.appendChild(noDataFound);
    } else {
        const sortedEntertainments = entertainmentsForCategory.slice().sort((a, b) => {
            const aViews = parseInt(a.others.views.replace('K', '000'));
            const bViews = parseInt(b.others.views.replace('K', '000'));
            return sortByAscending ? bViews - aViews : aViews - bViews;
        });

        sortedEntertainments.forEach(entertainment => {
            const entertainmentCard = document.createElement('div');
            entertainmentCard.classList = `card card-compact bg-gray-100 shadow-sm`;

            const postedDateInSeconds = parseInt(entertainment.others.posted_date); // Convert to seconds
            const formattedTimeAgo = formatTimeAgo(postedDateInSeconds);

            const thumbnailBackground = `background-image: url(${entertainment.thumbnail}); background-size: cover;`;

            entertainmentCard.innerHTML = `
            <div class="card-thumbnail h-40 rounded-lg" style="${thumbnailBackground}">
                <div class="posted-time flex justify-end mt-32 text-white mr-3">
                    <div class="bg-black px-2">
                        ${formattedTimeAgo} <!-- Display the formatted time here -->
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="flex flex-row gap-1 text-left">
                    <div>
                        <figure class="w-7 h-7 rounded-full -ml-3 "><img src="${entertainment.authors[0].profile_picture}" /></figure>
                    </div>
                    <div>
                        <h2 class="card-title text-xl">${entertainment.title}</h2>
                    </div>                   
                </div>
                <div class="flex flex-row gap-3">
                    <div>
                        <p class="text-md">${entertainment.authors[0].profile_name}</p>
                    </div>
                    <div>
                        ${entertainment.authors[0].verified ? '<img class="w-5 h-5 ml-1" src="./image/blue.png" alt="Verified" />' : ''}
                    </div>
                </div>
                <p>${entertainment.others.views}</p>
            </div>
            `;
            entertainmentContainer.appendChild(entertainmentCard);
        });
    }
};

const applyCategoryFilter = (category) => {
    currentCategory = category;
    displayEntertainments();
};

const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', () => {
    sortByAscending = !sortByAscending;
    displayEntertainments();
});

const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        applyCategoryFilter(button.getAttribute('data-filter'));
    });
});

loadData();


// convert time
function formatTimeAgo(seconds) {
    if (isNaN(seconds)) {
        return '';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        if (minutes > 0) {
            return `${hours} hrs ${minutes} mins ago`;
        } else {
            return `${hours} hrs ago`;
        }
    } else {
        return `${minutes} mins ago`;
    }
}


const blogButton = document.getElementById('blog-button');
blogButton.addEventListener('click', () => {
    window.location.href = 'blog.html';
});


