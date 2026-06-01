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
  .then(data => {
    setTextContent('#ipv4addr', "Your IPv4 address appears to be " + data);
  })
  .catch(error => {
    setTextContent('#ipv4addr', "You appear to have no IPv4 connectivity.");
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
    setTextContent('#ipv6addr', "Your IPv6 address appears to be " + data);
  })
  .catch(error => {
    setTextContent('#ipv6addr', "You appear to have no IPv6 connectivity.");
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
      setTextContent('#ipv4rpki', "Your IPv4 connection appears to filter RPKI invalid prefixes");
    } else {
      setTextContent('#ipv4rpki', "Your IPv4 connection does NOT appear to filter RPKI invalid prefixes");
    }
  })
  .catch(error => {
    setTextContent('#ipv4rpki', "You appear to have no IPv4 connectivity.");
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
      setTextContent('#ipv6rpki', "Your IPv6 connection appears to filter RPKI invalid prefixes");
    } else {
      setTextContent('#ipv6rpki', "Your IPv6 connection does NOT appear to filter RPKI invalid prefixes");
    }
  })
  .catch(error => {
    setTextContent('#ipv6rpki', "You appear to have no IPv6 connectivity.");
    console.error(error);
  });
