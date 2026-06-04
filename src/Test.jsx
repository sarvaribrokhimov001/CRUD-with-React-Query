import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Test = () => {
  const api = "http://localhost:3000/users";
  const queryClient = useQueryClient();

  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
    image: "",
  });

  // GET
  const getUsers = async () => {
    const request = await fetch(api);

    if (!request.ok) {
      throw new Error("Tarmoqda xatolik ro'y berdi");
    }
    return request.json();
  };

  const {data = [], isLoading, isError, error,} = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ADD
  const addMutation = useMutation({
    mutationFn: async (user) => {
      const request = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!request.ok) {
        throw new Error("User qo'shishda xatolik ro'y berdi");
      }
      return request.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const request = await fetch(`${api}/${id}`, {
        method: "DELETE",
      });

      if (!request.ok) {
        throw new Error("Delete qilishda xatolik ro'y berdi");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success(`Item successfully deleted`)
    },
  });

const handleDelete = (id) => {
  const isConfirmed = window.confirm("Rostan ham o'chirmoqchimisiz ?");

  if (!isConfirmed) {
    toast.error("Item o'chirilmadi");
    return;
  } 
  deleteMutation.mutate(id);
};

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (user) => {
      const request = await fetch(`${api}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!request.ok) {
        throw new Error("Update qilishda xatolik ro'y berdi");
      }
      return request.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  // FORM SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if ( !newUser.name.trim() || !newUser.email.trim() || !newUser.age || !newUser.image.trim()) {
      toast.error("Barcha inputlarni to'ldiring !", {
        style : {
          background: "#111827",
          color: "#fff",
          border: "3px solid #ef4444",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: '18px'
        }
      }) 
      return;
    }

    if (newUser.id) {
      updateMutation.mutate(newUser);
    } else {
      addMutation.mutate(newUser);
    }

    setNewUser({
      id: "",
      name: "",
      email: "",
      age: "",
      image: "",
    });
  };

  // EDIT
  const handleEdit = (user) => {
    setNewUser(user);
  };

  if (isLoading) {
    return (
      <h1 className="text-center text-5xl text-red-600 font-bold"> Loading.... </h1>
    );
  }

  if (isError) {
    return <h1> {error.message} </h1>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-950 p-5">
      <form onSubmit={handleSubmit} className="flex gap-5 mb-8">
        <input
          className="w-[280px] h-[50px] p-2 rounded-2xl text-black bg-gray-400 pl-4 text-[20px] font-bold focus:bg-black focus:text-red-600"
          type="url"
          placeholder="Image URL"
          value={newUser.image}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              image: e.target.value,
            })
          }
        />

        <input
          className="w-[280px] h-[50px] p-2 rounded-2xl text-black bg-gray-400 pl-4 text-[20px] font-bold focus:bg-black focus:text-red-600"
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              name: e.target.value,
            })
          }
        />

        <input
          className="w-[280px] h-[50px] p-2 rounded-2xl text-black bg-gray-400 pl-4 text-[20px] font-bold focus:bg-black focus:text-red-600"
          type="number"
          placeholder="Age"
          value={newUser.age}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              age: e.target.value,
            })
          }
        />

        <input
          className="w-[280px] h-[50px] p-2 rounded-2xl text-black bg-gray-400 pl-4 text-[20px] font-bold focus:bg-black focus:text-red-600"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              email: e.target.value,
            })
          }
        />

        <button className="w-[140px] h-[50px] bg-black text-blue-600 font-bold border-[5px] text-[20px] rounded-[20px] mb-5 hover:border-white hover:bg-blue-600 hover:text-white"
          type="submit">
          {newUser.id ? "Update User" : "Add User"}
        </button>
      </form>

      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-4 text-2xl"> ID </th>
            <th className="p-4 text-2xl"> Image </th>
            <th className="p-4 text-2xl"> Name </th>
            <th className="p-4 text-2xl"> Age </th>
            <th className="p-4 text-2xl"> Email </th>
            <th className="p-4 text-2xl"> Actions </th>
          </tr>
        </thead>

        <tbody>
          {data.map((user) => (
            <tr key={user.id} className="text-center text-white">
              <td className="text-3xl font-bold"> {user.id} </td>
              <td className="flex justify-center p-3">
                <img src={user.image} alt={user.name} className="w-19 h-19 rounded-full" />
              </td>
              <td className="text-[20px] font-bold"> {user.name} </td>
              <td className="text-[20px] font-bold"> {user.age} </td>
              <td className="text-[20px] font-bold"> {user.email} </td>
              <td className="flex justify-center gap-3 p-3">
                <button className="w-[125px] h-[47px] rounded-[20px] bg-black text-yellow-400 font-bold border-[5px] text-[20px] border-yellow-400 hover:bg-yellow-400 
                  hover:text-white hover:border-[5px] hover:border-white" onClick={() => handleEdit(user)}>
                  Edit
                </button>

                <button className="w-[125px] h-[47px] rounded-[20px] bg-black text-red-600 font-bold border-[5px] text-[20px] border-red-600 hover:bg-red-600 
                  hover:text-white hover:border-[5px] hover:border-white"
                  onClick={() =>
                    // deleteMutation.mutate(user.id)
                    handleDelete(user?.id)
                  }>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Test;