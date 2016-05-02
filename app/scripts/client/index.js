const message = document.querySelector('.message');
const input = document.querySelector('input[type="text"]');
const container = document.querySelector('.list');
const radioButtons = document.querySelectorAll('input[type="radio"]');
const modeString = document.querySelector('.current-mode');

const MODE_LABEL = 'SearchByLabel';
const MODE_LABEL_STR = 'Search by Label';
const MODE_NAME_DESC = 'SearchNameDesc';
const MODE_NAME_DESC_STR = 'Search name or description';

let currentMode = MODE_LABEL;

Array.prototype.forEach.call(radioButtons, (button) => {
  button.addEventListener('change', (e) => {
    const value = e.target.value;
    if (value !== currentMode) {
      container.innerHTML = '';
      if (value === MODE_LABEL) {
        currentMode = MODE_LABEL;
        modeString.textContent = MODE_LABEL_STR;
      } else if (value === MODE_NAME_DESC) {
        currentMode = MODE_NAME_DESC;
        modeString.textContent = MODE_NAME_DESC_STR;
      }
    }
  }, false);
});

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
    return `<div><h3>${item['name']}</h3><img src="${item['preview_image_url']}" style="width:480px;height:270px"><p>${item['description']}</p></img></div>`;
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
    if (currentMode === MODE_LABEL) {
      request(`/api/searchByLabel/?label=${encodeURIComponent(input.value)}`)
      .then(() => {
          input.value = '';
        }
      );
    } else if (currentMode === MODE_NAME_DESC) {
      request(`/api/searchNameDesc/?word=${encodeURIComponent(input.value)}`)
      .then(() => {
          input.value = '';
        }
      );
    }
  }
}

//input.addEventListener('blur', inputHandler, false);
input.addEventListener('keypress', inputHandler, false);
