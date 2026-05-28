import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogDTO } from '../entities/dto/ActivityLog/ActivityLogDTO';
import { CreateActivityLogDTO } from '../entities/dto/ActivityLog/CreateActivityLog';
import { UpdateActivityLogDTO } from '../entities/dto/ActivityLog/UpdateActivityLog';

@Resolver(() => ActivityLogDTO)
export class ActivityLogResolver {
  constructor(private service: ActivityLogService) {}

  @Mutation(() => ActivityLogDTO)
  createActivityLog(@Args('dto') dto: CreateActivityLogDTO) {
    return this.service.create(dto);
  }

  @Query(() => ActivityLogDTO, { nullable: true })
  activityLog(@Args('id', { type: () => Int }) id: number) {
    return this.service.findById(id);
  }

  @Query(() => [ActivityLogDTO])
  activityLogsByActivity(@Args('activityId', { type: () => Int }) activityId: number) {
    return this.service.findByActivity(activityId);
  }

  @Query(() => [ActivityLogDTO])
  allActivityLogs() {
    return this.service.findAll();
  }

  @Mutation(() => ActivityLogDTO)
  updateActivityLog(@Args('id', { type: () => Int }) id: number, @Args('dto') dto: UpdateActivityLogDTO) {
    return this.service.update(id, dto);
  }

  @Mutation(() => Boolean)
  deleteActivityLog(@Args('id', { type: () => Int }) id: number) {
    return this.service.delete(id);
  }
}
