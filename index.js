const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const UESRS_PRE_PAGE = 12

const users = [];
let filteredUsers = []

const dataPanel = document.querySelector('#data-panel');
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find(user => user.id === id)
  if (list.some(user => user.id === id)) {
    return alert('????????????????????????????????????!')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

dataPanel.addEventListener("click", function onCardClicked(event) {
  if (event.target.matches(".card-img-top") || event.target.matches(".btn-show-user")) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

// ????????????????????????, ????????????????????????
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword.length) {
  //   return alert('?????????????????????!')
  // }

  // ???????????????????????????for-of
  // for (const user of users) {
  //   let userName = `${user.name} ${user.surname}`

  //   if (userName.toLowerCase().includes(keyword)) {
  //     filteredUsers.push(user)
  //   }
  // }
  // ??????????????????????????????filter
  filteredUsers = users.filter(user =>
    (`${user.name} ${user.surname}`).toLowerCase().includes(keyword)
  )
  // ????????????:????????????????????????
  if (filteredUsers.length === 0) {
    return alert(`?????????????????????:${keyword}??????????????????????????????`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

// ???????????????????????????
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * UESRS_PRE_PAGE
  return data.slice(startIndex, startIndex + UESRS_PRE_PAGE)
}

// ???????????????????????? li.page-item
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / UESRS_PRE_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

// ?????? Pagination ????????????????????????
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1));
  })
  .catch((err) => console.log(err));
