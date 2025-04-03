import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postcontroller from "./post/graph/post.graph.controller.js"

export const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "socialAppQuery",
            
            fields: {
                ...postcontroller.query
            }
        }),

        mutation:new GraphQLObjectType({
            name:"socialAppMutation",
            fields: {
                ...postcontroller.mutation
            }
        })
    })