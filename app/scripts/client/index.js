const message = document.querySelector('.message');
const input = document.querySelector('input');
const container = document.querySelector('.list');

function get(url) {
  return new Promise((fulfill, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        fulfill(xhr.response);
      } else {
        reject(xhr.status);
      }
    };
    xhr.onerror = (e) => {
      reject(e);
    };
    xhr.send();
  });
}

function displayError() {
  input.disabled = false;
  input.addEventListener('blur', inputHandler, false);
  input.addEventListener('keypress', inputHandler, false);
  message.innerHTML = 'Invalid URL.';
}

function displayLoading() {
  input.disabled = true;
  input.removeEventListener('blur', inputHandler, false);
  input.removeEventListener('keypress', inputHandler, false);
  message.innerHTML = 'Loading...';
}

function displayLoaded() {
  input.disabled = false;
  input.addEventListener('blur', inputHandler, false);
  input.addEventListener('keypress', inputHandler, false);
  message.innerHTML = 'Loaded.';
}

function displayList(response) {
  let elementList, itemList;

  try {
    itemList = JSON.parse(response);
  } catch (e) {
    itemList = [];
  }
  elementList = itemList.map((item) => {
    return `<div><h3>${item['name']}</h3><img src="${item['preview_image_url']}"><p>${item['description']}</p></img></div>`;
  });
  container.innerHTML = elementList.join('');

  displayLoaded();
}

function request(url) {
  displayLoading();
  return get(url)
  .then(
    (res) => {
      displayList(res);
    },
    (e) => {
      displayError();
    }
  );
}

function inputHandler (ev) {
  //ev.preventDefault();
  if (ev.type === 'keypress' && ev.keyCode !== 13) {
    return;
  }

  console.log(`inputHandler value=${input.value}`);

  if (input.value) {
    request(`/api/searchByLabel/?label=${encodeURIComponent(input.value)}`)
    .then(() => {
        input.value = '';
      }
    );
  }
}

//input.addEventListener('blur', inputHandler, false);
input.addEventListener('keypress', inputHandler, false);
