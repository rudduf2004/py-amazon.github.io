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
    let gp = adsEl.dataset.gp;
    if (!gp || !manifest.hasOwnProperty(gp)) {
      gp = Object.keys(manifest)[0];
    }
    const gpVer = manifest[gp];
    const gpRes = await fetch(`${datahost}/datas/${gp}.json?v=${gpVer}`);
    const gpData = await gpRes.json();
    const randomIndex = Math.floor(Math.random() * gpData.items.length);
    const item = gpData.items[randomIndex];

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("ad-cards-container");
    const aCards = makeACard(item, gpData.updated_at);
    cardsContainer.innerHTML = aCards;
    adsEl.appendChild(cardsContainer);
    adsEl.style.display = '';
  }

  async function init() {
    const manifestRes = await fetch(`${datahost}/datas/manifest.json`);
    const manifest = await manifestRes.json();

    const adsEls = document.getElementsByClassName("amazon_ad_area");
    for (const adsEl of adsEls) {
      make(adsEl, manifest);
    }
  }
  document.addEventListener("DOMContentLoaded", (event) => {
    loadExternalStyle(`${csshost}/css/ads.css`);
    init();
    
  });

  function loadExternalStyle(url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }

})();
