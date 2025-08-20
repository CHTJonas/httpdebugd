window.addEventListener('load', () => {
  fetch('https://ipv4.debug.charliejonas.co.uk/ipaddr', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv4 network connection failed');
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('#ipv4addr').textContent = "Your IPv4 address appears to be " + data;
    })
    .catch(error => {
      document.querySelector('#ipv4addr').textContent = "You appear to have no IPv4 connectivity.";
      console.error(error);
    });

  fetch('https://ipv6.debug.charliejonas.co.uk/ipaddr', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv6 network connection failed');
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('#ipv6addr').textContent = "Your IPv6 address appears to be " + data;
    })
    .catch(error => {
      document.querySelector('#ipv6addr').textContent = "You appear to have no IPv6 connectivity.";
      console.error(error);
    });

  fetch('https://rpkitest4.nlnetlabs.net/', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv4 network connection failed');
      }
      return response.json();
    })
    .then(data => {
      if (data['rpki-valid-passed'] && !data['rpki-invalid-passed']) {
        document.querySelector('#ipv4rpki').textContent = "Your IPv4 connection appears to filter RPKI invalid prefixes";
      } else {
        document.querySelector('#ipv4rpki').textContent = "Your IPv4 connection does NOT appear to filter RPKI invalid prefixes";
      }
    })
    .catch(error => {
      document.querySelector('#ipv4rpki').textContent = "You appear to have no IPv4 connectivity.";
      console.error(error);
    });

  fetch('https://rpkitest6.nlnetlabs.net/', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error('IPv6 network connection failed');
      }
      return response.json();
    })
    .then(data => {
      if (data['rpki-valid-passed'] && !data['rpki-invalid-passed']) {
        document.querySelector('#ipv6rpki').textContent = "Your IPv6 connection appears to filter RPKI invalid prefixes";
      } else {
        document.querySelector('#ipv6rpki').textContent = "Your IPv6 connection does NOT appear to filter RPKI invalid prefixes";
      }
    })
    .catch(error => {
      document.querySelector('#ipv6rpki').textContent = "You appear to have no IPv6 connectivity.";
      console.error(error);
    });
});
