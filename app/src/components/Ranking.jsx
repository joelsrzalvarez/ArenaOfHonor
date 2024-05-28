import React, { useEffect, useState } from 'react';
import retrieveRanking from '../logic/retrieveRanking';
import './Ranking.css';

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

  const getEloImage = (winStreak) => {
    const divisions = {
      bronze: { min: 1, max: 500 },
      silver: { min: 501, max: 799 },
      gold: { min: 800, max: 999 },
      platinum: { min: 1000, max: 1499 },
      emerald: { min: 1500, max: 1999 },
      diamond: { min: 2000, max: 2499 },
      master: { min: 2500, max: 2999 },
      grandmaster: { min: 3000, max: 3499 },
      challenger: { min: 3500, max: Infinity },
    };

    const division = Object.entries(divisions).find(([name, range]) =>
      winStreak >= range.min && winStreak <= range.max
    )?.[0] || 'iron';

    return `/assets/img/elo/${division}.png`;
  };

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
                <th>Division</th>
              </tr>
            </thead>
            <tbody>
              {currentCharacters.map((char, index) => (
                <tr key={char._id}>
                  <td>{getPosition(startIndex + index)}</td>
                  <td>{char.name}</td>
                  <td>{char.clase}</td>
                  <td>
                    <img src={getEloImage(char.win_streak)} width='60px' height='60px' alt={char.win_streak} className="elo-image" />
                  </td>
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
