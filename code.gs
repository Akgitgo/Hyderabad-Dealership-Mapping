function geocodeAddresses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  const addressCol = 1; // Column B (0-based index)
  const latCol = 5;     // Column F
  const lngCol = 6;     // Column G
  const pincodeCol = 7; // Column H

  // Define pin code mapping (keyword -> pin)
  const pinCodes = {
    "Gandhi Bhawan": "500001",
    "Moazzampura": "500001",
    "Jubilee Ho": "500002",
    "Secunderabad": "500003",
    "MG Road": "500003",
    "Khairatabad": "500004",
    "Balapur": "500005",
    "Karwan": "500006",
    "Golconda": "500008",
    "Bolarum": "500010",
    "Alwal": "500010",
    "Bowenpally": "500011",
    "Begum Bazar": "500012",
    "Amberpet": "500013",
    "Hakimpet": "500014",
    "Trimulgherry": "500015",
    "Begumpet": "500016",
    "Lallaguda": "500017",
    "Sanathnagar": "500018",
    "Ashoknagar": "500020",
    "Yakutpura": "500023",
    "Chanchalguda": "500024",
    "Nehrunagar": "500025",
    "Barkatpura": "500027",
    "Humayunnagar": "500028",
    "Himayatnagar": "500029",
    "Rajendranagar": "500030",
    "Gachibowli": "500032",
    "Jubilee Hills": "500033",
    "Banjara Hills": "500034",
    "Saroornagar": "500035",
    "Malakpet": "500036",
    "Uppal": "500039",
    "Raj Bhawan": "500041",
    "Nallakunta": "500044",
    "Yousufguda": "500045",
    "Attapur": "500048",
    "Miyapur": "500049",
    "Falaknuma": "500053",
    "Kanchanbagh": "500058",
    "Saidabad": "500059",
    "ECIL": "500062",
    "Bahadurpura": "500064",
    "Shahalibanda": "500065",
    "High Court": "500066",
    "Kukatpally": "500072",
    "L.B. Nagar": "500074",
    "Nacharam": "500076",
    "Kattedan": "500077",
    "Madhapur": "500081",
    "Somajiguda": "500082",
    "JJ Nagar": "500087",
    "Nizampet": "500090",
    "Bachupally": "500090"
  };

  for (let i = 1; i < data.length; i++) {
    const address = data[i][addressCol]?.toString().trim();
    let lat = data[i][latCol];
    let lng = data[i][lngCol];

    if (!address) {
      Logger.log(`Row ${i + 1}: Address is empty`);
      continue;
    }

    // Geocode if lat/lng is not set
    if (!lat || !lng) {
      const response = Maps.newGeocoder().geocode(address);
      if (response.status === 'OK' && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        lat = location.lat;
        lng = location.lng;
        sheet.getRange(i + 1, latCol + 1).setValue(lat);
        sheet.getRange(i + 1, lngCol + 1).setValue(lng);
        Utilities.sleep(1500); // To avoid API limit
      } else {
        Logger.log(`Row ${i + 1}: Geocoding failed for "${address}"`);
        continue;
      }
    }

    // Match address to pin code keywords
    let matchedPincode = '';
    for (const area in pinCodes) {
      if (address.toLowerCase().includes(area.toLowerCase())) {
        matchedPincode = pinCodes[area];
        break;
      }
    }

    if (matchedPincode) {
      sheet.getRange(i + 1, pincodeCol + 1).setValue(matchedPincode);
    } else {
      sheet.getRange(i + 1, pincodeCol + 1).setValue("Not Found");
    }
  }

  Logger.log("Done processing all rows.");
}
