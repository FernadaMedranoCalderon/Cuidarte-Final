import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { ContactService } from './contact.service';
import { ContactDTO } from '../entities/dto/Contact/ContactDTO';
import { CreateContactDTO } from '../entities/dto/Contact/CreateContactDTO';
import { UpdateContactDTO } from '../entities/dto/Contact/UpdateContactDTO';

@Resolver(() => ContactDTO)
export class ContactResolver {
  constructor(private service: ContactService) {}

  @Mutation(() => ContactDTO)
  createContact(@Args('dto') dto: CreateContactDTO) {
    return this.service.create(dto);
  }

  @Query(() => ContactDTO, { nullable: true })
  contact(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Query(() => [ContactDTO])
  contactsByElderly(@Args('elderlyId', { type: () => Int }) elderlyId: number) {
    return this.service.findByElderly(elderlyId);
  }

  @Query(() => [ContactDTO])
  allContacts() {
    return this.service.findAll();
  }

  @Mutation(() => ContactDTO)
  updateContact(@Args('dto') dto: UpdateContactDTO) {
    return this.service.update(dto);
  }

  @Mutation(() => Boolean)
  deleteContact(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}