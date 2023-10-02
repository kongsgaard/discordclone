import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn, redirectToSignIn } from "@clerk/nextjs";
import { Profile } from "@prisma/client";
import assert from "assert";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  }
}

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
    throw new Error("Wont happen, for some reason type is not inferred from above link");
  }


  if (!params.inviteCode) {
    return redirect("/");
  }

  const existsingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          id: profile.id
        }
      }
    }
  });

  if (existsingServer) {
    redirect(`/servers/${existsingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id
          }
        ]
      }
    }
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }



  return ( 
    <div>
      Hello
    </div>
   );
}
 
export default InviteCodePage;