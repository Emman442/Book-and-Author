const graphql = require("graphql");
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const { 
  GraphQLObjectType,
   GraphQLID,
   GraphQLInt,
   GraphQLSchema,
   GraphQLList,
   GraphQLNonNull,
   GraphQLString } = graphql;
const _ = require("lodash");
//dummy data

// var books = [
//   { name: "Name of the wind", genre: "fantasy", id: "1", authorId: "1" },
//   { name: "The Final Empire", genre: "Derahack", id: "2", authorId: "2" },
//   { name: "Long Earth", genre: "Sci-Fii", id: "3", authorId: "3" },
//   { name: "Fucking Gospel", genre: "Deep Fantansies", id: "4", authorId: "2" },
//   { name: "Long Earth", genre: "Sci-Fii", id: "5", authorId: "3" },
//   { name: "Long Earth", genre: "Sci-Fii", id: "6", authorId: "1" },
//   { name: "Long Earth", genre: "Sci-Fii", id: "7", authorId: "3" },
// ];
// var authors = [
//   { name: "ndema Emmanuel", age: "44", id: "1" },
//   { name: "Adora Nwodo", age: "34", id: "2" },
//   { name: "Chisom Nwokwu", age: 25, id: "3" },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args){
        // return _.find(authors, {id: args})
        return Author.findById(parent.authorId)
      }
    }
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args){
        // return _.filter(books, {authorId: parent.id})
        return Book.find({authorId: parent.id})
      }
    }
  }),
});

//Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id)
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id)
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return Author.find()
      }
    }
  },
});
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
