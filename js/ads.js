"use strict";

(() => {
  // const csshost = "http://127.0.0.1:3000";
  const csshost = "https://ads.trendhub.app";
  const datahost = "https://ads.trendhub.app";
  function makeRatingContainer(rating) {
    const container = document.createElement("div");
    container.classList.add("rating-container");

    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars-container");

    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.classList.add("star");
      star.textContent = "★";

      if (rating >= i + 1) {
        star.classList.add("filled");
      } else if (rating > i && rating < i + 1) {
        star.classList.add("half");
      }
      starsContainer.appendChild(star);
    }
    container.appendChild(starsContainer);
    return container;
  }

  function makeACard(item, updated_at) {
    let rating_html = "";
    if (item.rating) {
      let reviews_html = `<span class="a-size-small">${item.reviews}</span>`;
      rating_html = `
      <div class="a-row">
        <a class="a-card-rating-container a-link-normal" href="${
          item.url
        }" rel="nofollow" target="_blank">
          ${makeRatingContainer(item.rating).innerHTML}
          ${reviews_html}
        </a>
      </div>
    `;
    }
    let price_html = "";
    if (item.price) {
      price_html = `
      <div class="a-row">
          <a class="a-link-normal" href="${item.url}" rel="nofollow" target="_blank">
            <div class="a-color-price">${item.price}</div>
          </a>
      </div>`;
    }
    let updated_at_txt = new Date(updated_at * 1000).toISOString().slice(2, 10);
    return `
    <div class="a-card">
      <div class="a-card-img-container">
        <a class="a-link-normal" href="${item.url}" rel="nofollow" target="_blank">
          <img src="${item.img}" alt="${item.url}">
        </a>
      </div>
      <div class="a-card-desc-container">
        <a class="a-link-normal" href="${item.url}" rel="nofollow" target="_blank">
            <div class="css-line-clamp-3">${item.title}</div>
        </a>
        ${rating_html}
        ${price_html}
        <div class="a-card-updated a-size-super-small">${updated_at_txt}</div>
      </div>
    </div>`;
  }

  async function make(adsEl, manifest) {

    let direction = adsEl.dataset.direction;
    let imgWidth = adsEl.dataset.imgWidth;

    const gps = Object.keys(manifest);

    let gp = adsEl.dataset.gp;
    if (!gp || !manifest.hasOwnProperty(gp)) {
      const randomGpIndex = Math.floor(Math.random() * gps.length);
      gp = gps[randomGpIndex];
    }
    // console.log(gp)
    const gpVer = manifest[gp];
    const gpRes = await fetch(`${datahost}/datas/${gp}.json?v=${gpVer}`);
    const gpData = await gpRes.json();
    const randomIndex = Math.floor(Math.random() * gpData.items.length);
    const item = gpData.items[randomIndex];

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("ad-cards-container");
    if (imgWidth) {
      cardsContainer.style.setProperty('--amazon_ad_area-img-width',`${imgWidth}px`);
    }
    if (direction == 'row') {
      cardsContainer.classList.add("ad-cards-container--row");
    }
    const aCards = makeACard(item, gpData.updated_at);
    cardsContainer.innerHTML = aCards;
    adsEl.appendChild(cardsContainer);
    adsEl.style.display = '';
  }
  function generateVersionString() {
    const now = new Date();

    // 시간을 5분 간격으로 조정
    const minutes = now.getMinutes();
    const adjustedMinutes = Math.floor(minutes / 5) * 5;
    now.setMinutes(adjustedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // 버전 문자열 생성 (YYYYMMDD-HHmm 형식)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');

    return `${year}${month}${date}${hours}${mins}`;
  }
  let ver = generateVersionString();
  async function init() {
    const manifestRes = await fetch(`${datahost}/datas/manifest.json?v=${ver}`);
    const manifest = await manifestRes.json();
    if (!manifest || Object.keys(manifest).length === 0) {
      return;
    }

    const adsEls = document.getElementsByClassName("amazon_ad_area");
    for (const adsEl of adsEls) {
      make(adsEl, manifest);
    }
  }
  document.addEventListener("DOMContentLoaded", (event) => {
    loadExternalStyle(`${csshost}/css/ads.css?v=${ver}`);
    init();
    
  });

  function loadExternalStyle(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

})();
