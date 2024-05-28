function retrieveShop() {
    return fetch('http://localhost:9000/shop', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Failed to fetch, error status: ${res.status}`);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        throw error;
      });
  }
  
  export default retrieveShop;
  