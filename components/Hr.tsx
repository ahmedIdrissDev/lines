  "use client";
  import { handelUsersPresents } from "@/lib/Presents";
  import { store } from "@/store";
  import { Employee } from "@/types";
  import { UserRoundPlus } from "lucide-react";
  import React, { FormEvent, useState } from "react";
import Welcome from "./kits/welcome";
import Form from "./kits/from";

  const Hr = () => {
    const [open, setOpen] = useState(false);
    const [text, settext] = useState<String>("");
    const openclose = () => (open ? setOpen(false) : setOpen(true));
    const { data, setdata } = store();
    async function HendleAddEmployes() {
      
      try {
       if(text.length < 6 ) return false 
        const date = new Date().getDay();
        const updateuser = data.map((user) =>
          text.includes(user.Matricule)
            ? { ...user, status: "active" }
            : { ...user, status: "inactive" }
        ) as Employee[];
        setdata(updateuser);
        const responseTodelet = await fetch(
          "https://sheetdb.io/api/v1/64phcp112fjkc/all",
          {
            method: "DELETE",
          }
        );
        const isok = await responseTodelet.json();
        console.log(isok);
        const responseToUpdate = await fetch(
          "https://sheetdb.io/api/v1/64phcp112fjkc",
          {
            method: "POST",
            cache: "no-cache",
            body: JSON.stringify(updateuser),
            headers: {
              "Content-Type": "application/json",
            },
            referrerPolicy: "same-origin",
          }
        );
        const ok = await responseToUpdate.json();
        console.log(ok);
      } catch (error) {
        console.log(error);
      }
    }
    return (
      <>
              <button onClick={openclose} className='w-40 cursor-pointer h-11 bg-tgcc-500 text-white rounded-md'>Get started</button>

        {open && (
          <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-end items-center inset-0">
            <div className="bg-white flex p-3 flex-col gap-1.5   w-1/2 h-full rounded-md border border-neutral-200">
              <Welcome/>
              <Form/>
            </div>
          </div>
        )}
      </>
    );
  };

  export default Hr;
