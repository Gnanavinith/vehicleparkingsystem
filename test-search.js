const axios = require('axios');

async function testSearch() {
  try {
    // First, let's get all parkings to see what's available
    const allParkings = await axios.get('http://localhost:5000/api/parkings', {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2Q0ZjQ0ZjQ0ZjQ0ZjQ0ZjQ0ZjQ0Iiwicm9sZSI6InN0YWZmIiwic3RhbmQiOiI2N2NkNGY0NGY0NGY0NGY0NGY0NGY0NCIsImlhdCI6MTc0MDI0MzI0NCwiZXhwIjoxNzQyODM1MjQ0fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      }
    });
    
    console.log('All parkings:', allParkings.data);
    
    // Now let's test the search with the first parking's vehicle number
    if (allParkings.data.data && allParkings.data.data.length > 0) {
      const firstParking = allParkings.data.data[0];
      console.log('Testing search with vehicle number:', firstParking.vehicleNumber);
      
      const searchResult = await axios.get(`http://localhost:5000/api/parkings/search?vehicleNumber=${encodeURIComponent(firstParking.vehicleNumber)}`, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2Q0ZjQ0ZjQ0ZjQ0ZjQ0ZjQ0ZjQ0Iiwicm9sZSI6InN0YWZmIiwic3RhbmQiOiI2N2NkNGY0NGY0NGY0NGY0NGY0NGY0NCIsImlhdCI6MTc0MDI0MzI0NCwiZXhwIjoxNzQyODM1MjQ0fQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        }
      });
      
      console.log('Search result:', searchResult.data);
    } else {
      console.log('No parkings found in database');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testSearch();