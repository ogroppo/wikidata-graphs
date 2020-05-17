import moment from "moment";

export default function parseResponse(response, keys) {
  let itemsMap = {};
  let itemKey = null;
  for (let variable in keys) {
    if (keys[variable] === "id") itemKey = variable;
  }

  if (!itemKey) throw new Error("Item key missing");

  response.results.bindings.forEach((element) => {
    let id = parseValue(element[itemKey]);
    itemsMap[id] = itemsMap[id] || { id };
    let item = itemsMap[id];
    response.head.vars.forEach((variable) => {
      if (variable === itemKey) return;
      let value = parseValue(element[variable]);
      switch (keys[variable]) {
        case "string":
          if (!item[variable]) item[variable] = value;
          break;
        case "moment":
          if (value && !item[variable]) item[variable] = moment(value);
          break;
        case "coords":
          if (value && !item[variable]) {
            const [lng, lat] = value
              .replace("Point(", "")
              .replace(")", "")
              .split(" ");

            item[variable] = [Number(lat), Number(lng)];
          }
          break;
        case "number":
          if (value && !item[variable]) {
            item[variable] = Number(value);
          }
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
