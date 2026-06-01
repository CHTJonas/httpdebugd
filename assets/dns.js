function getEntropy() {
  return (Math.floor(Math.random() * 2e16)).toString(16);
}

const setTextContent = (selector, textContent) => {
  if (document.readyState === "complete") {
    document.querySelector(selector).textContent = textContent;
  } else {
    window.addEventListener('load', () => {
      setTextContent(selector, textContent);
    });
  }
};

fetch('https://' + getEntropy() + '.whoami.ipv4-dns.charliejonas.co.uk', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv4 network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv4addr', data))
  .catch(error => console.error(error));

fetch('https://' + getEntropy() + '.whoami.ipv6-dns.charliejonas.co.uk/', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv6 network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv6addr', data))
  .catch(error => console.error(error));
