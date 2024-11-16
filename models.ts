export interface Topic {
    id: number;
    name: string;
}

export interface Post {
    id: number;
    user_id: number;
    topic_id: number;
    content: string;
    timestamp: string;
    rating: number;
    likes: number[];
}

export interface Login {
    username: string;
    password: string;
}

export interface Register {
    username: string;
    password: string;
    email: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    friends: number[];
    location: string;
    age: number;
    rating: number;
    activity: string;
}