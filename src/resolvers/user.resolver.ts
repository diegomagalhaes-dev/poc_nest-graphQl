import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import User from 'src/models/user.entity';
import RepoService from 'src/repo.service';
import UserInput from './input/user.input';

@Resolver()
class UserResolver {
  // Querys: buscam dados
  // Mutations: alteram dados

  constructor(private readonly repoService: RepoService) {}

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return this.repoService.userRepo.find();
  }

  @Query(() => User, { nullable: true })
  public async getUser(@Args('id') id: number): Promise<User> {
    return this.repoService.userRepo.findOne(id);
  }

  @Mutation(() => User)
  public async createUser(@Args('data') input: UserInput): Promise<User> {
    const user = this.repoService.userRepo.create({ email: input.email });
    return this.repoService.userRepo.save(user);
  }
}

export default UserResolver;
