import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import Message from 'src/models/message.entity';
import RepoService from 'src/repo.service';
import MessageInput from './input/message.input';

@Resolver()
class MessageResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async getMessages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => [Message])
  public async getMessagesFromUser(
    @Args('userId') userId: number,
  ): Promise<Message[]> {
    return this.repoService.messageRepo.find({
      where: { userId },
    });
  }

  @Query(() => Message, { nullable: true })
  public async getMessage(@Args('id') id: number): Promise<Message> {
    return this.repoService.messageRepo.findOne(id);
  }
  //   @Mutation(() => User)
  //   public async createUser(@Args('data') input: UserInput): Promise<User> {
  //     const user = this.repoService.userRepo.create({ email: input.email });
  //     return this.repoService.userRepo.save(user);
  //   }
}

export default MessageResolver;
