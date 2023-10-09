"use client";

import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle

} from "@/components/ui/dialog";

import qs from "query-string";
import { Button } from "@/components/ui/button";
import { redirect, useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";
import { ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import queryString from "query-string";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="h-4 w-4"/>,
  [ChannelType.AUDIO]: <Mic className="h-4 w-4"/>,
  [ChannelType.VIDEO]: <Video className="mr-1 h-4 w-4"/>,
};

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { server, channel } = data;

  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteChannel";

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id
        }
      })

      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const icon = channel?.type ? iconMap[channel?.type] : iconMap[ChannelType.TEXT];

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center justify-between text-zinc-500">
            Are you sure, you want to do this<br/> 
            <span className="flex py-0.5 items-center text-indigo-500 font-bold">
              {icon}
              {channel?.name} 
            </span>
            will be permanently deleted
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-5">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleConfirm}
              variant="primary"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}