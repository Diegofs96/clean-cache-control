import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/usescases";

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0;
	insertCallsCount = 0;
	deleteKey: string;
	insertKey: string;

	delete(key: string): void {
		this.deleteCallsCount++;
		this.deleteKey = key;
	}

	insert(key: string): void {
		this.insertCallsCount++;
		this.insertKey = key;
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
		expect(cacheStore.deleteKey).toBe("purchases");
	});

	test("should not insert new Cache if delete fails", () => {
		const { cacheStore, sut } = makeSut();
		jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
			throw new Error();
		});
		const promise = sut.save();
		expect(cacheStore.insertCallsCount).toBe(0);
		expect(promise).rejects.toThrow();
	});

	test("should insert new Cache if delete succeeds", async () => {
		const { cacheStore, sut } = makeSut();
		await sut.save();
		expect(cacheStore.deleteCallsCount).toBe(1);
		expect(cacheStore.insertCallsCount).toBe(1);
		expect(cacheStore.insertKey).toBe("purchases");
	});
});
