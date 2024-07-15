// backend/psql-setup-script.js
const config = require("./config");
const { sequelize } = require("./db/models");

sequelize.showAllSchemas({ logging: true }).then(async (data) => {
  console.log("SCHEMA === ", config.schema);
  if (!data.includes(config.schema)) {
    const schema = await sequelize.createSchema(process.env.SCHEMA);
  }
});
