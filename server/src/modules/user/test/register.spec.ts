import gql from "graphql-tag";
import request from "supertest-graphql";
import { getGqlErrorStatus } from "../../../test/gqlStatus";
import { TestManager } from "../../../test/testManager";
import { TokenDto } from "../dto";
import { User } from "../schema/user.schema";
import { registerUser, userStub } from "./subs/user.sub";

describe("register", () => {
  const testManager = new TestManager();

  beforeAll(async () => {
    await testManager.beforeAll();
  });

  afterAll(async () => {
    await testManager.afterAll();
  });

  describe("given that the user does not already exist", () => {
    describe("when a register mutation is executed", () => {
      let register: TokenDto;

      beforeAll(async () => {
        const response = await request<{ register: TokenDto }>(
          testManager.httpServer
        )
          .mutate(
            gql`
              mutation Register($input: RegisterInput!) {
                register(input: $input) {
                  access_token
                }
              }
            `
          )
          .variables({
            input: registerUser,
          })
          .expectNoErrors();
        register = response.data.register;
      });

      test("then the response should be the access token for the newly created user", () => {
        expect(register).toBeDefined();
      });

      test("then the new user should be created", async () => {
        const user = await testManager
          .getCollection("users")
          .findOne({ email: userStub.email });
        expect(user).toBeDefined();
      });
    });
  });

  // describe("given that the user does already exist", () => {
  //   describe("when a createUser mutation is executed", () => {
  //     let resStatus: number;
  //     beforeAll(async () => {
  //       const { response } = await request<{ createUser: User }>(
  //         testManager.httpServer
  //       )
  //         .mutate(
  //           gql`
  //             mutation Register($input: RegisterInput!) {
  //               register(input: $input) {
  //                 access_token
  //               }
  //             }
  //           `
  //         )
  //         .variables({
  //           input: registerUser,
  //         });
  //       resStatus = getGqlErrorStatus(response);
  //     });

  //     test("then the response should be a 422", () => {
  //       expect(resStatus).toBe("422");
  //     });
  //   });
  // });
});
