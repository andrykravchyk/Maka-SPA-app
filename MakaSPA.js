window.addEventListener("resize", closeBoxOnDesk);

function closeBoxOnDesk() {
    let id = 'push';
    let elem = document.getElementsByClassName('mobileclick');
    elem[0].innerText = 'Menu';
    if (window.innerWidth >= '779') {
        document.getElementById(id).style.display = 'block';
        // animated = true;
    } else {
        document.getElementById(id).style.display = 'none';
    }

    // if (window.innerWidth >= '481') {
    //     document.getElementById('backForMobile').style.display = 'none';
    // } else {
    //     document.getElementById('backForMobile').style.display = 'block';
    // }
}

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

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
    window.addEventListener('scroll', animOnScroll);

    setTimeout(() => {
        animOnScroll();
    }, 300);
}

function animOnScroll() {
    for (let index = 0; index < animItems.length; index++) {
        const animItem = animItems[index];
        const animItemHeight = animItem.offsetHeight;
        const animItemOffset = offset(animItem).top;
        const animStart = 4;

        let animItemPoint = window.innerHeight - animItemHeight / animStart;

        if (animItemHeight > window.innerHeight) {
            animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }

        if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
            animItem.classList.add('_active');
        } else {
            if (!animItem.classList.contains('_anim-no-hide')) {
                animItem.classList.remove('_active');
            }
        }
    }
}

function offset(el) {
    const rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

const home = document.querySelector('#home');
const slider = document.querySelector('#slider');
const content = document.querySelector('#content');
const onas = document.querySelector('#onas');
const produkty = document.querySelector('#produkty');
const events = document.querySelector('#events');
const franczyza = document.querySelector('#franczyza');
const kontakt = document.querySelector('#kontakt');
const basketPage = document.querySelector('#basketPage');
const orderPage = document.querySelector('#orderPage');
let cache3 = JSON.parse(localStorage.getItem('cache3')) || [];


function amountShow() {
    deleteNull();
    let amount = document.querySelector('.amount');
    amount.style.backgroundColor = 'red';
    amount.innerHTML = cache3.length;
    if (cache3.length === 0) {
        location.hash = '#produkty';
        amount.style.backgroundColor = 'transparent';
        amount.innerHTML = '';
    }
}

function create(item, x) {
    const newEl = document.createElement('div');
    newEl.classList.add('content__Nasze-produkty-item');
    newEl.innerHTML = `<div class="content__Nasze-produkty-picture">
        <img src="${item.imgLink}" alt="${item.name}"></div>
        <img class="sel" src="../images/Mąka_черная.png" alt="Mąka_черная">
        <p>${item.name}</p><h3 class="price">${item.price}zl</h3>`;
    document.querySelector(x).append(newEl);

    let imgSel = newEl.querySelector('img.sel');
    imgSel.addEventListener('click', () => {
        cache3.push({ id: item.id, name: item.name, price: item.price, picture: item.imgLink });
        localStorage.setItem('cache3', JSON.stringify(cache3));
        amountShow();
    })
}

function delete_table(a) {
    let table = document.getElementById(a);
    let rowCount = table.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

function drawBasketTable() {
    deleteNull();
    delete_table('basketTable');
    for (let i = 0; i < cache3.length; i++) {
        if (cache3[i] !== null) {
            const newEl = document.createElement('tr');
            // newEl.setAttribute('data-count', i)
            newEl.innerHTML = `<td>${cache3[i].name}</td><td>${cache3[i].price}</td>
        <td style="width:40%"><img style="width:50%" src="${cache3[i].picture}" alt="${cache3[i].name}"></td>
        <td><img class="delete" style="width:20px" src="../images/trash.png" alt="delete"></td>`;
            document.querySelector('table#basketTable').append(newEl);

            let imgDel = newEl.querySelector('img.delete');
            imgDel.addEventListener('click', function () {
                cache3[i] = null;
                localStorage.setItem('cache3', JSON.stringify(cache3));
                // drawBasketTable()
                const currTr = imgDel.parentElement.parentElement
                currTr.remove();
                amountShow();
            })
        }
    }
}

function deleteNull() {
 for (let i = 0; i < cache3.length; i++) {
    if (cache3[i] === null) {
        cache3.splice(i, 1);
        i--;
    }
    localStorage.setItem('cache3', JSON.stringify(cache3));
 }
}

btn5.addEventListener('click', function (e) {
    e.preventDefault();
    if (basketTable.rows.length > 1) {
        location.hash = '#orderPage';
    } else {
        return
    }
})

btn7.addEventListener('click', () => {
    location.hash = '#basketPage';
    let formReq = document.querySelectorAll('._req');
    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        formRemoveError(input);
    }
})


const order = document.getElementById('order');
order.addEventListener('submit', formSend);

async function formSend(e) {
    e.preventDefault();

    let error = formValidate(order);
    if (error === 0) {
        alert('Twoje zamówienie zostało przyjęte');
        order.reset();
        location.hash = '#produkty';
        let amount = document.querySelector('.amount');
        amount.style.backgroundColor = 'transparent';
        amount.innerHTML = '';
        cache3 = [];
    } else {
        alert('Wypełnij wymagane pola')
    }
}

function formValidate(order) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');
    for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];
        formRemoveError(input);

        if (input.classList.contains('_email')) {
            if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        } else {
            if (input.value === '') {
                formAddError(input);
                error++;
            }
        }
    }
    return error;
}

function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
}

function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}


document.querySelector('.inBasket').addEventListener('click', () => {
    if (!cache3.length == 0) {
        location.hash = '#basketPage';
    } else {
        return
    }
    drawBasketTable(cache3, 'table#basketTable')
})

function locationChange() {
    slider.hidden = true;
    content.hidden = true;
    onas.hidden = true;
    produkty.hidden = true;
    events.hidden = true;
    franczyza.hidden = true;
    kontakt.hidden = true;
    basketPage.hidden = true;
    orderPage.hidden = true;

    switch (location.hash) {
        case "":
            location.hash = "#slider";
            slider.hidden = false;
            content.hidden = false;
            break
        case "#slider":
            slider.hidden = false;
            content.hidden = false;
            break
        case "#onas":
            onas.hidden = false;
            break
        case "#produkty":
            produkty.hidden = false;
            amountShow();
            document.querySelector('div .chleb').innerHTML = '';
            document.querySelector('div .wytrawne').innerHTML = '';
            document.querySelector('div .słodko').innerHTML = '';
            document.querySelector('div .napoje').innerHTML = '';
            fetch("https://it-academy-js-api-zmicerboksha.vercel.app/api/5/ak/bakery")
                .then(res => res.json())
                .then(prods => {
                    prods.forEach(prod => {
                        if (prod.inStock == true) {
                            if (prod.category == "Chleb") {
                                create(prod, 'div.chleb');
                            } else if (prod.category == "Wypieki wytrawne") {
                                create(prod, 'div.wytrawne');
                            } else if (prod.category == "Wypieki na słodko") {
                                create(prod, 'div.słodko');
                            } else if (prod.category == "Napoje") {
                                create(prod, 'div.napoje');
                            }
                        }
                    })
                });
            break
        case "#events":
            events.hidden = false;
            break
        case "#franczyza":
            franczyza.hidden = false;
            break
        case "#kontakt":
            kontakt.hidden = false;
            break
        case "#home":
            slider.hidden = false;
            content.hidden = false;
            break
        case "#basketPage":
            basketPage.hidden = false;
            deleteNull();
            drawBasketTable();
            break
        case "#orderPage":
            orderPage.hidden = false;
            break
    }
}

window.addEventListener('hashchange', locationChange)
locationChange();

document.querySelector('#admin').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.login-window').style.display = 'block';
})

document.querySelector('#exit').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.login-window').style.display = 'none';
})

document.querySelector('#enter').addEventListener('click', (e) => {
    e.preventDefault();
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    if (username.value === 'admin' && password.value === 'admin') {
        location.href = 'Admin.html'
    } else {
        alert('Dane są nieprawidłowe!');
        username.value = '';
        password.value = '';
    }
})








