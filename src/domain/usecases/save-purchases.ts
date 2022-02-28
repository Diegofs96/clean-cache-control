export interface SavePurchases {
	save: (purchases: Array<SavePurchases>) => Promise<void>;
}

namespace SavePurchases {
	export type Params = {
		id: string;
		date: Date;
		value: number;
	};
}
