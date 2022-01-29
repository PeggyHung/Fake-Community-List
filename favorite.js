const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || [] // 收藏清單

const dataPanel = document.querySelector('#data-panel');

function renderUserList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    // name + surname, avatar
    rawHTML += `
      <div class="col-sm-3">
        <div class="card m-2">
          <img src=${item.avatar} class="card-img-top" alt="Card Image" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
          <div class="card-body">
            <h5 class="card-title">${item.name} ${item.surname}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {
  const cardTitle = document.querySelector("#user-modal-title");
  const cardImage = document.querySelector("#user-modal-image");
  const cardAge = document.querySelector("#user-modal-age");
  const cardRegion = document.querySelector("#user-modal-region");
  const cardGender = document.querySelector("#user-modal-gender");
  const cardBirthday = document.querySelector("#user-modal-birthday");
  const cardEmail = document.querySelector("#user-modal-email");

  axios.get(INDEX_URL + "/" + id).then((response) => {
    const data = response.data;
    cardTitle.innerText = data.name + " " + data.surname;
    cardImage.innerHTML = `<img src="${data.avatar}" alt="user-img" class="img-fluid">`;
    cardAge.innerText = "Age: " + data.age;
    cardRegion.innerText = "Region: " + data.region;
    cardGender.innerText = "Gender: " + data.gender;
    cardBirthday.innerText = "Birthday: " + data.birthday;
    cardEmail.innerText = "Email: " + data.email;
    // console.log(data);
  });
}

function removeFromFavorite(id) {
  if (!users || !users.length) return

  const userIndex = users.findIndex(user => user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener("click", function onCardClicked(event) {
  if (event.target.matches(".card-img-top") || event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
});

renderUserList(users)
