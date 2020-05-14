export default () =>
  `SELECT DISTINCT ?item ?itemLabel (SAMPLE(?img) as ?img) (SAMPLE(?start) as ?start) (SAMPLE(?end) as ?end) WHERE {
  ?item wdt:P31 wd:Q3024240;
  OPTIONAL {
    ?item wdt:P41 ?img;
      wdt:P580 ?start;
      wdt:P582 ?end.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel
ORDER BY ?start`;
