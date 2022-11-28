
function toggleBox(id) {
  let display;
  let elem = document.getElementsByClassName('mobileclick');
  display = document.getElementById(id).style.display;
  if (display == 'none' || display == '') {
      document.getElementById(id).style.display = 'block';
      elem[0].innerText = 'Zamknij';
  } else {
      document.getElementById(id).style.display = 'none';
      elem[0].innerText = 'Menu';
  }
};

let addUser = document.querySelector('.addUser');
let divs = document.querySelectorAll('.control-wrapper');

function rem() {
  divs[0].classList.remove('with-error');
  divs[1].classList.remove('with-error');
  divs[3].classList.remove('with-error');
  divs[4].classList.remove('with-error');
}

function resForm() {
  inStock.checked = false;
  name.value = '';
  category.value = '';
  price.value = '';
  file.value = '';
}

addUser.addEventListener('click', function () {
  let display = document.querySelector('.form-wrapper').style.display;
  if (display == 'none' || display == '') {
    document.querySelector('.form-wrapper').style.display = 'block';
  } else {
    document.querySelector('.form-wrapper').style.display = 'none';
    rem();
  }
})

function delete_table(a) {
  let table = document.getElementById(a);
  let rowCount = table.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}

const { name, category, inStock, price, file } = document.forms.form1;

const url = "https://it-academy-js-api-zmicerboksha.vercel.app/api/5/ak/bakery";
const form = document.querySelector("form");

// async function proba() {
// let response = await fetch(url)
// let prods = await response.json()
// for (let i = 0; i <= prods.length - 1; i++) {
//   // const newEl = document.createElement('tr');
//   // newEl.innerHTML = `<td>${prods[i].id}</td><td>${prods[i].category}</td><td>${prods[i].name}</td><td>${prods[i].inStock}</td>
//   //   <td>${prods[i].price}zl</td><td style="width:40%"><img style="width:50%" src="${prods[i].imgLink}" alt="${prods[i].name}"></td>
//   //   <td><a href="#home"><img class="edit" style="width:20px" src="images/edit.png" alt="edit"></a></td>
//   //   <td><img class="delete" style="width:20px" src="images/trash.png" alt="delete"></td>`;
//   // document.querySelector('table').append(newEl);
//   console.log(prods[i]);

// }
// }
// proba()

let prods = [];

async function get() {
  let response = await fetch(url)
  let elem = await response.json()
  for (let i = 0; i < elem.length; i++) {
    prods.push(elem[i]);
  }
  drawTable(prods)
}
get()

function drawTable(items) {
  delete_table('gameboard');
  for (let i = 0; i <= items.length; i++) {
    const newEl = document.createElement('tr');
    newEl.innerHTML = `<td>${items[i].id}</td><td>${items[i].category}</td><td>${items[i].name}</td><td>${items[i].inStock}</td>
      <td>${items[i].price}zl</td><td style="width:40%"><img style="width:50%" src="${items[i].imgLink}" alt="${items[i].name}"></td>
      <td><a href="#home"><img class="edit" style="width:20px" src="../images/edit.png" alt="edit"></a></td>
      <td><img class="delete" style="width:20px" src="../images/trash.png" alt="delete"></td>`;
    document.querySelector('table').append(newEl);

    let imgDel = newEl.querySelector('img.delete');
    imgDel.addEventListener('click', function () {
      fetch(`https://it-academy-js-api-zmicerboksha.vercel.app/api/5/ak/bakery/${items[i].id}`, {
        method: 'DELETE'
      })
      const currTr = imgDel.parentElement.parentElement
      currTr.remove();
      alert('Produkt usunięty!');
    })

    let imgEdit = newEl.querySelector('img.edit');
    imgEdit.addEventListener('click', function () {
      addUser.style.display = 'none';
      document.querySelector('.form-wrapper').style.display = 'block';
      rem();
      btn1.style.visibility = 'hidden';
      btn2.style.visibility = 'visible';
      btn4.style.visibility = 'visible';
      name.value = items[i].name;
      category.value = items[i].category;
      if (items[i].inStock === false) {
        inStock.checked = false;
      } else if (items[i].inStock === true) {
        inStock.checked = true;
      } else {
        return
      }
      price.value = items[i].price;

      btn2.addEventListener('click', function (el) {
        el.preventDefault();
        document.querySelector('.form-wrapper').style.display = 'none';
        const formData = new FormData(form)
        formData.set('inStock', document.querySelector('#inStock').checked)
        fetch(`https://it-academy-js-api-zmicerboksha.vercel.app/api/5/ak/bakery/${items[i].id}`, {
          method: "put",
          body: formData
        })
          .then(() =>
            fetch(url)
              .then(res => res.json())
              .then((prods => {
                drawTable(prods)
              }))
          )
        btn1.style.visibility = 'visible';
        btn2.style.visibility = 'hidden';
        addUser.style.display = 'block';
        resForm()
        alert('Zmiany zastosowane!');
      })

      btn4.addEventListener('click', function (el) {
        el.preventDefault();
        document.querySelector('.form-wrapper').style.display = 'none';
        addUser.style.display = 'block';
        btn1.style.visibility = 'visible';
        btn2.style.visibility = 'hidden';
        btn4.style.visibility = 'hidden';
        resForm()
      })

    })
  }
}

btn1.addEventListener("click", e => {
  e.preventDefault();
  const formData = new FormData(form)
  formData.set('inStock', document.querySelector('#inStock').checked)
  fetch(url, {
    method: "post",
    body: formData
  })
    .then(() =>
      fetch(url)
        .then(res => res.json())
        .then((prods => {
          drawTable(prods);
        }))
    );
  alert('Dodano produkt!');
  resForm();
});


let addError = function (b) {
  let x;
  if (b == name) {
    x = 0;
  } else if (b == category) {
    x = 1;
  }
  else if (b == price) {
    x = 3;
  }
  else if (b == file) {
    x = 4;
  } else {
    return
  }

  b.onblur = function () {
    if (!b.value || b.value == ' ') {
      divs[x].classList.add('with-error');
    }
  }
}


let removeError = function (b) {
  let x;
  if (b == name) {
    x = 0;
  } else if (b == category) {
    x = 1;
  }
  else if (b == price) {
    x = 3;
  }
  else if (b == file) {
    x = 4;
  } else {
    return
  }

  b.onfocus = function () {
    if (divs[x].classList.contains('with-error')) {
      divs[x].classList.remove('with-error');
    }
  }
}

addError(name);
removeError(name);
addError(category);
removeError(category);
addError(file);
removeError(file);
addError(price);
removeError(price);
