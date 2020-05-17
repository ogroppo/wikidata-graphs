import wdk from "wikidata-sdk";
import parseResponse from "./parseResponse";

export default function fetchItems(query, keys, options = {}) {
  const url = wdk.sparqlQuery(query);

  return (
    fetch(url)
      .then((response) => response.json())
      //.then(wdk.simplify.sparqlResults)
      .then((response) => {
        if (options.skipParsing) return response;

        if (options.logResponse) console.log({ response });

        return parseResponse(response, keys);
      })
  );
}
