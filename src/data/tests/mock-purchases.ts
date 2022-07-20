import { SavePurchases } from "@/domain/usecases";
import  {faker} from '@faker-js/faker';

export const mockPurchases = (): Array<SavePurchases.Params> => [
	{
		id: faker.random.alphaNumeric(),
		date: faker.date.recent(),
		value: parseInt(faker.random.numeric(999)),
	},
	{
		id: faker.random.alphaNumeric(),
		date: faker.date.recent(),
		value: parseInt(faker.random.numeric(999)),
	},
];