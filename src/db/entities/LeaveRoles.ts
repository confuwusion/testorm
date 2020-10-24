import { ROLES } from "@constants/Roles";
import { GuildMember } from "discord.js";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
class LeaveRoleEntity {

  @PrimaryColumn()
  readonly memberID: string;

  @Column({ type: `simple-array` })
  readonly roleIDs: ROLES.Manageable[];

}

export class LeaveRoles extends LeaveRoleEntity {

  constructor(
    readonly memberID: LeaveRoleEntity["memberID"],
    readonly roleIDs: LeaveRoleEntity["roleIDs"]
  ) {
    super();
  }

  static forMember({ id, roles }: GuildMember): LeaveRoles {
    const leaveRoleIDs = Object.values(ROLES.MANAGEABLE);

    const presentLeaveRoles = leaveRoleIDs
      .filter(leaveRoleID => roles.cache.has(leaveRoleID));

    return new LeaveRoles(id, presentLeaveRoles);
  }

}
