import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postServices from "./post.query.services.js"

export const query = {
    getAllPosts: {
        type:  new GraphQLObjectType({
            name:"getAllPosts",
            fields:{
                message:{type:GraphQLString},
                statusCode:{type:GraphQLInt},
                data:{
                    type:new GraphQLList(new GraphQLObjectType({
                        name:"allPosts",
                        fields:{
                            _id:{type:GraphQLID},
                            content:{type:GraphQLString},
                            images:{
                                type:new GraphQLList(new GraphQLObjectType({
                                    name:"allImages",
                                    fields:{
                                        secure_url:{type:GraphQLString},
                                        public_id:{type:GraphQLString}
                                    }
                                }))
                            }
                        }
                    }))
                }
            }
        }),
        resolve:postServices.getAllPosts
    }
}

export const mutation = {
    likePost: {
        type: GraphQLString,
        resolve: () => {
            console.log("welcome to social app ");
        }
    }
}