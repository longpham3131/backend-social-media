import { Types } from "mongoose";

export interface IUser{
    username: string,
    fullName: string,
    email: string,
    password: string,
    dateOfBirth: string,
    avatar: string,
    coverPicture: string,
    imageList: Types.Array<string>,
    groups: Types.ObjectId[],
    friends: Types.ObjectId[],
    friendsRequest: Types.ObjectId[],
    interests: IInterest[],
    address: IAddress,
    birthplace: IAddress,
    facebook: string,
    insta: string,
    twitter: string,
    occupation: string,
    isAdmin: boolean,
    isOnline: boolean,
    createAt: Date,
    status: number,

}

export interface IInterest{
    title: string,
    context: string,
}

export interface IAddress {
    district: string,
    province: string,
}
