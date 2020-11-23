const puppeteer = require('puppeteer');

//scroll page to end
async function scrollDown(page) {
  await page.$eval('.group_l_row.clear_fix:last-child', (e) => {
    e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
  });
}

module.exports = async function (login, password, count, public) {
  //create browser window
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 600, height: 800 },
  });

  //create new page
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1000 });

  //no image
  await page.setRequestInterception(true);
  page.on('request', (interceptedRequest) => {
    if (interceptedRequest.resourceType() === 'image') interceptedRequest.abort();
    else interceptedRequest.continue();
  });

  //login and password
  page.goto('https://vk.com/');
  await page.waitForSelector('#index_email');
  await page.type('#index_email', `${login}`);
  await page.type('#index_pass', `${password}`);
  await page.click('#index_login_button');
  await page.waitForTimeout(4000);

  //go to the page with user-group
  //scroll to the desired number of users
  await page.goto(`https://vk.com/${public}?act=users`);
  let howManyUsers = 0;
  while (howManyUsers <= count) {
    console.log(howManyUsers);
    await scrollDown(page);
    await page.waitForTimeout(1000);
    howManyUsers = await page.$$eval('.group_l_row.clear_fix', (e) => e.length);
  }

  const users = await page.evaluate(() => {
    let usersIsBanned = [];
    let link = {};
    let users = document.querySelectorAll('.group_l_row.clear_fix');

    //checking all users
    for (let i = 0; i < users.length; i++) {
      const nameOfUser = users[i].querySelector('.group_u_title').innerText;
      const idOfUser = users[i].querySelector('.group_u_title').getAttribute('href');
      link[nameOfUser] = {
        id: idOfUser,
        selector: users[i].id,
      };
      //check for banned the profile
      const linkOnAvatar = users[i].querySelector('.group_u_photo_img').getAttribute('src');
      if (linkOnAvatar === '/images/deactivated_100.png?ava=1') {
        usersIsBanned.push(users[i].id);
      }
    }
    return { userslinkpage: link, banned: usersIsBanned };
  });

  let usersIsBanned = Object.keys(users.banned).length;
  console.log(`users banned: ${usersIsBanned}`);

  //перебираем юзеров, которых забанили и удаляем из группы
  if (usersIsBanned > 0) {
    for (let key in users['banned']) {
      console.log(`Пользователь: ${users['banned'][key]}`);
      await page.click(`#${users['banned'][key]} > div.group_u_actions > a`);
    }
  }

  //check for last online. if > 3 month then delete
  let counter = 0;
  let userscounter = 0;
  for (let key in users['userslinkpage']) {
    userscounter++;
    console.log(`${userscounter} юзер из ${count}`);
    const pageUser = await browser.newPage();
    await pageUser.setViewport({ width: 1000, height: 1000 });
    await pageUser.setRequestInterception(true);
    pageUser.on('request', (interceptedRequest) => {
      if (interceptedRequest.resourceType() === 'image') interceptedRequest.abort();
      else interceptedRequest.continue();
    });
    pageUser.goto(`https://vk.com${users['userslinkpage'][key].id}`);
    try {
      await pageUser.waitForSelector('.profile_online_lv');
      await pageUser._client.send('Page.stopLoading');
      let lastOnline = await pageUser.$eval('.profile_online_lv', (elem) => elem.innerText);
      console.log(`${key}. Онлайн: ${lastOnline}`);
      if (lastOnline.length === 0) {
        counter++;
        console.log('Удалён из группы');
        await page.bringToFront();
        await page.click(`#${users['userslinkpage'][key].selector} > div.group_u_actions > a`);
        console.log(`Количество удалённых ${counter}`);
      }
      await pageUser.close();
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.log('защита вк. Ждём 10 секунд');
        await pageUser.waitForTimeout(10000);
        await pageUser.close();
      } else {
        throw error;
      }
    }
  }
  browser.close();
};
