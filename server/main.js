import { Meteor } from "meteor/meteor";
import "./publications";
import "./methods";
import "./migrations";

Meteor.startup(() => {
  Migrations.migrateTo('latest');
})
