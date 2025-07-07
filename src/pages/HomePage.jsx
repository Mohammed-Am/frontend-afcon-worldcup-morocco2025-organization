
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';

console.log('GSAP object:', gsap);

const HomePage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const matchCardsRef = useRef([]);
  const trophyRef = useRef(null);
  const mainHeadingRef = useRef(null);

  useEffect(() => {
    if (trophyRef.current) {
      gsap.to(trophyRef.current, { rotation: 360, duration: 10, repeat: -1, ease: "none" });
    }
    if (mainHeadingRef.current) {
      gsap.from(mainHeadingRef.current, { opacity: 0, y: -50, duration: 1 });
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const fetchLocalMatches = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/matches`);
        setMatches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching matches from local server. Please make sure the backend server is running.');
        setLoading(false);
      }
    };

    fetchLocalMatches();
  }, []);

  useEffect(() => {
    if (!loading && !error && matchCardsRef.current.length > 0) {
      gsap.from(matchCardsRef.current, {
        duration: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }
  }, [loading, error, matches]);

  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const finishedMatches = matches.filter(match => match.status === 'finished');

  const last5Winners = [
    { year: 2023, winner: 'Ivory Coast' ,img:'https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png/tiny'},
    { year: 2021, winner: 'Senegal' , img:'https://r2.thesportsdb.com/images/media/team/badge/wh8dya1526727459.png/tiny' },
    { year: 2019, winner: 'Algeria' , img:'https://r2.thesportsdb.com/images/media/team/badge/rrwpry1455460218.png/tiny' },
    { year: 2017, winner: 'Cameroon' , img:'https://r2.thesportsdb.com/images/media/team/badge/txqspw1455463989.png/tiny'},
    { year: 2015, winner: 'Ivory Coast' , img: 'https://r2.thesportsdb.com/images/media/team/badge/rwxuuu1455465643.png/tiny' },
  ];

  if (loading) return <p className="text-center mt-8">Loading matches...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 ref={mainHeadingRef} className="text-3xl font-bold text-center my-8">Upcoming Matches</h2>
      {upcomingMatches.length === 0 ? (
        <p className="text-center">No upcoming matches found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingMatches.map((match, index) => (
            <div
              key={match._id}
              ref={el => matchCardsRef.current[index] = el}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="p-6 flex items-center space-x-4">
                {match.teamA.logoUrl && <img src={match.teamA.logoUrl} alt={match.teamA.name} className="w-12 h-12" />}
                <div>
                  <h3 className="text-xl font-bold">{match.teamA.name} vs {match.teamB.name}</h3>
                  <p className="text-gray-800">{new Date(match.date).toLocaleString()}</p>
                  <p className="text-gray-700">{match.venue}</p>
                </div>
                {match.teamB.logoUrl && <img src={match.teamB.logoUrl} alt={match.teamB.name} className="w-12 h-12" />}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-bold text-center my-8 mt-12">Results</h2>
      {finishedMatches.length === 0 ? (
        <p className="text-center">No finished matches found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {finishedMatches.map((match, index) => (
            <div
              key={match._id}
              ref={el => matchCardsRef.current[index] = el}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-100"
            >
              <div className="p-6 flex items-center space-x-4">
                {match.teamA.logoUrl && <img src={match.teamA.logoUrl} alt={match.teamA.name} className="w-12 h-12" />}
                <div>
                  <h3 className="text-xl font-bold">{match.teamA.name} {match.score?.teamA} - {match.score?.teamB} {match.teamB.name}</h3>
                  <p className="text-gray-800">{new Date(match.date).toLocaleString()}</p>
                  <p className="text-gray-700">{match.venue}</p>
                </div>
                {match.teamB.logoUrl && <img src={match.teamB.logoUrl} alt={match.teamB.name} className="w-12 h-12" />}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-bold text-center my-8 mt-12">Last 5 Winners</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <img ref={trophyRef} className="w-24 h-24 md:w-32 md:h-32 object-contain" src="https://r2.thesportsdb.com/images/media/league/trophy/a02gac1701102618.png/medium" alt="" />
        {last5Winners.map((winner, index) => (
          <div key={index} className="p-4 text-center dark:text-gray-100 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <img src={winner.img} alt="Trophy" className="mx-auto mb-2" /> {/* Placeholder for trophy icon */}
            <p className="font-bold">{winner.year}</p>
            <p>{winner.winner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
