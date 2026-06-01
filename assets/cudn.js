const setTextContent = (selector, textContent) => {
  if (document.readyState === "complete") {
    document.querySelector(selector).textContent = textContent;
  } else {
    window.addEventListener('load', () => {
      setTextContent(selector, textContent);
    });
  }
};

fetch('https://ipv4.debug.charliejonas.co.uk/ipaddr', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv4 network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv4addr', data))
  .catch(error => console.error(error));

fetch('https://ipv6.debug.charliejonas.co.uk/ipaddr', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv6 network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv6addr', data))
  .catch(error => console.error(error));

fetch('https://ipv4-cudn.charliejonas.co.uk/ip.cgi', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv4 CUDN network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv4addr-cudn', data))
  .catch(error => console.error(error));

fetch('https://ipv6-cudn.charliejonas.co.uk/ip.cgi', { cache: 'no-store' })
  .then(response => {
    if (!response.ok) {
      throw new Error('IPv6 CUDN network connection failed');
    }
    return response.text();
  })
  .then(data => setTextContent('#ipv6addr-cudn', data))
  .catch(error => console.error(error));
