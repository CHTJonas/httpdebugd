window.addEventListener('load', () => {
  fetch('https://ipv4.debug.charliejonas.co.uk/ipaddr')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv4 network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv4addr').textContent = data)
    .catch(error => console.error(error));
  fetch('https://ipv6.debug.charliejonas.co.uk/ipaddr')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv6 network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv6addr').textContent = data)
    .catch(error => console.error(error));
  fetch('https://invalid.rpki.cloudflare.com/')
    .then(response => {
      if (!response.ok) {
        throw new Error('RPKI invalid prefix network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#rpkiinvalids').textContent = 'does not appear')
    .catch(error => {
      console.error(error);
      console.info('Note: the above error is good! We failed successfully -- this is not a joke! ;P');
    });
});
