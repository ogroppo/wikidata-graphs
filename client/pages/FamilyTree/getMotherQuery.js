import getPersonQuery from "./getPersonQuery";
export default (id) => {
  return getPersonQuery(id, "mother");
};
