import { IoWarning } from "react-icons/io5";
import { useAuthStore } from "../Hooks/AuthStore";
import { deleteUserAccount } from "../Services/CoreService/UserApi";

export default function AccountDeleting() {
  const logout = useAuthStore((s) => s.logout);

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to DELETE your account, you can't restore it in the future",
      )
    ) {
      if (confirm("This is your last chance")) {
        const response = await deleteUserAccount();
        alert(response.message);
        if (response.success) logout();
      }
    }
  };

  return (
    <div className="w-3/4 bg-white py-5 px-15">
      <div className="flex justify-start items-center border-b-2 border-gray-100">
        <h1 className="text-4xl font-bold py-10 text-red-500">
          Delete Account
        </h1>
      </div>
      <div className="my-5 p-10 rounded-2xl w-full bg-red-100">
        <div className="w-full flex items-center text-red-800 font-bold">
          <div className="w-[5%] font-bold mr-10">
            <IoWarning size={48} />
          </div>
          <p className="">
            After deleting your account, all data related to that account will
            disappear. Please consider carefully before proceeding.
          </p>
        </div>
        <div className="text-end mt-5">
          <button
            className="px-8 py-3 rounded-3xl text-white font-bold bg-red-700 hover:text-black hover:bg-gray-500 cursor-pointer"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
