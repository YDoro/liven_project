import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors/access-denied-error";
import { AuthMiddleware } from "./auth-middleware";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccountModel } from "../../domain/models/account";
import { HttpRequest } from "../controllers/protocols/http";

interface SutTypes {
  loadAccountByTokenStub: LoadAccountByToken;
  sut: AuthMiddleware;
}

const makeLoadAccountbyToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByTokenStub();
};

const makeSUT = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountbyToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);
  return { sut, loadAccountByTokenStub };
};
const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "hashed_password",
});

const makeFakeRequest = (): HttpRequest => ({
  headers: { "x-access-token": "any_token" },
});

describe("auth middleware", () => {
  test("should return 403 if no authentication is provided", async () => {
    const { sut } = makeSUT();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test("should return 403 if loadAccountByToken returns null is provided", async () => {
    const { sut, loadAccountByTokenStub } = makeSUT();
    jest.spyOn(loadAccountByTokenStub,'load').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
  
  test("should return 200 if loadAccountByToken returns account is provided", async () => {
    const { sut, loadAccountByTokenStub } = makeSUT();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(200);
  });

  test("should call loadAccountByToken with correct accessToken", async () => {
    const { loadAccountByTokenStub, sut } = makeSUT();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");

    await sut.handle(makeFakeRequest());
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
