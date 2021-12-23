
(async function init() {
    const response = await fetch('http://localhost:3000/profile/all', {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    let listOfPeopleBlock = document.getElementById('allPeople');
    
    for (let item of data) {
        
        let personName = item.name;
        let personNameSlug = personName.replaceAll(' ','+');
        let linkToProfile=`http://localhost:3000/profile?name=${personNameSlug}`;
        console.log(linkToProfile);
        listOfPeopleBlock.innerHTML += `<a href=${ linkToProfile }> ${ personName } </a><br>`
    }
    console.log(listOfPeopleBlock);
    document.getElementById('card').style.display = 'block';
})();


async function handleUpsertRequest() {

    const updatedInfo = {
        name: document.getElementById('input-name').value,
        country: document.getElementById('input-country').value,
        domain: document.getElementById('input-domain').value,
        achievements: document.getElementById('input-achievements').value,
    };

    const response = await fetch(`http://localhost:3000/profile?name=${updatedInfo.name}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedInfo)
    });

    const jsonResponse = await response.json();

    document.getElementById('name').textContent = jsonResponse.name;
    document.getElementById('country').textContent = jsonResponse.country;
    document.getElementById('domain').textContent = jsonResponse.domain;
    document.getElementById('achievements').textContent = jsonResponse.achievements;


    document.getElementById('card').style.display = 'block';
    document.getElementById('card-edit').style.display = 'none';
}

function startEdittingProfile() {

    document.getElementById('input-name').value = document.getElementById('name').textContent;
    document.getElementById('input-country').value = document.getElementById('country').textContent;
    document.getElementById('input-domain').value = document.getElementById('domain').textContent;
    document.getElementById('input-achievements').value = document.getElementById('achievements').textContent;

    document.getElementById('card').style.display = 'none';
    document.getElementById('card-edit').style.display = 'block';
}
