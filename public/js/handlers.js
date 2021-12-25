async function getProfile(uriSting) {
    const response = await fetch(uriSting);
    const personData = await response.json();

    document.getElementById('name').textContent = personData.name;
    document.getElementById('country').textContent = personData.country;
    document.getElementById('domain').textContent = personData.domain;
    document.getElementById('achievements').textContent = personData.achievements;
    document.getElementById('addNewButton').textContent = 'Edit';

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

    const upsertedInfo = await response.json();

    document.getElementById('name').textContent = upsertedInfo.name;
    document.getElementById('country').textContent = upsertedInfo.country;
    document.getElementById('domain').textContent = upsertedInfo.domain;
    document.getElementById('achievements').textContent = upsertedInfo.achievements;
    document.getElementById('addNewButton').textContent = 'Edit';

    document.getElementById('card').style.display = 'block';
    document.getElementById('card-edit').style.display = 'none';

    await getAllNames();
}

async function handleDeleteRequest() {
    const personName = document.getElementById('name').textContent;

    const personNameSlug = personName.replaceAll(' ', '+');
    const response = await fetch(`http://localhost:3000/profile?name=${personNameSlug}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const deletionResult = await response.json();
    deletionResult.acknowledged ? alert('Deleteted Successfully') : alert('Deletioned Failed');

    document.getElementById('card').style.display = 'block';
    document.getElementById('card-edit').style.display = 'none';

    document.getElementById('addNewButton').textContent = 'Add New';

    await getAllNames();
}