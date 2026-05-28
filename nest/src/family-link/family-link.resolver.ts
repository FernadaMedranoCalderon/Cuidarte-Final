import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { FamilyLinkService } from './family-link.service';
import { FamilyLinkDTO } from '../entities/dto/FamilyLink/FamilyLinkDTO';
import { UpdateFamilyLinkDTO } from '../entities/dto/FamilyLink/UpdateFamilyLinkDTO';

@Resolver(() => FamilyLinkDTO)
export class FamilyLinkResolver {
    constructor(private service: FamilyLinkService) { }

    @Mutation(() => FamilyLinkDTO)
    createFamilyLink(
        @Args('familyId', { type: () => Int }) familyId: number,
        @Args('linkCode') linkCode: string,
    ) {
        return this.service.create(familyId, linkCode);
    }

    @Mutation(() => FamilyLinkDTO)
    updateFamilyLink(@Args('dto') dto: UpdateFamilyLinkDTO) {
        return this.service.update(dto.id, dto.isActive);
    }

    @Mutation(() => Boolean)
    deactivateFamilyLink(@Args('id', { type: () => Int }) id: number) {
        return this.service.deactivate(id).then(() => true);
    }

    @Query(() => [FamilyLinkDTO])
    familyLinks(@Args('familyId', { type: () => Int }) id: number) {
        return this.service.findByFamily(id);
    }
}