export default () =>
  `SELECT DISTINCT ?item ?itemLabel ?img ?start ?end WHERE {
  ?item wdt:P31 wd:Q3024240;
  OPTIONAL {
    ?item wdt:P41 ?img;
      wdt:P580 ?start;
      wdt:P582 ?end.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?start`;
