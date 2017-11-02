var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./gold_medals.sqlite');

/*
Returns a SQL query string that will create the Country table with four columns: name (required), code (required), gdp, and population.
*/

const createCountryTable = () => {
  return "CREATE TABLE Country (name TEXT NOT NULL, code INT NOT NULL, gdp INT, population INT)";
};

/*
Returns a SQL query string that will create the GoldMedal table with ten columns (all required): id, year, city, season, name, country, gender, sport, discipline, and event.
*/

const createGoldMedalTable = () => {
  return `CREATE TABLE GoldMedal (
    id INT PRIMARY KEY,
    year INT NOT NULL,
    city TEXT NOT NULL,
    season TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    gender TEXT NOT NULL,
    sport TEXT NOT NULL,
    discipline TEXT NOT NULL,
    event TEXT NOT NULL)`;
};

/*
Returns a SQL query string that will find the number of gold medals for the given country.
*/

const goldMedalNumber = country => {
  const stm = `SELECT COUNT(*) FROM GoldMedal WHERE country = '${country}'`;
    return stm;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most summer medals, along with the number of medals aliased to 'count'.
*/

const mostSummerWins = country => {
  const stm = `
    SELECT year, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    AND season = 'Summer'
    GROUP BY year
    ORDER BY Count(*) desc
    LIMIT 1
    `;
  return stm;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most winter medals, along with the number of medals aliased to 'count'.
*/

const mostWinterWins = country => {
  const stm = `
    SELECT year, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    AND season = 'Winter'
    GROUP BY year
    ORDER BY Count(*) desc
    LIMIT 1
    `;

  return stm;
};

/*
Returns a SQL query string that will find the year where the given country 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestYear = country => {
  const stm = `
    SELECT year, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    GROUP BY year
    ORDER BY Count(*) desc
    LIMIT 1
    `;

  return stm;
};

/*
Returns a SQL query string that will find the discipline this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestDiscipline = country => {
  const stm = `
    SELECT discipline, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    GROUP BY discipline
    ORDER BY Count(*) desc
    LIMIT 1
    `;

  return stm;
};

/*
Returns a SQL query string that will find the sport this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestSport = country => {
  const stm = `
    SELECT sport, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    GROUP BY sport
    ORDER BY Count(*) desc
    LIMIT 1
    `;
  return stm;
};

/*
Returns a SQL query string that will find the event this country has 
won the most medals, along with the number of medals aliased to 'count'.
*/

const bestEvent = country => {
  const stm = `
    SELECT event, COUNT(*) as count 
    FROM GoldMedal 
    WHERE country = '${country}'
    GROUP BY event
    ORDER BY Count(*) desc
    LIMIT 1
    `;
  return stm;
};

/*
Returns a SQL query string that will find the number of male medalists.
*/

const numberMenMedalists = country => {
  const stm = `
    SELECT COUNT(DISTINCT(name))
    FROM GoldMedal 
    WHERE country = '${country}'
    AND gender = 'Men'
    LIMIT 1
    `;
  return stm;
};

/*
Returns a SQL query string that will find the number of female medalists.
*/

const numberWomenMedalists = country => {
  const stm = `
    SELECT COUNT(DISTINCT(name))
    FROM GoldMedal 
    WHERE country = '${country}'
    AND gender = 'Women'
    LIMIT 1
    `;
  return stm;
};

/*
Returns a SQL query string that will find the athlete with the most medals.
*/

const mostMedaledAthlete = country => {
  const stm = `
    SELECT name
    FROM GoldMedal 
    WHERE country = '${country}'
    GROUP BY name
    ORDER BY Count(*) desc
    LIMIT 1
    `;

  return stm;
};

/*
Returns a SQL query string that will find the medals a country has won
optionally ordered by the given field in the specified direction.
*/

const orderedMedals = (country, field, sortAscending) => {
  let stm = `
    SELECT *
    FROM GoldMedal 
    WHERE country = '${country}'`;

  if (field) {
    let order = (sortAscending) ? "asc" : "desc";
    stm += ` ORDER BY ${field} ${order}`;
  }  

  return stm;
};

/*
Returns a SQL query string that will find the sports a country has
won medals in. It should include the number of medals, aliased as 'count',
as well as the percentage of this country's wins the sport represents,
aliased as 'percent'. Optionally ordered by the given field in the specified direction.
*/

const orderedSports = (country, field, sortAscending) => {
  const total = `(SELECT country, COUNT(*) as total FROM GoldMedal WHERE country = '${country}')`;

  let stm = `
    SELECT sport, count(*) as count,  count(*)/(t.total + 0.0)  * 100 as percent
    FROM GoldMedal
    LEFT JOIN ${total} as t ON t.country = GoldMedal.country
    WHERE GoldMedal.country = '${country}'
    GROUP BY sport`;

  if (field) {
    let order = (sortAscending) ? "asc" : "desc";
    stm += ` ORDER BY ${field} ${order}`;
  }  

  return stm;
};

module.exports = {
  createCountryTable,
  createGoldMedalTable,
  goldMedalNumber,
  mostSummerWins,
  mostWinterWins,
  bestDiscipline,
  bestSport,
  bestYear,
  bestEvent,
  numberMenMedalists,
  numberWomenMedalists,
  mostMedaledAthlete,
  orderedMedals,
  orderedSports
};
