import fetchItems from "../../sparql/fetchItems";

const query = (label) =>
  `SELECT DISTINCT ?item ?itemLabel ?itemDescription
WHERE {
  ?item wdt:P31 wd:Q5.
  ?item ?label '${label}'@en .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY DESC(?item)
LIMIT 5
`;

export default (label) => {
  const q = query(label);

  let keys = {
    item: "id",
    itemLabel: "string",
    itemDescription: "string",
  };

  return fetchItems(q, keys);
};
