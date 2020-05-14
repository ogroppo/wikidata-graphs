import wdk from "wikidata-sdk";

export default function fetchItems(query, idKey, keys) {
  const url = wdk.sparqlQuery(query);

  return fetch(url)
    .then((response) => response.json())
    .then((response) => {
      let itemsMap = {};

      response.results.bindings.forEach((element) => {
        let id = parseValue(element[idKey]);
        itemsMap[id] = itemsMap[id] || { id };
        let item = itemsMap[id];
        response.head.vars.forEach((variable) => {
          if (variable === idKey) return;
          let value = parseValue(element[variable]);
          switch (keys[variable]) {
            case "string":
              if (!item[variable]) item[variable] = value;
              break;
            case "array":
              if (!item[variable]) item[variable] = [];
              if (value !== undefined && item[variable].indexOf(value) < 0)
                item[variable].push(value);
            default:
              break;
          }
        });
      });
      let results = Object.values(itemsMap);
      return results;
    });
}

const parseValue = (keyObject) => {
  if (!keyObject) return undefined;

  switch (keyObject.type) {
    case "literal":
      return keyObject.value;
    case "uri":
      return parseUri(keyObject.value);
    default:
      break;
  }
};

const parseUri = (uri) => {
  // ex: http://www.wikidata.org/entity/statement/
  if (uri.match(/http.*\/entity\/statement\//)) {
    return convertStatementUriToGuid(uri);
  }

  return (
    uri
      // ex: http://www.wikidata.org/entity/
      .replace(/^https?:\/\/.*\/entity\//, "")
      // ex: http://www.wikidata.org/prop/direct/
      .replace(/^https?:\/\/.*\/prop\/direct\//, "")
  );
};

const convertStatementUriToGuid = (uri) => {
  // ex: http://www.wikidata.org/entity/statement/
  uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, "");
  const parts = uri.split("-");
  return parts[0] + "$" + parts.slice(1).join("-");
};
