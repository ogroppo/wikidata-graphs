export default class SparqlQuery {
  constructor() {
    this.query = "SELECT DISTINCT ";
  }

  select(...args) {
    return this;
  }

  optionalChild() {
    this.query += "WHERE{\n";
    if (this.vars.includes(["label", "description"]))
      this.query +=
        'SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }\n';

    this.query += "}\n";
  }
}

new SparqlQuery()
  .bind({ id, label: true, description: true })
  .optionalChild({
    of: "item",
    wdt: "P735",
    as: "givenName",
    label: true,
    parse: "array",
  })
  .optionalChild({
    of: "item",
    wdt: "P734",
    as: "familyName",
    label: true,
    parse: "array",
  })
  .optionalChild({ of: "item", wdt: "P21", as: "gender", label: true })
  .optionalChild({ of: "item", wdt: "P18", as: "image", parse: "array" })
  .getQuery();
