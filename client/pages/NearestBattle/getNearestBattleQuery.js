import fetchItems from "../../sparql/fetchItems";

const query = (lat, lng) =>
  `SELECT ?place ?placeLabel ?placeDescription ?location ?distance ?images ?pointInTime
WHERE {
  SERVICE wikibase:around { 
    ?place wdt:P625 ?location . 
    bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral .
    bd:serviceParam wikibase:radius "100" . 
    bd:serviceParam wikibase:distance ?distance .
  } 
  ?place wdt:P31 wd:Q178561.
  OPTIONAL { ?place wdt:P18 ?images . }
  OPTIONAL { ?place wdt:P585 ?pointInTime . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ?distance
LIMIT 10
`;

export default (id, type) => {
  const q = query(id, type);

  console.log(q);

  let keys = {
    place: "id",
    placeLabel: "string",
    placeDescription: "string",
    location: "coords",
    distance: "number",
    images: "array",
    pointInTime: "moment",
  };

  return fetchItems(q, keys);
};
