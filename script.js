// ! Selector-----------------------------------------

const userNameEl = document.querySelector(`.userLogin-input`);
const userPinEl = document.querySelector(`.userPin-input`);
const btnLoginEl = document.querySelector(`.btn-login`);

const balanceListUlEl = document.querySelector(`.balanceList-ul`);
const balanceListLiEl = document.querySelectorAll(`.balanceList-li`);

const inValueEl = document.querySelector(`.inValue`);
const outValueEl = document.querySelector(`.outValue`);
const interestValueEL = document.querySelector(`.interestValue`);

const welcomeText = document.querySelector(`.login-text`);

const totalBalanceEL = document.querySelector(`.balance`);
const balanceDateEl = document.querySelector(`.balanceDateValue`);

const transferEl = document.querySelector(`.transferTo`);
const transferAmmountEl = document.querySelector(`.transferTo-amount`);
const transferBtn = document.querySelector(`.transferBtn`);

const btnLoan = document.querySelector(`.loanBtn`);
const loanEl = document.querySelector(`.loanInput`);

const closeAccEl = document.querySelector(`.closeAccountName`);
const closeAccPinEL = document.querySelector(`.closeAccountPin`);
const btnClose = document.querySelector(`.closeBtn`);

const btnSort = document.querySelector(`.sortBtn`);

const logOutTimer = document.querySelector(`.logOutTimer`);

// ! Data--------------------------------
const account1 = {
  owner: "Jonas Schmedtmann",
  user: `js`,
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-10-15T09:02:34.735Z",
    "2022-08-17T07:42:02.383Z",
    "2022-08-15T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  user: `jd`,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
const accounts = [account1, account2];

// ! Functions----------------------------------------

// ! FORMAT NUMBER

const formatBalance = function (locale, currency, value) {
  return new Intl.NumberFormat(locale, {
    style: `currency`,
    currency: currency,
  }).format(value);
};

// ! BALANCE LIST FUNCTION----------------------------
const balanceListFunc = function (acc, sort = false) {
  balanceListUlEl.textContent = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const curDate = new Date();
    const balanceDate = balanceListDateFunc(
      curDate,
      curAccount.movementsDates[i]
    );

    const balanceList = `
    <li class="balanceList-li">
      <p class="deposite">
      <span class="${mov < 0 ? "withdrawalInd" : "depositeInd"}">${i + 1} ${
      mov > 0 ? "DEPOSITE" : "WITHDRAWAL"
    }</span>
      <span class="balance-date">${balanceDate}</span>
      </p>
      <p class="balance-value">${formatBalance(
        curAccount.locale,
        curAccount.currency,
        mov
      )}</p>
    </li>`;

    balanceListUlEl.insertAdjacentHTML(`afterbegin`, balanceList);
  });
};

// ! FUNCTION USER LOGIN-------------------------------

const userLoginFunc = function (acc) {
  balanceListFunc(acc);
  inOutInterstFunc(acc);
  totalBalanceFunc(acc);
  curBalanceDateFunc(acc);
};
let curAccount, timer;
// !BTN LOGIN ADD EVENT LISTENER---------------------

btnLoginEl.addEventListener(`click`, function (e) {
  e.preventDefault();
  let userName = userNameEl.value;
  let userPin = +userPinEl.value;

  curAccount = accounts.find(function (acc) {
    return userName === acc.user && userPin === acc.pin;
  });
  welcomeText.textContent = `Welcome Back ${curAccount.owner}`;

  userLoginFunc(curAccount);
  userNameEl.value = "";
  userPinEl.value = "";
  document.querySelector(`main`).style.opacity = 1;
  logOutTimerFunc(15);
});
// ! IN OUT INTEREST FUNCTION----------------------------
const inOutInterstFunc = function (account) {
  const inValue = account.movements
    .filter(function (inVal) {
      return inVal > 0;
    })
    .reduce(function (acc, el) {
      return acc + el;
    }, 0);

  const outValue = account.movements
    .filter(function (outVal) {
      return outVal < 0;
    })
    .reduce(function (acc, el) {
      return acc + el;
    }, 0);

  const interestValue = account.movements
    .filter(function (inteValue) {
      return inteValue > 0;
    })
    .map(function (el) {
      return (el * curAccount.interestRate) / 100;
    })
    .filter(function (el) {
      return el >= 1;
    })
    .reduce(function (acc, el) {
      return acc + el;
    }, 0);

  inValueEl.textContent = `${formatBalance(
    curAccount.locale,
    curAccount.currency,
    inValue
  )}`;
  outValueEl.textContent = `${formatBalance(
    curAccount.locale,
    curAccount.currency,
    Math.abs(outValue)
  )}`;
  interestValueEL.textContent = `${formatBalance(
    curAccount.locale,
    curAccount.currency,
    interestValue
  )}`;
};
// ! TOTAL BALANCE FUNCTION----------------------------------
const totalBalanceFunc = function (account) {
  const totalBalance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  totalBalanceEL.textContent = `${formatBalance(
    curAccount.locale,
    curAccount.currency,
    totalBalance
  )}`;
  curAccount.totalBalance = totalBalance;
};
// ! CURRENT BALNCE DATE----------------------------

const curBalanceDateFunc = function (acc) {
  const date = new Date();
  const locale = navigator.language;
  const options = {
    hour: `numeric`,
    minute: `numeric`,
    day: `numeric`,
    month: `numeric`,
    year: `numeric`,
    // weekday: `long`,
  };
  const curDate = new Intl.DateTimeFormat(locale, options).format(date);
  balanceDateEl.textContent = curDate;
};

// ! BALANCE lIST DATE FUNCTION-----------------------

const balanceListDateFunc = function (curDate, listDate) {
  let listDates = new Date(listDate);
  let date = curDate - new Date(listDate);
  let totalDay = Math.trunc(date / (1000 * 60 * 60 * 24));
  if (totalDay === 0) {
    return (totalDay = `Today`);
  } else if (totalDay === 1) {
    return (totalDay = `Yesterday`);
  } else if (totalDay === 2) {
    return (totalDay = `2 Days Ago`);
  } else if (totalDay === 3) {
    return (totalDay = `3 Days Ago`);
  } else if (totalDay === 7) {
    return totalDay === `1 Weeks Ago`;
  } else {
    return new Intl.DateTimeFormat(curAccount.locale).format(listDates);
  }
};
// ! FUNCTION TRANSFER LOAN FUNCTION-------------------------

const transferFunc = function (acc) {
  const curDate = new Date();
  let transferVal = transferEl.value;
  let transferAmmount = +transferAmmountEl.value;

  const reciveracc = accounts.find(function (acc) {
    return acc.user === transferVal;
  });
  if (
    reciveracc != curAccount &&
    transferVal != "" &&
    transferAmmount != "" &&
    curAccount.totalBalance >= transferAmmount &&
    transferAmmount > 0
  ) {
    reciveracc.movements.push(transferAmmount);
    curAccount.movements.push(-transferAmmount);

    reciveracc.movementsDates.push(curDate.toISOString());
    curAccount.movementsDates.push(curDate.toDateString());
  }
  console.log(reciveracc);
};
transferBtn.addEventListener(`click`, function () {
  transferFunc(curAccount);
  userLoginFunc(curAccount);

  transferEl.value = "";
  transferAmmountEl.value = "";

  clearInterval(timer);
  timer = logOutTimerFunc();
});

// ! TRANSFER LOAN FUNCTION --------------------------
const transferLoanFunc = function () {
  const date = new Date();
  const loanVal = +loanEl.value;
  console.log(loanVal);

  if (
    loanVal > 0 &&
    loanVal != "" &&
    curAccount.movements.some(function (mov) {
      return mov >= loanVal * 0.1;
    })
  ) {
    curAccount.movements.push(loanVal);
    curAccount.movementsDates.push(date.toISOString());
  }
};
btnLoan.addEventListener(`click`, function () {
  transferLoanFunc();

  clearInterval(timer);
  timer = logOutTimerFunc();

  loanEl.value = "";

  userLoginFunc(curAccount);
});

// ! CLOSE ACCOUNT FUNCTION ------------------------------

const closeAccFunc = function () {
  let closeAcc = closeAccEl.value;
  let closeAccPin = +closeAccPinEL.value;

  if (closeAcc === curAccount.user && closeAccPin === curAccount.pin) {
    const index = accounts.findIndex(function (acc) {
      return acc.user === curAccount.user;
    });

    accounts.splice(index, 1);
  }
};
btnClose.addEventListener(`click`, function () {
  console.log(`clicked`);
  closeAccFunc();

  closeAccEl.value = "";
  closeAccPinEL.value = "";

  clearInterval(timer);

  document.querySelector(`main`).style.opacity = 0;
  welcomeText.textContent = `Log In To Get Started`;
});

let sorted = false;
btnSort.addEventListener(`click`, function () {
  balanceListFunc(curAccount, !sorted);
  console.log(sorted);

  sorted = !sorted;
  console.log(sorted);
});
// ! LOG OUT TIMER FUCNTION-----------------------------

const logOutTimerFunc = function () {
  let time = 300;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    if (time >= 0) {
      logOutTimer.textContent = `${min}:${sec}`;
      document.querySelector(`main`).style.opacity = 1;
    }
    if (time === 0) {
      document.querySelector(`main`).style.opacity = 0;
    }
    time--;
  };

  tick();

  timer = setInterval(tick, 1000);
  return timer;
};
