const scheme = 'https://';
const v4domain = '.whoami.ipv4-dns.charliejonas.co.uk';
const v6domain = '.whoami.ipv6-dns.charliejonas.co.uk';
const v4 = { addrs: new Set(), dupes: 0, type: "IPv4" };
const v6 = { addrs: new Set(), dupes: 0, type: "IPv6" };

function getEntropy() {
  return (Math.floor(Math.random() * 2e16)).toString(16);
}

const setTextContent = (selector, meta) => {
  if (document.readyState === "complete") {
    const result = [...meta.addrs].reduce((str, addr) => str + "\n" + addr, "");
    document.querySelector(selector).textContent = result.trim();
    const noun = meta.addrs > 1 ? "address" : "addresses";
    const verb = meta.addrs > 1 ? "appears" : "appear";
    const text = `The ${meta.type} ${noun} of your recursive DNS server(s) ${verb} to be:`;
    document.querySelector(selector).previousElementSibling.textContent = text;
  } else {
    window.addEventListener('load', () => {
      setTextContent(selector, meta);
    });
  }
};

const makeRequest = (url, selector, meta) => {
  return fetch(url, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('API request failed: ' + url);
      }
      return response.text();
    })
    .then(addr => {
      addr = addr.trim();
      if (meta.addrs.has(addr)) {
        meta.dupes = meta.dupes + 1;
      } else {
        meta.dupes = 0;
        meta.addrs.add(addr);
        setTextContent(selector, meta);
      }
    })
    .catch(error => {
      meta.dupes = meta.dupes + 1;
      console.error(error);
    });
};

const cueRequests = async (domain, selector, meta) => {
  for (let i = 0; i < 10; i++) {
    makeRequest(scheme + getEntropy() + domain, selector, meta);
  }
  while (meta.dupes < 10) {
    await makeRequest(scheme + getEntropy() + domain, selector, meta);
  }
};

cueRequests(v4domain, '#ipv4addr', v4);
cueRequests(v6domain, '#ipv6addr', v6);
