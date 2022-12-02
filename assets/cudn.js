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
  fetch('https://ipv4-cudn.charliejonas.co.uk/ip.cgi')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv4 CUDN network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv4addr-cudn').textContent = data)
    .catch(error => console.error(error));
  fetch('https://ipv6-cudn.charliejonas.co.uk/ip.cgi')
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv6 CUDN network connection failed');
      }
      return response.text();
    })
    .then(data => document.querySelector('#ipv6addr-cudn').textContent = data)
    .catch(error => console.error(error));
});
