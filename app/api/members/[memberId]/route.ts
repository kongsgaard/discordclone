import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {

    if (!params.memberId) {
      return new NextResponse("MemberId missing", { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("SeverId missing", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { role } = await req?.json();
    
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id
              }
            },
            data: {
              role: role
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    });


    if (!server) {
      return new NextResponse("Could not find member", { status: 500 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    if (!params.memberId) {
      return new NextResponse("MemberId missing", { status: 400 });
    }

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("SeverId missing", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            serverId: serverId,
            profileId: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          }
        }
      }
    });


    if (!server) {
      return new NextResponse("Could not find member", { status: 500 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }

}
