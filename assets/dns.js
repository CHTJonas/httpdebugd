function getEntropy() {
  return (Math.floor(Math.random() * 2e16)).toString(16);
}

window.addEventListener('load', () => {
  fetch('https://' + getEntropy() + '.whoami.ipv4-dns.charliejonas.co.uk')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv4 network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv4addr').textContent = data)
    .catch(error => console.error(error));
  fetch('https://' + getEntropy() + '.whoami.ipv6-dns.charliejonas.co.uk/')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv6 network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv6addr').textContent = data)
    .catch(error => console.error(error));
});
