import { AiOutlineLoading } from "react-icons/ai";

export default function LoadingScreen() {
    return <div className="fixed top-0 bottom-0 right-0 left-0 bg-black/75 z-1001 flex justify-center items-center">
        <AiOutlineLoading className="animate-spin scale-1000 text-white" />
    </div>
}