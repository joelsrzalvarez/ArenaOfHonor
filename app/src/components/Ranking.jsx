import React, { useEffect, useState } from 'react';
import retrieveRanking from '../logic/retrieveRanking';
import './Ranking.css';
 //TODO Retrieve elo logo instead ELO points
function Ranking({ show, onClose }) {
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (show) {
      retrieveRanking()
        .then(chars => {
          const sortedCharacters = chars
            .filter(char => char.win_streak > 0)
            .sort((a, b) => b.win_streak - a.win_streak);
          setCharacters(sortedCharacters);
        })
        .catch(err => {
          console.error('Error retrieving characters:', err);
          setError('Failed to retrieve characters');
        });
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const handleClickNext = () => {
    if (currentPage * itemsPerPage < characters.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleClickPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCharacters = characters.slice(startIndex, startIndex + itemsPerPage);

  const getPosition = (index) => {
    switch(index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return index + 1;
    }
  };

  const getEloImageAndClass = (elo) => {
    switch(elo) {
        case 'iron':
            return '/assets/img/elo/iron.png';
        case 'bronze':
            return '/assets/img/elo/bronze.png'; 
        case 'silver':
            return '/assets/img/elo/silver.png'; 
        case 'gold':
            return '/assets/img/elo/gold.png'; 
        case 'platinum':
            return '/assets/img/elo/platinum.png'; 
        case 'emerald':
            return '/assets/img/elo/emerald.png'; 
        case 'diamond':
            return '/assets/img/elo/diamond.png'; 
        case 'master':
            return '/assets/img/elo/master.png'; 
        case 'grandmaster':
            return '/assets/img/elo/grandmaster.png';
        case 'challenger':
            return '/assets/img/elo/challenger.png'; 
        default:
            return '/assets/img/elo/default.png'; 
    }
}

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🏆 Ranking</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Class</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {currentCharacters.map((char, index) => (
                <tr key={char._id}>
                  <td>{getPosition(startIndex + index)}</td>
                  <td>{char.name}</td>
                  <td>{char.clase}</td>
                  <td>{char.win_streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button className="btn btn-primary" onClick={handleClickPrev} disabled={currentPage === 1}>
              Previous
            </button>
            <button className="btn btn-primary" onClick={handleClickNext} disabled={currentPage * itemsPerPage >= characters.length}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ranking;
