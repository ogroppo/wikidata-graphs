import fetchItems from "../../sparql/fetchItems";

const query = (id, type) => {
  let itemStatement = `BIND(wd:${id} as ?item)`;
  if (type === "mother") itemStatement = `wd:${id} wdt:P25 ?item`;
  if (type === "father") itemStatement = `wd:${id} wdt:P22 ?item`;
  if (type === "children") itemStatement = `wd:${id} wdt:P40 ?item`;
  if (type === "siblings") itemStatement = `wd:${id} wdt:P3373 ?item`;
  if (type === "spouses") itemStatement = `wd:${id} wdt:P26 ?item`;

  return `SELECT DISTINCT ?item ?itemLabel ?givenNameLabel ?familyNameLabel ?genderLabel ?image
WHERE {
  ${itemStatement}
  OPTIONAL { ?item wdt:P735 ?givenName. }
  OPTIONAL { ?item wdt:P734 ?familyName. }
  OPTIONAL { ?item wdt:P21 ?gender . }
  OPTIONAL { ?item wdt:P18 ?image . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`;
};

export default (id, type) => {
  const q = query(id, type);

  let keys = {
    item: "id",
    itemLabel: "string",
    givenNameLabel: "array",
    familyNameLabel: "array",
    genderLabel: "string",
    image: "string",
  };

  return fetchItems(q, keys);
};
