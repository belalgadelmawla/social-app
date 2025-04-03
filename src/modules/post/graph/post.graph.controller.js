import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
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
                            },
                            createdBy:{type:new GraphQLObjectType({
                                name:"userWhoCreatePost",
                                fields:{
                                    _id:{type:GraphQLID},
                                    userName:{type:GraphQLString},
                                    email:{type:GraphQLString},
                                    password:{type:GraphQLString},
                                    phone:{type:GraphQLString},
                                    gender:{type: new GraphQLEnumType({
                                        name:"gender",
                                        values:{
                                            male:{type:GraphQLString},
                                            female:{type:GraphQLString},
                                        }
                                    })},
                                    confirmEmail:{type:GraphQLBoolean},
                                    isDeleted:{type:GraphQLBoolean},
                                    viewers:{type:new GraphQLList(new GraphQLObjectType({
                                        name:"viewers",
                                        fields:{
                                            userId:{type:GraphQLID},
                                            time:{type:GraphQLString},
                                            count:{type:GraphQLInt}
                                        }
                                    }))}

                                }
                            })},
                            deletedBy:{type:GraphQLID},
                            likes:{
                                type:new GraphQLList(GraphQLID)},
                            isDeleted:{type:GraphQLBoolean}
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