// Haetaan tämän päivän päivämäärä

const getTodayString = () => {
    return new Date().toISOString().substring(0, 10); 
};


// Muutetaan päivämäärä helpommin luettavaan muotoon esim. Sat, 07 Mar 2026

const formatDate = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};


// Erotetaan päivämäärästä pelkkä alkuosa (jättää timezone tiedon pois)

const extractDate = (dateString) => {
    return dateString.substring(0, 10);
};

export { formatDate, extractDate, getTodayString };