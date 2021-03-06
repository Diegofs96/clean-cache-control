import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/usescases";
import { SavePurchases } from "@/domain/usecases";
import { mockPurchases} from "@/data/tests";

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0;
	insertCallsCount = 0;
	deleteKey: string;
	insertKey: string;
	insertValues: Array<SavePurchases.Params> = [];

	delete(key: string): void {
		this.deleteCallsCount++;
		this.deleteKey = key;
	}

	insert(key: string, value: any): void {
		this.insertCallsCount++;
		this.insertKey = key;
		this.insertValues = value;
	}

	simulateDeleteError(): void {
		jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
			throw new Error();
		});
	}

	simulateInsertError(): void {
		jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
			throw new Error();
		});
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
		await sut.save(mockPurchases());
		expect(cacheStore.deleteCallsCount).toBe(1);
		expect(cacheStore.deleteKey).toBe("purchases");
	});

	test("should not insert new Cache if delete fails", async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateDeleteError();
		const promise = sut.save(mockPurchases());
		expect(cacheStore.insertCallsCount).toBe(0);
		await expect(promise).rejects.toThrow();
	});

	test("should insert new Cache if delete succeeds", async () => {
		const { cacheStore, sut } = makeSut();
		const purchases = mockPurchases();
		await sut.save(purchases);
		expect(cacheStore.deleteCallsCount).toBe(1);
		expect(cacheStore.insertCallsCount).toBe(1);
		expect(cacheStore.insertKey).toBe("purchases");
		expect(cacheStore.insertValues).toEqual(purchases);
	});

	test("should throw if insert throws", async () => {
		const { cacheStore, sut } = makeSut();
		cacheStore.simulateInsertError();
		const promise = sut.save(mockPurchases());
		await expect(promise).rejects.toThrow();
	});
});
