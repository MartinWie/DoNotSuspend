let background = chrome.extension.getBackgroundPage(); 
// this here is the problem, find a solution to get infromation form the the backround worker

document.addEventListener('DOMContentLoaded', () => {
    const filterList = document.getElementById('filterList');
    const remove = (e) => {
        background.removeFromDoNotSuspendList(e.target.value);
        location.reload();
    }

    const doNotSuspends = background.loadDoNotSuspendsLocal()

    console.log(doNotSuspends)

    const filtersHTML = doNotSuspends.map( filter => {
        return ` <li class="filter-item">
            <button class="btn" value="${filter}">remove</button>
            ${filter}
        </li>
        `
    }).join('');
    
    filterList.innerHTML = filtersHTML;

    const filterEntr = [... document.querySelectorAll('.filter-item')];
    
    filterEntr.forEach((entry) => {
        entry.addEventListener('click',remove)
    });


    const filterButton = document.getElementById('filterButton');
    const inputFire = () => {
        background.addToDoNotSuspendList(document.getElementById('filterInput').value);
        location.reload();
    }
    filterButton.addEventListener('click',inputFire)
});