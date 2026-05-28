import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { ActivityDTO } from '../entities/dto/Activity/ActivityDTO';
import { CreateActivityDTO } from '../entities/dto/Activity/CreateActivityDTO';
import { UpdateActivityDTO } from '../entities/dto/Activity/UpdateActivityDTO';

@Resolver(() => ActivityDTO)
export class ActivityResolver {
  constructor(private service: ActivityService) {}

  @Mutation(() => ActivityDTO)
  createActivity(@Args('dto') dto: CreateActivityDTO) {
    return this.service.create(dto);
  }

  @Query(() => [ActivityDTO])
  activitiesByElderly(@Args('elderlyId', { type: () => Int }) id: number) {
    return this.service.findByElderly(id);
  }

  @Query(() => ActivityDTO)
  activity(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Mutation(() => ActivityDTO)
  updateActivity(@Args('dto') dto: UpdateActivityDTO) {
    return this.service.update(dto);
  }

  @Mutation(() => Boolean)
  deleteActivity(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id).then(() => true);
  }
}