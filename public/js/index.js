(async function init() {
    await getAllNames();
    document.getElementById('card').style.display = 'block';
})();

async function getAllNames() {
    const response = await fetch('http://localhost:3000/profile/all');
    const data = await response.json();

    let listOfPeopleBlock = document.getElementById('allPeople');
    listOfPeopleBlock.innerHTML = ""

    for (let item of data) {
        let personName = item.name;
        let personNameSlug = personName.replaceAll(' ', '+');
        let requestUri = `http://localhost:3000/profile?name=${personNameSlug}`;
        listOfPeopleBlock.innerHTML += `<a href=javascript:getProfile("${requestUri}");> ${ personName } </a><br>`
    }
}