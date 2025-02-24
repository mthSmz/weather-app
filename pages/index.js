import { useState, useEffect } from "react";

import { MainCard } from "../components/MainCard";
import { ContentBox } from "../components/ContentBox";
import { Header } from "../components/Header";
import { DateAndTime } from "../components/DateAndTime";
import { Search } from "../components/Search";
import { MetricsBox } from "../components/MetricsBox";
import { UnitSwitch } from "../components/UnitSwitch";
import { LoadingScreen } from "../components/LoadingScreen";
import { ErrorScreen } from "../components/ErrorScreen";

import styles from "../styles/Home.module.css";



// export const App = () => {
//   const [cityInput, setCityInput] = useState("Paris");
//   const [triggerFetch, setTriggerFetch] = useState(true);
//   const [weatherData, setWeatherData] = useState(null);
//   const [currentTemperature, setCurrentTemperature] = useState(null);
//   const [currentHumidity, setCurrentHumidity] = useState();
//   const [dataStructure, setDataStructure] = useState("");




export const App = () => {
  const [cities, setCities] = useState(["Paris", "Marseille", "Lille"]);
  const [selectedCity, setSelectedCity] = useState("Paris");
  const [weatherData, setWeatherData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // IDs des villes pour OpenWeatherMap
  const cityIds = {
      "Paris": 2988507,
      "Marseille": 2995469,
      "Lille": 2998324
  };
  
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        // Construction de la chaîne d'IDs à partir de notre liste de villes
        const idString = Object.values(cityIds).join(',');
        
        const res = await fetch("api/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: "group", ids: idString }),
        });
        
        const data = await res.json();
        
        // Traitement des données pour toutes les villes
        const processedData = {};
        
        if (data.list && Array.isArray(data.list)) {
          data.list.forEach(cityData => {
            // Trouver le nom de la ville correspondant à cet ID
            const cityName = Object.keys(cityIds).find(name => cityIds[name] === cityData.id);
            
            if (cityName) {
              processedData[cityName] = {
                temperature: cityData.main?.temp !== undefined ? (cityData.main.temp - 273.15).toFixed(1) : null, // Conversion de Kelvin à Celsius
                humidity: cityData.main?.humidity !== undefined ? cityData.main.humidity : null
              };
            }
          });
        }
        
        setWeatherData(processedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données météo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getData();
  }, []);
  
  // Fonction pour changer la ville sélectionnée
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };
  
  return (
    <div className="weather-container" style={{ 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      background: 'linear-gradient(to bottom, #f5f7fa, #c3cfe2)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        Météo en France
      </h2>
      
      {/* Sélecteur de ville */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px',
        marginBottom: '20px'
      }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            style={{ 
              padding: '8px 16px',
              backgroundColor: selectedCity === city ? '#4a90e2' : '#e0e0e0',
              color: selectedCity === city ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {city}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Chargement des données météo...
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          padding: '20px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 10px 10px 0', color: '#555' }}>Température</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0',
              color: '#e74c3c'
            }}>
              {weatherData[selectedCity]?.temperature !== null ? `${weatherData[selectedCity]?.temperature}°C` : 'N/A'}
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 10px', color: '#555' }}>Humidité</h3>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold',
              margin: '0',
              color: '#3498db'
            }}>
              {weatherData[selectedCity]?.humidity !== null ? `${weatherData[selectedCity]?.humidity}%` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;


  
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const res = await fetch("api/data", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           // body: JSON.stringify({ cityInput }),
//         });
        
//         const data = await res.json();
//         console.log("Données reçues:", data);
        
//         // Enregistre la structure des données pour le débogage
//         setDataStructure(JSON.stringify(data, null, 2));
        
//         // Sauvegarde des données complètes
//         setWeatherData(data);
        
//         // Essayer différents chemins possibles pour la température
//         if (data.current && data.current.temperature_2m !== null) {
//           setCurrentTemperature(data.current.temperature_2m);
//         } else if (data.temperature_2m !== null) {
//           setCurrentTemperature(data.temperature_2m);
//         }
        
//         // Essayer différents chemins possibles pour l'humidité
//         if (data.current && data.current.relative_humidity_2m !== null) {
//           setCurrentHumidity(data.current.relative_humidity_2m);
//         } else if (data.relative_humidity_2m !== null) {
//           setCurrentHumidity(data.relative_humidity_2m);
//         }
//         if (data.current && data.current.relative_humidity_2m !== undefined) {
//           setCurrentHumidity(data.current.relative_humidity_2m);
//         } else if (data.current && data.current.humidity_2m !== undefined) {
//           setCurrentHumidity(data.current.humidity_2m);
//         } else if (data.relative_humidity_2m !== undefined) {
//           setCurrentHumidity(data.relative_humidity_2m);
//         } else if (data.humidity_2m !== undefined) {
//           setCurrentHumidity(data.humidity_2m);
//         }
        
//         console.log("Température extraite:", currentTemperature);
//         console.log("Humidité extraite:", currentHumidity);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des données météo:", error);
//       }
//     };
    
//     getData();
//   }, [triggerFetch]);
  
//   return (
//     <div className="weather-container">
//       <h2>Météo pour {cityInput}</h2>
      
//       {currentTemperature !== null ? (
//         <p>Température actuelle : {currentTemperature}°C</p>
//       ) : (
//         <p>Chargement de la température...</p>
//       )}
      
//       {currentHumidity !== null ? (
//         <p>Humidité actuelle : {currentHumidity}%</p>
//       ) : (
//         <p>Chargement de l'humidité...</p>
//       )}
      
//       <div>
//         <h3>Structure des données (pour débogage) :</h3>
//         <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto' }}>
//           {dataStructure || "Aucune donnée reçue"}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default App;


// export const App = () => {
//   const [cityInput, setCityInput] = useState("Riga");
//   const [triggerFetch, setTriggerFetch] = useState(true);
//   const [weatherData, setWeatherData] = useState();
//   const [unitSystem, setUnitSystem] = useState("metric");
//   const [currentTemperature,setCurrentTemperature] = useState();
//   const [currentHumidity,setCurrentHumidity] = useState();

//     useEffect(() => {
//         const getData = async () => {
//             const res = await fetch("api/data", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 // body: JSON.stringify({ cityInput }),
//             });
//             const data = await res.json();
//             console.log(data);
//             setCurrentTemperature(data.current.temperature_2m);
//             setCurrentHumidity(data.relative_humidity_2m);
            
//         };
//         getData();
//     }, []);
  

//     return <p>Current Temperature : {currentTemperature}, Current Humidity : {currentHumidity} </p>;
          
//   }

//   export default App;
  

    

  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await fetch("api/data", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ cityInput }),
  //     });
  //     const data = await res.json();
  //     setWeatherData({ ...data });
  //     setCityInput("");
  //   };
  //   getData();
  // }, [triggerFetch]);

//   const changeSystem = () =>
//     unitSystem === "metric"
//       ? setUnitSystem("imperial")
//       : setUnitSystem("metric");

//   return currentTemperature && !currentTemperature.message ? (
//     <div className={styles.wrapper}>
//       <MainCard
//         //city={weatherData.name}
//         country={currentTemperature.sys.country}
//         description={currentTemperature.weather[0].description}
//         iconName={currentTemperature.weather[0].icon}
//         unitSystem={unitSystem}
//         currentTemperature={currentTemperature}
//       />
//       <ContentBox>
//         <Header>
//           <DateAndTime currentTemperature={currentTemperature} unitSystem={unitSystem} />
//           <Search
//             placeHolder="Search a city..."
//             value={cityInput}
//             onFocus={(e) => {
//               e.target.value = "";
//               e.target.placeholder = "";
//             }}
//             onChange={(e) => setCityInput(e.target.value)}
//             onKeyDown={(e) => {
//               e.keyCode === 13 && setTriggerFetch(!triggerFetch);
//               e.target.placeholder = "Search a city...";
//             }}
//           />
//         </Header>
//         <MetricsBox weatherData={weatherData} unitSystem={unitSystem} />
//         <UnitSwitch onClick={changeSystem} unitSystem={unitSystem} />
//       </ContentBox>
//     </div>
//   ) : currentTemperature && currentTemperature.message ? (
//     <ErrorScreen errorMessage="City not found, try again!">
//       <Search
//         onFocus={(e) => (e.target.value = "")}
//         onChange={(e) => setCityInput(e.target.value)}
//         onKeyDown={(e) => e.keyCode === 13 && setTriggerFetch(!triggerFetch)}
//       />
//     </ErrorScreen>
//   ) : (
//     <LoadingScreen loadingMessage="Loading data..." />
//   );
// };

//export default App;
