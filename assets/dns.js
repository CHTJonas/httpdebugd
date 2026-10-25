const v4addrs = new Set();
const v6addrs = new Set();

function getEntropy() {
  return (Math.floor(Math.random() * 2e16)).toString(16);
}

const setTextContent = (selector, set) => {
  if (document.readyState === "complete") {
    const result = [...set].reduce((str, addr) => str + "\n" + addr, "");
    document.querySelector(selector).textContent = result.trim();
  } else {
    window.addEventListener('load', () => {
      setTextContent(selector, set);
    });
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = (url, selector, set) => {
  return fetch(url, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('API request failed: ' + url);
      }
      return response.text().trim();
    })
    .then(async addr => {
      set.add(addr.trim());
      setTextContent(selector, set);
      await sleep(100);
    })
    .catch(error => console.error(error));
}

const scheme = 'https://';
const v4domain = '.whoami.ipv4-dns.charliejonas.co.uk';
const v6domain = '.whoami.ipv6-dns.charliejonas.co.uk';

for (let i = 0; i < 10; i++) {
  makeRequest(scheme + getEntropy() + v4domain, '#ipv4addr', v4addrs);
  makeRequest(scheme + getEntropy() + v6domain, '#ipv6addr', v6addrs);
}
