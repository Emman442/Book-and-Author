const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const {graphqlHTTP} = require("express-graphql")
const schema = require("./schema/schema");
const app = express()
app.use(cors())
mongoose.connect(
  "Database connection Strng"
);
mongoose.connection.once("open", ()=>{
    console.log("Database Connected Successfully");
})
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));
app.listen(4000, ()=>{
    console.log("Server is listening for requests at port 4000");
})

