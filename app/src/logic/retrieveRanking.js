function retrieveRanking() {
  return fetch(`http://localhost:9000/characters/ranking`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.token}`
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Failed to fetch, error status: ${res.status}`);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
}

export default retrieveRanking;
