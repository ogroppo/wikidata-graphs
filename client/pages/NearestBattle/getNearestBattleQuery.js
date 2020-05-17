import fetchItems from "../../sparql/fetchItems";

const battleWithCoord = (lat, lng) =>
  `SELECT ?battle ?battleLabel ?battleDescription ?location ?distance ?images ?pointInTime ?pointInTimePrecision
WHERE {
  SERVICE wikibase:around { 
    ?battle wdt:P625 ?location . 
    bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
    bd:serviceParam wikibase:radius "50" . 
    bd:serviceParam wikibase:distance ?distance .
  } 
  ?battle wdt:P31 wd:Q178561.
  OPTIONAL { ?battle wdt:P18 ?images . }
  OPTIONAL { ?battle p:P585/psv:P585 [ wikibase:timePrecision ?pointInTimePrecision ; wikibase:timeValue ?pointInTime ;] . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ?distance
`;

const battleWithPlace = (lat, lng) =>
  `SELECT ?battle ?battleLabel ?battleDescription ?location ?distance ?images ?pointInTime ?pointInTimePrecision
WHERE {
  ?battle wdt:P31 wd:Q178561;
  wdt:P276 ?place.
  SERVICE wikibase:around { 
    ?place wdt:P625 ?location . 
    bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
    bd:serviceParam wikibase:radius "50" . 
    bd:serviceParam wikibase:distance ?distance .
  } 
  ?battle wdt:P31 wd:Q178561.
  OPTIONAL { ?battle wdt:P18 ?images . }
  OPTIONAL { ?battle p:P585/psv:P585 [ wikibase:timePrecision ?pointInTimePrecision ; wikibase:timeValue ?pointInTime ;] . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ?distance
`;

export default (lat, lng) => {
  const battleWithCoordQuery = battleWithCoord(lat, lng);
  const battleWithPlaceQuery = battleWithPlace(lat, lng);

  let keys = {
    battle: "id",
    battleLabel: "string",
    battleDescription: "string",
    location: "coords",
    distance: "number",
    images: "array",
    pointInTime: "moment",
    pointInTimePrecision: "number",
  };

  return Promise.all([
    fetchItems(battleWithCoordQuery, keys),
    fetchItems(battleWithPlaceQuery, keys),
  ]);
};
