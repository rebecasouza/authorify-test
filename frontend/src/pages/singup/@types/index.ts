export interface IUser {
	id: number;
	name: string;
	email: string;
	imageUrl: string;
}

export interface IRequestUser {
	name: string;
	email: string;
	imageUrl?: string;
}
