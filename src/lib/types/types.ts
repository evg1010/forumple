export type Message = {
	id: string;
	createdAt: string;
	content: string;
	reactions: null | any[];
	replyMessageContent: null | string;
	user: {
		id: string;
		name: string;
		avatar_url: string;
	};
};
