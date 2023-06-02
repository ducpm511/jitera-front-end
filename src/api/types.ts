export interface IUser {
    name: string;
    email: string;
    role: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    ballance: number;
}

export interface GenericResponse {
    status: string;
    message: string;
}

export interface ILoginResponse {
    status: string;
    access_token: string;
}

export interface IUserResponse {
    status: string;
    data: {
        user: IUser;
    };
}

export interface IBidItemRequest {
    title: string;
    content: string;
    image: string;
    user: string;
}

export interface IBidItemResponse {
    id: string;
    name: string;
    startedPrice: number;
    currentPrice: number;
    timeWindow: number;
    publishedAt: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IBidItemsResponse {
    status: string;
    data: {
        bidItems: IBidItemResponse[];
    };
}
