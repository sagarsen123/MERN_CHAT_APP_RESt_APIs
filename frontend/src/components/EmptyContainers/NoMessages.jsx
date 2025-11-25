import { MessageSquare } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";
import { useState } from "react";
const NoMessages = () => {
    const {sendMessage} = useChatStore()
    const [isSendingHi, setIsSendingHi] = useState(false)
    const handleSayHi = async() => {
        setIsSendingHi(true)
        try{
            await sendMessage({
                text: "Hi !!!"
            })
        }catch(err){
            toast.error("Unable to send the message")
        }finally{
            isSendingHi(false)
        }
    }
  return (
    <div className="w-full h-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">No Messages Yet!!</h2>
      </div>
      <button disabled={isSendingHi} type="button" className="btn btn-sm btn-secondary font-bold m-3 p-4" onClick={handleSayHi}>Say hii!</button>
    </div>
  );
};

export default NoMessages;
