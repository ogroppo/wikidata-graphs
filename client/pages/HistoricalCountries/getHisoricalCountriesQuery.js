export default () =>
  `SELECT DISTINCT ?item ?itemLabel (SAMPLE(?img) as ?img) (SAMPLE(?inception) as ?inception) (SAMPLE(?dissolved) as ?dissolved) 
WHERE {
  ?item wdt:P31 wd:Q3024240;
  OPTIONAL {
    ?item wdt:P41 ?img.
  }
  OPTIONAL {
    ?item wdt:P571 ?inception;
      wdt:P576 ?dissolved.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel
ORDER BY ?inception`;
