import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/usescases";

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0;
	key: string;

	delete(key: string): void {
		this.deleteCallsCount++;
		this.key = key;
	}
}

type SutTypes = {
	sut: LocalSavePurchases;
	cacheStore: CacheStoreSpy;
};

// aplicando o Pattern Factory para sempre retornar um objeto pronto
const makeSut = (): SutTypes => {
	const cacheStore = new CacheStoreSpy();
	const sut = new LocalSavePurchases(cacheStore);

	return {
		sut,
		cacheStore,
	};
};

describe("LocalSavePurchases", () => {
	test("should no delete cache on sut.init", () => {
		const { cacheStore } = makeSut();
		expect(cacheStore.deleteCallsCount).toBe(0);
	});

	test("should delete old cache on sut.save", async () => {
		const { cacheStore, sut } = makeSut();
		await sut.save();
		expect(cacheStore.deleteCallsCount).toBe(1);
		expect(cacheStore.key).toBe("purchases");
	});
});
