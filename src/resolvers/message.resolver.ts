import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import Message from 'src/models/message.entity';
import User from 'src/models/user.entity';
import RepoService from 'src/repo.service';
import MessageInput from './input/message.input';

@Resolver(Message)
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

  @Mutation(() => Message)
  public async createMessage(
    @Args('data') input: MessageInput,
  ): Promise<Message> {
    const message = new Message();
    message.content = input.content;

    if (input.user.connect) {
      message.userId = input.user.connect.id;
    } else {
      if (!input.user.create) {
        throw new Error(
          'Either pass a valid user id for the message or provide a new user using the create input option',
        );
      }
      const userToSave = this.repoService.userRepo.create({
        email: input.user.create.email,
      });
      const savedUser = await this.repoService.userRepo.save(userToSave);
      message.userId = savedUser.id;
    }
    return this.repoService.messageRepo.save(message);
  }

  @ResolveField()
  public async user(@Parent() parent: Message): Promise<User> {
    return this.repoService.userRepo.findOne(parent.userId);
  }
}

export default MessageResolver;
