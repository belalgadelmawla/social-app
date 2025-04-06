import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import * as postServices from "./post.query.services.js"
import * as postService from "./post.mutation.js"
import { userModel } from "../../../DB/models/user.model.js";

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
                            createdBy:{
                                type:new GraphQLObjectType({
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
                            }),
                        },
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
        type:  new GraphQLObjectType({
            name:"likepost",
            fields:{
                message:{type:GraphQLString},
                statusCode:{type:GraphQLInt},
                data: {
                    type: new GraphQLObjectType({
                        name: "SinglePostLike",
                        fields: {
                        content: { type: GraphQLString },
                        images: {
                            type: new GraphQLList(new GraphQLObjectType({
                            name: "SingleImage",
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString }
                            }
                        }))
                        },
                        likes: { type: new GraphQLList(GraphQLID) }
                    }
                    })
                }
                
            }
        }),
        args:{
            postId:{type:new GraphQLNonNull(GraphQLID)},
            authorization:{type:new GraphQLNonNull(GraphQLString)}
        },
        resolve: postService.likePost
    }
}