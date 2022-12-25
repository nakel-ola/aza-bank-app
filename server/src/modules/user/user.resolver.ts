/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
// import * as GraphQLUpload from "graphql-upload/GraphQLUpload.js";
import { GraphQLUpload } from "graphql-upload-minimal"
import { MessageDto } from "../transaction/dto/message.dto";
import { GetUser } from "./decorators/get-user.decorator";
import { TokenDto, UserDto, ValidateDto } from "./dto";
import {
  ChangePasswordInput,
  ForgetPasswordInput,
  LoginInput,
  RegisterInput,
  ValidateCodeInput,
} from "./dto/input";
import { FileUpload } from "./interface/file-upload.interface";
import { JwtGuard } from "./jwt.guard";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => TokenDto)
  async register(@Args("input") input: RegisterInput): Promise<TokenDto> {
    return await this.userService.register(input);
  }

  @Mutation(() => TokenDto)
  async login(@Args("input") input: LoginInput): Promise<TokenDto> {
    return await this.userService.login(input);
  }

  @Mutation(() => MessageDto)
  async forgetPassword(
    @Args("input") input: ForgetPasswordInput
  ): Promise<MessageDto> {
    return await this.userService.forgetPassword(input);
  }

  @Mutation(() => ValidateDto)
  async validateCode(
    @Args("input") input: ValidateCodeInput
  ): Promise<ValidateDto> {
    return await this.userService.validateCode(input);
  }

  @Mutation(() => TokenDto)
  async changePassword(
    @Args("input") input: ChangePasswordInput
  ): Promise<TokenDto> {
    return await this.userService.changePassword(input);
  }

  @UseGuards(JwtGuard)
  @Query(() => UserDto)
  user(@GetUser() user: UserDto): UserDto {
    return user;
  }

  @UseGuards(JwtGuard)
  @Mutation(() => MessageDto)
  async updatePhotoUrl(
    @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
    @GetUser() user: UserDto
  ) {
    return this.userService.updatePhotoUrl(file, user);
  }
}
