(async function init() {
    const response = await fetch('http://localhost:3000/profile?name=Yury Knorozov');
    const person = await response.json();

    document.getElementById('name').textContent = person.name;
    document.getElementById('country').textContent = person.country;
    document.getElementById('domain').textContent = person.domain;
    document.getElementById('achievements').textContent = person.achievements;

    const cont = document.getElementById('container');
    cont.style.display = 'block';
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
    console.log(`Received from server: ${response}`)
    const jsonResponse = await response.json();

    document.getElementById('name').textContent = jsonResponse.name;
    document.getElementById('country').textContent = jsonResponse.country;
    document.getElementById('domain').textContent = jsonResponse.domain;
    document.getElementById('achievements').textContent = jsonResponse.achievements;


    document.getElementById('container').style.display = 'block';
    document.getElementById('container-edit').style.display = 'none';
}

function startEdittingProfile() {

    document.getElementById('input-name').value = document.getElementById('name').textContent;
    document.getElementById('input-country').value = document.getElementById('country').textContent;
    document.getElementById('input-domain').value = document.getElementById('domain').textContent;
    document.getElementById('input-achievements').value = document.getElementById('achievements').textContent;

    document.getElementById('container').style.display = 'none';
    document.getElementById('container-edit').style.display = 'block';

}
